/* Middleware for token verification
----- */
// Keeps users logged in
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let tokenFromUser = req.headers.token;

  try {
    let userToken = req.query.token;

    userToken = jwt.verify(userToken, tokenFromUser);
    req.userId = userToken.id;

    next();
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
};
