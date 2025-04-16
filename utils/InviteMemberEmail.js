const { sendEmail } = require("./emailServiceUtil");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

async function sendInviteEmail(email, clubname, inviteCode) {
  try {
    const sender = "Clufo <postmaster@mail.clufo.ch>";
    const subject = "You're invited to join Clufo!";

    const messageTemplate = () => `
    <p>Hello,</p>
    <p>You have been invited to join <strong>${clubname}</strong> on Clufo.</p>
    <p>Please complete your registration by clicking the link below:</p>
    <p><a href="${FRONTEND_URL}/register/invite" target="_blank">${FRONTEND_URL}/register</a></p>
    <p><strong>Your invite code:</strong> ${inviteCode}</p>
    <p>You will be required to enter this code during signup to verify your invitation.</p>
    <p>If you did not expect this invite, please ignore this email.</p>
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
      console.error("❌ Failed to send invite email:", emailSent);
      return null;
    }

    return emailSent;
  } catch (error) {
    console.error("❌ Error sending invite email:", error.message);
    return null;
  }
}

module.exports = { sendInviteEmail };
