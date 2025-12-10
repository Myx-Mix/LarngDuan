import { Transaction } from '../types';

// TODO: PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
// Example: "https://script.google.com/macros/s/AKfycbx.../exec"
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw5UYA9mTEvv2PdOwA36dNynmTy0WK-Wbh9P2cLcLuJolOub1eOFhR-fHatSEvV8CFF/exec';

export const recordTransactionToSheet = async (transaction: Transaction) => {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn("Google Sheets Sync: No Script URL configured in services/sheetsService.ts");
    return;
  }

  try {
    // Format data for the sheet
    const payload = {
      id: transaction.id,
      timestamp: new Date(transaction.timestamp).toISOString(),
      date: new Date(transaction.timestamp).toLocaleDateString(),
      time: new Date(transaction.timestamp).toLocaleTimeString(),
      items: transaction.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
      total: transaction.total,
      paymentMethod: transaction.paymentMethod
    };

    // Use no-cors mode to send data to Google Apps Script without CORS errors
    // Note: We won't be able to read the response in no-cors mode, but the request will succeed.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log("Transaction successfully sent to Google Sheets");
  } catch (error) {
    console.error("Error sending to Google Sheets:", error);
  }
};