/**
 * SILK STREETWEAR - GOOGLE SHEETS LIVE SYNC SCRIPT
 * ==================================================
 * 
 * This Google Apps Script allows your Google Sheet to receive live client "command orders"
 * directly from your Silk website in real-time.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.google.com) and create a new Spreadsheet.
 * 2. Name your Spreadsheet (e.g. "Silk Client Orders").
 * 3. In the top menu, go to: Extensions > Apps Script.
 * 4. Delete any code in the editor and paste THIS ENTIRE FILE.
 * 5. Click "Save" (Floppy disk icon).
 * 6. Click the blue "Deploy" button at the top right > select "New deployment".
 * 7. Click the gear icon next to "Select type" and choose "Web app".
 * 8. Set the following options:
 *    - Description: "Silk Orders Webhook"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 9. Click "Deploy", authorize the permissions if prompted, and copy the "Web App URL".
 * 10. Add that URL to your website's .env file:
 *     GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/XXXXX/exec"
 * 
 * That's it! Every time a client places an order, it will automatically append
 * as a new formatted row in your Google Sheet!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Create header row if empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Order Number",
        "Order Date",
        "Customer Name",
        "Phone Number",
        "Email",
        "Governorate",
        "City",
        "Delivery Address",
        "Postal Code",
        "Ordered Items",
        "Total Pieces",
        "Subtotal (TND)",
        "Discount (TND)",
        "Discount Code",
        "Shipping (TND)",
        "Total (TND)",
        "Payment Method",
        "Order Status",
        "Customer Notes"
      ];
      sheet.appendRow(headers);
      
      // Style headers: bold, dark background, white text
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#181818");
      headerRange.setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }
    
    // Parse order data from request
    var data = JSON.parse(e.postData.contents);
    
    var row = [
      data.orderNumber || "",
      data.orderDate || new Date().toISOString(),
      data.customerName || "",
      data.customerPhone || "",
      data.customerEmail || "",
      data.governorate || "Tunis",
      data.city || "Tunis",
      data.shippingAddress || "",
      data.postalCode || "1000",
      data.itemsSummary || "",
      data.totalPieces || 1,
      data.subtotalTND || "0.000",
      data.discountTND || "0.000",
      data.discountCode || "",
      data.shippingTND || "0.000",
      data.totalTND || "0.000",
      data.paymentMethod || "COD (Paiement à la livraison)",
      data.status || "PENDING",
      data.notes || ""
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({ result: "success", orderNumber: data.orderNumber }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Silk Orders Webhook is Active. Send a POST request with order JSON to record an order.");
}
