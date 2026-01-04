# How to Link LarngDuan POS to Google Sheets

Follow these steps to enable automatic sales recording to a Google Sheet.

## Step 1: Create the Google Sheet & Script

1. Go to [Google Sheets](https://sheets.google.com) and create a new **Blank Spreadsheet**.
2. Name it something like "LarngDuan Sales".
3. In the menu, go to **Extensions** > **Apps Script**.
4. In the code editor that opens, delete any existing code and paste the following:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // --- 1. Log Detailed Transaction ---
    var transactionSheet = ss.getSheetByName("Transactions");
    if (!transactionSheet) {
      transactionSheet = ss.insertSheet("Transactions");
      transactionSheet.appendRow(["Transaction ID", "Date", "Time", "Items", "Total", "Payment Method", "Timestamp"]);
      transactionSheet.getRange(1, 1, 1, 7).setFontWeight("bold");
    }
    
    // Ensure data.items is a string if it's an array
    var itemsStr = Array.isArray(data.items) ? data.items.join(", ") : data.items;

    transactionSheet.appendRow([
      data.id,
      "'"+data.date, // Force string format for date to avoid auto-formatting issues
      data.time,
      itemsStr,
      data.total,
      data.paymentMethod,
      data.timestamp
    ]);
    
    // --- 2. Log to Specific Payment Method Sheet (log_Cash or log_QR) ---
    var paymentSheetName = (data.paymentMethod === 'CASH') ? 'log_Cash' : 'log_QR';
    var paymentSheet = ss.getSheetByName(paymentSheetName);
    
    if (!paymentSheet) {
      paymentSheet = ss.insertSheet(paymentSheetName);
      paymentSheet.appendRow(["Transaction ID", "Date", "Time", "Items", "Total", "Original Payment Method", "Timestamp"]);
      paymentSheet.getRange(1, 1, 1, 7).setFontWeight("bold");
    }
    
    paymentSheet.appendRow([
      data.id,
      "'"+data.date,
      data.time,
      itemsStr,
      data.total,
      data.paymentMethod,
      data.timestamp
    ]);

    // --- 3. Update Daily Revenue (Aggregated) ---
    var dailySheet = ss.getSheetByName("Daily Revenue");
    if (!dailySheet) {
      dailySheet = ss.insertSheet("Daily Revenue");
      dailySheet.appendRow(["Date", "Total Revenue", "Cash Sales", "QR Sales", "Transaction Count"]);
      dailySheet.getRange(1, 1, 1, 5).setFontWeight("bold");
    }
    
    var dateString = data.date; 
    var paymentMethod = data.paymentMethod; 
    var amount = Number(data.total);
    
    var lastRow = dailySheet.getLastRow();
    var foundRow = -1;
    
    // Simple linear search for the date (sufficient for yearly data ~365 rows)
    if (lastRow > 1) {
      var dates = dailySheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues(); // use getDisplayValues to match string representation
      for (var i = 0; i < dates.length; i++) {
        if (dates[i][0] === dateString) {
          foundRow = i + 2; // +2 offset (header + 0-index)
          break;
        }
      }
    }
    
    if (foundRow > -1) {
      // Update existing row
      var range = dailySheet.getRange(foundRow, 2, 1, 4); 
      var values = range.getValues()[0];
      
      var currentTotal = Number(values[0]) || 0;
      var currentCash = Number(values[1]) || 0;
      var currentQR = Number(values[2]) || 0;
      var currentCount = Number(values[3]) || 0;
      
      var newTotal = currentTotal + amount;
      var newCash = currentCash + (paymentMethod === 'CASH' ? amount : 0);
      var newQR = currentQR + (paymentMethod === 'QR' ? amount : 0);
      var newCount = currentCount + 1;
      
      range.setValues([[newTotal, newCash, newQR, newCount]]);
    } else {
      // Create new row
      var newCash = (paymentMethod === 'CASH' ? amount : 0);
      var newQR = (paymentMethod === 'QR' ? amount : 0);
      
      dailySheet.appendRow([
        "'"+dateString, // Force string
        amount,
        newCash,
        newQR,
        1
      ]);
    }

    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

5. Click the **Save** icon (disk) or press `Ctrl + S`. Name the project "Sales Recorder".

## Step 2: Deploy the Web App

1. Click the blue **Deploy** button (top right) > **New deployment**.
2. Click the gear icon (Select type) next to "Select type" and choose **Web app**.
3. Fill in the following details:
   - **Description**: Sales API
   - **Execute as**: `Me` (should be your email)
   - **Who has access**: `Anyone` (Expected: "Anyone" or "Anyone with Google account". **IMPORTANT: You must select "Anyone"** so the POS app can send data without a login popup).
4. Click **Deploy**.
5. You may be asked to **Authorize access**. Click "Review permissions", choose your account.
   - *Note*: You might see a "Google hasn't verified this app" warning. Click **Advanced** > **Go to Sales Recorder (unsafe)** (since you wrote the code, it is safe).
   - Click **Allow**.
6. Copy the **Web App URL** generated (it ends in `/exec`).

## Step 3: Connect to LarngDuan App

1. Open the file `services/sheetsService.ts` in your code editor.
2. Find the line:
   ```typescript
   const GOOGLE_SCRIPT_URL = '';
   ```
3. Paste your Web App URL between the quotes:
   ```typescript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```
4. Save the file.
5. Restart your development server if needed (usually auto-reloads).

## Verification

1. Go to your POS App.
2. Create a test order and complete the payment.
3. Check your Google Sheet - the new row should appear instantly!
