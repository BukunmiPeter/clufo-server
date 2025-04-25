function generateRandomPassword(length = 12) {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()-_=+[]{};:,.<>?";
  const allChars = upper + lower + numbers + special;

  let password = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    special[Math.floor(Math.random() * special.length)],
  ];

  for (let i = password.length; i < length; i++) {
    password.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  return password.sort(() => Math.random() - 0.5).join("");
}

module.exports = { generateRandomPassword };
