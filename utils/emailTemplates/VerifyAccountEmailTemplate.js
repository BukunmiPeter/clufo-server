const VerifyAccountTemplate = (verificationLink) => `
  <h1>Verify Your Account</h1>
  <p>Click the link below to verify your email address:</p>
  <a href="${verificationLink}">Verify Email</a>
`;
module.exports = { VerifyAccountTemplate };
