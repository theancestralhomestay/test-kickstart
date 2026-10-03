// ==============================================================================
// Test Kickstart - Backend & API
// ==============================================================================

const DEFAULT_OWNER_EMAIL = "the.ancestral.home.stay@gmail.com";
const RECEIPT_FOLDER_NAME = "Test Kickstart Uploads";
var SESSION_EXPIRY_DAYS = 90;

function doGet(e) {
  var htmlOutput = HtmlService.createTemplateFromFile('Index').evaluate();
  htmlOutput.setTitle('Test Kickstart')
            .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1')
            .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return htmlOutput;
}

function doPost(e) {
  // Handle form submissions if needed
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.JSON);
}

// --- Authentication & Sessions ---
function getCurrentUserInfo(sessionToken) {
  if (!sessionToken) return { isAuthorized: false, isOwner: false };
  var session = validateSession(sessionToken);
  if (!session.valid) return { isAuthorized: false, isOwner: false };

  var email = session.email.toLowerCase().trim();
  var isOwner = (email === DEFAULT_OWNER_EMAIL.toLowerCase().trim());
  var isTeam = isEmailInTeam(email);

  if (isOwner || isTeam) {
    return { isAuthorized: true, isOwner: isOwner, email: email };
  }
  return { isAuthorized: false, isOwner: false, email: email };
}

function sendVerificationCode(userEmail) {
  var email = userEmail.toLowerCase().trim();
  var code = Math.floor(100000 + Math.random() * 900000).toString();
  var props = PropertiesService.getScriptProperties();
  props.setProperty('OTP_' + email, code);

  // Set expiry for 10 mins
  props.setProperty('OTP_EXP_' + email, (new Date().getTime() + 10*60000).toString());

  MailApp.sendEmail({
    to: email,
    subject: "Test Kickstart - Verification Code",
    htmlBody: "Your verification code is: <b>" + code + "</b><br><br>This code expires in 10 minutes."
  });
  return true;
}

function verifyEmailCode(userEmail, enteredCode) {
  var email = userEmail.toLowerCase().trim();
  var props = PropertiesService.getScriptProperties();
  var savedCode = props.getProperty('OTP_' + email);
  var expiry = props.getProperty('OTP_EXP_' + email);

  if (!savedCode || !expiry) return { success: false, message: "Code expired or invalid." };
  if (new Date().getTime() > parseInt(expiry)) return { success: false, message: "Code has expired." };

  if (savedCode === String(enteredCode).trim()) {
    props.deleteProperty('OTP_' + email);
    props.deleteProperty('OTP_EXP_' + email);
    var token = createSession(email);
    return { success: true, token: token };
  }
  return { success: false, message: "Incorrect code." };
}

function createSession(email) {
  setupDatabaseSheets();
  var ss = getSpreadsheet();
  var sessionSheet = ss.getSheetByName('_Sessions');

  var token = 'sess_' + Utilities.getUuid() + '_' + new Date().getTime();
  var now = new Date();
  var expires = new Date(now.getTime() + (SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000));

  sessionSheet.appendRow([token, email, now, expires, now]);
  return token;
}

function validateSession(token) {
  if (!token) return { valid: false };
  setupDatabaseSheets();
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('_Sessions');
  var data = sheet.getDataRange().getValues();

  var now = new Date();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === token) {
      var expires = new Date(data[i][3]);
      if (now > expires) {
        return { valid: false }; // Expired
      }
      // Update last active
      sheet.getRange(i + 1, 5).setValue(now);
      return { valid: true, email: data[i][1] };
    }
  }
  return { valid: false };
}

function revokeSession(token) {
  if (!token) return;
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('_Sessions');
  if(!sheet) return;
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === token) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

// --- Database & Setup ---
function setupDatabaseSheets() {
  var ss = getSpreadsheet();
  var requiredSheets = ['Team', 'Settings', '_Sessions', 'Audit'];
  var sheetsCreated = false;

  requiredSheets.forEach(function(name) {
    if (!ss.getSheetByName(name)) {
      var newSheet = ss.insertSheet(name);
      if (name === '_Sessions') {
        newSheet.appendRow(['Token', 'Email', 'Created At', 'Expires At', 'Last Active']);
        newSheet.hideSheet();
      } else if (name === 'Audit') {
        newSheet.appendRow(['Audit ID', 'Timestamp', 'Action', 'User', 'Details']);
        newSheet.hideSheet();
      } else if (name === 'Team') {
        newSheet.appendRow(['Name', 'Emails (comma separated)', 'Role']);
      } else if (name === 'Settings') {
        newSheet.appendRow(['Key', 'Value']);
      }
      newSheet.getRange(1, 1, 1, newSheet.getMaxColumns()).setFontWeight('bold');
      newSheet.setFrozenRows(1);
      sheetsCreated = true;
    }
  });

  if (sheetsCreated) {
    seedDefaultLists(ss);
  }
}

function seedDefaultLists(ss) {
  var teamSheet = ss.getSheetByName('Team');
  if (teamSheet.getLastRow() === 1) {
    teamSheet.appendRow(['Admin User', DEFAULT_OWNER_EMAIL, 'Admin']);
  }
}

function isEmailInTeam(email) {
  setupDatabaseSheets();
  var ss = getSpreadsheet();
  var teamSheet = ss.getSheetByName('Team');
  if(!teamSheet) return false;
  var data = teamSheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var emails = data[i][1] ? data[i][1].toString().toLowerCase() : "";
    if (emails.indexOf(email) !== -1) return true;
  }
  return false;
}

function logAudit(action, user, details) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Audit');
  if (!sheet) return;
  sheet.appendRow([Utilities.getUuid(), new Date(), action, user, details]);
}

// --- Spreadsheet Helper ---
function getSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) return ss;

  var props = PropertiesService.getScriptProperties();
  var savedId = props.getProperty('SPREADSHEET_ID');
  if (savedId) {
    try {
      var opened = SpreadsheetApp.openById(savedId);
      if (opened) return opened;
    } catch (err) {}
  }

  try {
    var newSs = SpreadsheetApp.create('test-kickstart Database');
    props.setProperty('SPREADSHEET_ID', newSs.getId());
    return newSs;
  } catch (err) {
    throw new Error("Could not create or find Google Sheet database. " + err);
  }
}
