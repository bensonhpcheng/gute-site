/**
 * GUTE Waitlist — Google Apps Script
 *
 * HOW TO DEPLOY:
 * 1. Go to script.google.com → New Project
 * 2. Paste this entire file in, replacing the default code.
 * 3. Click the floppy disk (Save), name it "GUTE Waitlist".
 * 4. Click Deploy → New Deployment
 *    - Type: Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Click Deploy → copy the Web App URL.
 * 6. Open js/gute.js and replace YOUR_APPS_SCRIPT_WEB_APP_URL with that URL.
 * 7. Push your changes to GitHub. Done.
 *
 * The script auto-creates a sheet called "Waitlist" on first run.
 */

const SHEET_NAME = 'Waitlist';

const COLUMNS = [
  'Timestamp',
  'First Name',
  'Email',
  'Zip Code',
  'Variant',
  'Format',
  'Pre-Order Intent',
  'How They Found Us',
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    sheet.appendRow([
      data.timestamp   || new Date().toISOString(),
      data.firstName   || '',
      data.email       || '',
      data.zip         || '',
      data.variant     || '',
      data.format      || '',
      data.preorder    || '',
      data.source      || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  // Simple health check — visit the URL in a browser to confirm it's live.
  return ContentService
    .createTextOutput('GUTE Waitlist endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);

    // Header formatting
    const headerRange = sheet.getRange(1, 1, 1, COLUMNS.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#2C1208');
    headerRange.setFontColor('#F0E6D0');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(3, 220); // Email column wider
  }

  return sheet;
}
