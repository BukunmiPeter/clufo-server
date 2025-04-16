const { sendEmail } = require("../emailServiceUtil");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

async function sendJoinedClubEmail(email, firstName, clubname) {
  try {
    const sender = "Clufo <postmaster@mail.clufo.ch>";
    const subject = `🎉 Welcome to ${clubname} on Clufo!`;

    const messageTemplate = () => `
      <p>Hi ${firstName},</p>
      <p>Congratulations! You’ve successfully joined <strong>${clubname}</strong> on Clufo.</p>
      <p>We’re excited to have you on board. You can now log in and explore your club's activities, events, and more.</p>
      <p><a href="${FRONTEND_URL}/login" target="_blank">Click here to log in</a></p>
      <p>If you have any questions or need assistance, feel free to reach out.</p>
      <p>Welcome again!</p>
      <p>– The Clufo Team</p>
    `;

    const emailSent = await sendEmail({
      sender,
      recipient: email,
      subject,
      messageTemplate,
    });

    if (!emailSent || emailSent.message !== "Queued. Thank you.") {
      console.error("❌ Failed to send joined club email:", emailSent);
      return null;
    }

    return emailSent;
  } catch (error) {
    console.error("❌ Error sending joined club email:", error.message);
    return null;
  }
}

module.exports = { sendJoinedClubEmail };
