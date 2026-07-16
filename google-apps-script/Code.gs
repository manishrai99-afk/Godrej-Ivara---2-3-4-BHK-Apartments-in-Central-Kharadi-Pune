/**
 * Godrej Ivara — Lead Capture (Google Sheet + Email)
 *
 * SETUP (5 minutes):
 * 1. Go to https://sheets.google.com → New spreadsheet
 * 2. Extensions → Apps Script → paste this file → Save
 * 3. Change NOTIFICATION_EMAIL below to your email
 * 4. Run setupSheet() once (authorize when prompted)
 * 5. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL into js/config.js → googleScriptUrl
 */

const NOTIFICATION_EMAIL = "your-email@gmail.com";
const PROJECT_NAME = "Godrej Ivara Kharadi";
const SHEET_NAME = "Leads";

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  const headers = [
    "Timestamp",
    "Name",
    "Phone",
    "Email",
    "Interest",
    "Source",
    "Page URL"
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight("bold")
    .setBackground("#1f4d3a")
    .setFontColor("#ffffff");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);

  return "Sheet ready! Now deploy as Web App.";
}

function doPost(e) {
  return handleLead_(parsePayload_(e));
}

function doGet(e) {
  return handleLead_(e.parameter || {});
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    return {};
  }
}

function handleLead_(data) {
  try {
    const lead = normalizeLead_(data);

    if (!lead.name || !lead.phone) {
      return jsonResponse_({ success: false, error: "Name and phone are required." });
    }

    saveToSheet_(lead);
    sendEmailAlert_(lead);

    return jsonResponse_({ success: true });
  } catch (err) {
    return jsonResponse_({ success: false, error: String(err) });
  }
}

function normalizeLead_(data) {
  return {
    name: String(data.name || "").trim(),
    phone: String(data.phone || "").trim(),
    email: String(data.email || "").trim(),
    interest: String(data.interest || "General Enquiry").trim(),
    source: String(data.source || "Website").trim(),
    pageUrl: String(data.pageUrl || "").trim(),
    submittedAt: data.submittedAt
      ? new Date(data.submittedAt)
      : new Date()
  };
}

function saveToSheet_(lead) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    setupSheet();
    sheet = ss.getSheetByName(SHEET_NAME);
  }

  sheet.appendRow([
    lead.submittedAt,
    lead.name,
    lead.phone,
    lead.email,
    lead.interest,
    lead.source,
    lead.pageUrl
  ]);
}

function sendEmailAlert_(lead) {
  if (!NOTIFICATION_EMAIL || NOTIFICATION_EMAIL.indexOf("@") === -1) {
    return;
  }

  if (NOTIFICATION_EMAIL === "your-email@gmail.com") {
    return;
  }

  const subject = `New Lead — ${PROJECT_NAME} — ${lead.name}`;
  const body = [
    `New enquiry received for ${PROJECT_NAME}`,
    "",
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email || "Not provided"}`,
    `Interest: ${lead.interest}`,
    `Source: ${lead.source}`,
    `Page: ${lead.pageUrl || "N/A"}`,
    `Time: ${Utilities.formatDate(lead.submittedAt, "Asia/Kolkata", "dd MMM yyyy, hh:mm a")}`,
    "",
    "—",
    "Reply quickly to convert this lead."
  ].join("\n");

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: subject,
    body: body
  });
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
