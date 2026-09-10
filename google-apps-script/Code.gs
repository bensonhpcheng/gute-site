/**
 * GUTE Waitlist — Google Apps Script
 *
 * Flow: website form  ->  this script  ->  (1) append to Google Sheet [backup]
 *                                          (2) forward to Kit (ConvertKit) [email]
 *
 * The Kit API key lives ONLY here (server-side) — it is never exposed on the
 * website. Adding the subscriber via a Kit Form triggers the welcome
 * automation connected to that form.
 *
 * ── FIRST-TIME SETUP ──────────────────────────────────────────────
 * 1. Do the Kit setup first (see KIT_SETUP.md) to get your API key + Form ID.
 * 2. In the Apps Script editor: Project Settings (gear) -> Script Properties
 *    -> add two properties:
 *        KIT_API_KEY   =  your Kit v4 API key
 *        KIT_FORM_ID   =  the numeric ID of your "GUTE Website" form
 *    (Storing them here keeps secrets out of the code and out of git.)
 * 3. Deploy -> Manage deployments -> edit -> New version -> Deploy.
 *    (Re-deploying a NEW VERSION is required for changes to take effect.)
 * ──────────────────────────────────────────────────────────────────
 */

const SHEET_NAME = 'Waitlist';
const SPREADSHEET_ID = '1tM2ijmlkSNwzbySytGK9mFs1aWdkFCRh6SCKoiqpAEo';

const COLUMNS = [
  'Timestamp',
  'First Name',
  'Email',
  'Zip Code',
  'Chocolate Variety',
  'Flavor Interest',
  'Merch Interest',
  'Pre-Order Intent',
  'How They Found Us',
  'Kit Sync',            // NEW — records whether the Kit forward succeeded
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    // 2) Forward to Kit first so we can log the outcome in the same row.
    const kitResult = syncToKit(data);

    // 1) Append to the sheet (source-of-truth backup).
    sheet.appendRow([
      data.timestamp   || new Date().toISOString(),
      data.firstName   || '',
      data.email       || '',
      data.zip         || '',
      data.variant     || '',
      data.flavors     || '',
      data.merch       || '',
      data.preorder    || '',
      data.source      || '',
      kitResult,
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', kit: kitResult }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Adds/updates the subscriber in Kit by subscribing them to the website Form.
 * Subscribing via the form is what triggers the connected welcome automation.
 * Custom fields (source / variant / flavors / zip) are passed through so you
 * can segment later ("email everyone who wanted Blueberry", etc.).
 * Returns a short status string that gets written into the "Kit Sync" column.
 */
function syncToKit(data) {
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty('KIT_API_KEY');
  const formId = props.getProperty('KIT_FORM_ID');

  if (!apiKey || !formId) return 'skipped (no Kit config)';
  if (!data.email) return 'skipped (no email)';

  const url = 'https://api.kit.com/v4/forms/' + formId + '/subscribers';
  const payload = {
    email_address: data.email,
    first_name: data.firstName || '',
    fields: {
      source:  data.source   || '',
      variant: data.variant  || '',
      flavors: data.flavors  || '',
      zip:     data.zip      || '',
    },
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: { 'X-Kit-Api-Key': apiKey, 'Accept': 'application/json' },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  try {
    const res = UrlFetchApp.fetch(url, options);
    const code = res.getResponseCode();
    if (code >= 200 && code < 300) return 'ok';
    return 'error ' + code + ': ' + res.getContentText().slice(0, 120);
  } catch (err) {
    return 'error: ' + err.message;
  }
}

function doGet() {
  // Simple health check — visit the URL in a browser to confirm it's live.
  return ContentService
    .createTextOutput('GUTE Waitlist endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * One-time helper: run this manually from the editor (Run -> testKit) after
 * setting your Script Properties, to confirm Kit accepts a test subscriber.
 * Use a throwaway email you can delete from Kit afterward.
 */
function testKit() {
  const result = syncToKit({
    email: 'test+gute@example.com',
    firstName: 'Test',
    source: 'Manual Test',
    variant: '',
    flavors: '',
    zip: '',
  });
  Logger.log('Kit sync result: ' + result);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
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
  } else {
    // Existing sheet: make sure the new "Kit Sync" header exists in column J.
    const lastCol = sheet.getLastColumn();
    if (lastCol < COLUMNS.length) {
      const cell = sheet.getRange(1, COLUMNS.length);
      cell.setValue(COLUMNS[COLUMNS.length - 1]);
      cell.setFontWeight('bold');
      cell.setBackground('#2C1208');
      cell.setFontColor('#F0E6D0');
    }
  }

  return sheet;
}
