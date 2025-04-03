const { sendEmail } = require("../emailServiceUtil");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

async function sendVerificationEmail(email, verificationCode) {
  try {
    const sender = "No-Reply <postmaster@mail.clufo.ch>";
    const subject = "Your Verification Code";
    const verificationLink = `${FRONTEND_URL}/verify/${verificationCode}`;

    const messageTemplate = () => `
      <p>Hello,</p>
      
      <p>Click the link below to verify your account:</p>
      <p><a href="${verificationLink}" target="_blank">Verify your email</a></p>
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
