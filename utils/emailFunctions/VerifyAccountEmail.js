const { sendEmail } = require("../emailServiceUtil");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

async function sendVerificationEmail(email, verificationCode) {
  try {
    const sender = "Clufo <postmaster@mail.clufo.ch>";
    const subject = "Your Verification Code";

    const messageTemplate = () => `
      <p>Hello,</p>
      <p>Thank you for signing up with Clufo!</p>
      <p>Please use the following code to verify your email address:</p>
      <p style="font-size: 1.5em; margin-top: 10px; margin-bottom: 10px;">${verificationCode}</p>
      <p>Enter this code on the verification page to activate your account.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thank you,</p>
      <p>Clufo Team</p>
    `;

    const emailSent = await sendEmail({
      sender,
      recipient: email,
      subject,
      messageTemplate,
    });

    if (!emailSent || emailSent.message !== "Queued. Thank you.") {
      console.error(
        "❌ Failed to send verification email for:",
        email,
        emailSent
      );
      return null;
    }

    return emailSent;
  } catch (error) {
    console.error("❌ Error sending verification email:", error.message);
    return null;
  }
}

module.exports = { sendVerificationEmail };
