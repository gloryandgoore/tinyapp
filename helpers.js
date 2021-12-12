/****Function generateRandomString****/
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
  
  const getUserByEmail = function(email, users) {
    for (const userId in users) {
      const user = users[userId];
      if (user.email === email){
     return user;
      } 
    }
    return null;
  };

  module.exports = {
      generateRandomString,
      findDataByShortURL,
      getUserByEmail
  }