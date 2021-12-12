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

function findDataByShortURL(shortURL) {
  for (const key in urlDatabase) {
    if (key === shortURL) return shortURL;
  }
  return null;
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
//database
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  user1: {
    id: "user1",
    email: "user@example.com",
    password: bcrypt.hashSync("123"),
  },
  user2: {
    id: "user2",
    email: "user2@example.com",
    password: bcrypt.hashSync("321"),
  },
};

module.exports = {
  generateRandomString,
  findDataByShortURL,
  getUserByEmail,
  userIdUrls,
  users,
  urlDatabase,
};
