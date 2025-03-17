const { sendEmail } = require("../emailServiceUtil");

const sendVerificationEmail = async (email, code) => {
  const FRONTEND_URL = process.env.FRONTEND_URL;
  MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
  const verificationLink = `${FRONTEND_URL}/verify-email?code=${code}`;

  return sendEmail({
    sender: `"No-Reply" <no-reply@${MAILGUN_DOMAIN}>`,
    recipient: email,
    subject: "Verify Your Email",
    messageTemplate: () =>
      `<p>Click <a href='${verificationLink}'>here</a> to verify your email.</p>`,
  });
};

module.exports = { sendVerificationEmail };
