/*
  RSVP + wishes backend for Sibili & Jashidha's Nikah invitation.

  SETUP
  1. Create a Google Sheet with sheets named: RSVP and Wishes.
  2. Open Extensions > Apps Script and replace its code with this file.
  3. Set SPREADSHEET_ID to the ID from your Google Sheet URL.
  4. Deploy > New deployment > Web app:
     Execute as: Me
     Who has access: Anyone
  5. Copy the deployed /exec URL into SHEET_WEB_APP_URL in index.html.
*/

const SPREADSHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';

function doGet(e) {
  const action = (e.parameter.action || '').toLowerCase();
  if (action === 'wishes') {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Wishes');
    const rows = sheet.getDataRange().getValues().slice(1).reverse().slice(0, 50);
    const wishes = rows.map(row => ({ name: String(row[1] || ''), message: String(row[2] || '') }));
    return json({ wishes });
  }
  return json({ ok: true });
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents || '{}');
  const book = SpreadsheetApp.openById(SPREADSHEET_ID);
  if (data.type === 'rsvp') {
    book.getSheetByName('RSVP').appendRow([new Date(), data.name || '', data.guests || '', data.attendance || '']);
  }
  if (data.type === 'wish') {
    book.getSheetByName('Wishes').appendRow([new Date(), data.name || '', data.message || '']);
  }
  return json({ ok: true });
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
