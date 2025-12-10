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
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Transaction ID", "Date", "Time", "Items", "Total", "Payment", "ISO Timestamp"]);
      // Optional: Bold the header
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
    }

    // Append the order data
    sheet.appendRow([
      data.id,
      data.date,
      data.time,
      data.items,
      data.total,
      data.paymentMethod,
      data.timestamp
    ]);

    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": e }))
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
