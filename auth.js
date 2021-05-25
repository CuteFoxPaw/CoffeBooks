/* Middleware for token verification
----- */
// Keeps users logged in
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let tokenFromUser = req.headers.token;

  try {
    let userToken = req.query.token;

    let check = jwt.verify(userToken, tokenFromUser);
    //! Shouldn't we make check for check if true? See following
    /*if (check) {
      next();
    } else {
      return;
    }*/
    next();
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
};
