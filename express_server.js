const { request } = require("express");
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const app = express();
const bcrypt = require("bcryptjs");

const {
  generateRandomString,
  findDataByShortURL,
  getUserByEmail,
  userIdUrls,
  users,
  urlDatabase,
} = require("./helpers");
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

app.use(
  cookieSession({
    name: "session",
    keys: ["Tiny21"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

//middleware
//use bodyParser to handle post request
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

//index
app.get("/", (req, res) => {
  const user = users[req.session.user_id];
  return user ? res.redirect("/urls") : res.redirect("/login");
});

//urls
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];

  if (!user) {
    res.send("<h2><a href='/login'>Please login</a></h2>");
  }
  const templateVars = {
    user,
    urls: userIdUrls(user.id, urlDatabase),
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const user = users[req.session.user_id];
  if (!user) return res.status(403).send("Blocked: not authorized.");

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: user.id };

  res.redirect(`/urls/${shortURL}`);
});

//add a new url
app.get("/urls/new", (req, res) => {
  const user = users[req.session.user_id];
  if (!user) return res.redirect("/login");

  const templateVars = {
    user,
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const user = users[req.session.user_id];
  const userUrls = userIdUrls(req.session.user_id, urlDatabase);

  if (!userUrls[shortURL]) {
    return res.status(403).send("link doesn't exist");
  }

  const templateVars = {
    shortURL: shortURL,
    longURL: userUrls[shortURL].longURL,
    user: user,
  };
  res.render("urls_show", templateVars);
});

//edit url
app.post("/urls/:id", (req, res) => {
  const newLongURL = req.body.longURL;
  const shortURL = req.params.id;
  urlDatabase[shortURL].longURL = newLongURL;
  res.redirect("/urls");
});

//delete user url
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const userUrls = userIdUrls(req.session.user_id, urlDatabase);
  if (!userUrls[shortURL]) {
    return res.status(403).send("Failed to delete");
  }

  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//redirecting the server to longURL

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!findDataByShortURL(shortURL)) {
    return res.status(400).send("Invalid URL");
  }

  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(`${longURL}`);
});

//login
app.get("/login", (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = {
    users,
  };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password)
    return res.status(400).send("Error, email/or password is blank!");

  const user = getUserByEmail(email, users);

  if (!user) return res.status(403).send("Error, user not found!");

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("Error, password doesn't match our records");
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(403).send("Error, try again");
  }

  req.session.user_id = user.id;
  res.redirect("/urls");
});

//logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

//register
app.get("/register", (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = {
    users,
  };
  res.render("register", templateVars);
});

//register
app.post("/register/", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = generateRandomString();
  const exisitingUser = getUserByEmail(email, users);
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || !password) {
    res.status(400).send("email and password should not be blank!");
    return;
  }

  if (exisitingUser) {
    return res.status(400).send("You've already registered. Please log in.");
  }

  users[userID] = {
    id: userID,
    email: email,
    password: hashedPassword,
  };
  req.session.user_id = userID;

  res.redirect("/urls");
});
