const { sendEmail } = require("../emailServiceUtil");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

async function sendLoginDetailsEmail(email, fullName, password, clubname) {
  try {
    const sender = "Clufo <postmaster@mail.clufo.ch>"; // Or your desired sender
    const subject = "Your Clufo Login Details";
    const messageTemplate = () => `
      <p>Hello ${fullName},</p>
      <p>A new account has been created for you on Clufo for ${clubname}.</p>
      <p>Your login details are:</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>Please log in to your account at: <a href="${FRONTEND_URL}">${FRONTEND_URL}</a></p>
      <p>We recommend changing your password after your first login.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thank you,</p>
      <p>The Clufo Team</p>
    `;

    const emailSent = await sendEmail({
      sender,
      recipient: email,
      subject,
      messageTemplate,
    });

    if (!emailSent || emailSent.message !== "Queued. Thank you.") {
      console.error(
        "❌ Failed to send login details email for:",
        email,
        emailSent
      );
      return null; // Or you might want to throw an error here
    }

    return emailSent;
  } catch (error) {
    console.error("❌ Error sending login details email:", error.message);
    return null; // Or throw error
  }
}
module.exports = { sendLoginDetailsEmail };
