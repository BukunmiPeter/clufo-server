const formData = require("form-data");
const Mailgun = require("mailgun.js");

require("dotenv").config(); // Ensure .env is loaded

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const FRONTEND_URL = process.env.FRONTEND_URL;

console.log("MAILGUN_API_KEY:", MAILGUN_API_KEY ? "Available" : "Not set");
console.log("MAILGUN_DOMAIN:", MAILGUN_DOMAIN ? "Available" : "Not set");

if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
  throw new Error("Mailgun API credentials are missing!");
}

const mailgun = new Mailgun(formData);
let mg;
try {
  mg = mailgun.client({ username: "api", key: MAILGUN_API_KEY });
} catch (error) {
  console.error("Mailgun client initialization failed:", error.message);
  process.exit(1); // Stop execution if initialization fails
}

const sendEmail = async ({ sender, recipient, subject, messageTemplate }) => {
  try {
    const message = messageTemplate();

    const response = await mg.messages.create(MAILGUN_DOMAIN, {
      from: sender,
      to: recipient,
      subject,
      html: message,
    });

    console.log("Email sent successfully:", response);
    return true;
  } catch (error) {
    console.error(
      "Failed to send email:",
      error.response?.data || error.message
    );
    return false;
  }
};

module.exports = { sendEmail };
