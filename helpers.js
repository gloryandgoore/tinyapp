const bcrypt = require("bcryptjs");

function generateRandomString() {
  let randomString = [];
  const letters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    randomString.push(letters[Math.floor(Math.random() * letters.length)]);
  }
  return randomString.join("");
}

const getUserByEmail = function (email, users) {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

const userIdUrls = (id, urlDatabase) => {
  const urlsToDisplay = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      urlsToDisplay[shortURL] = urlDatabase[shortURL];
    }
  }

  return urlsToDisplay;
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  userIdUrls,
};