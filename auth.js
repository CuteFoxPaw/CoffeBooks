/* Middleware for token verification
----- */
// Keeps users logged in

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

module.exports = (req, res, next) => {
  try {
    console.log(process.env.ACCESS_TOKEN_SECRET);
    let tokenFromUser = req.cookies.token;
    console.log(req.cookies.token);

    if (tokenFromUser == null || tokenFromUser == typeof undefined) {
      return res.sendStatus(401);
    }

    tokenFromUser = jwt.verify(
      tokenFromUser,
      process.env.ACCESS_TOKEN_SECRET
      /*(err, tok) => {
          if (err) return res.status(403).send(err.message);
        }*/
    );

    console.log(tokenFromUser._id);
    req.user_id = tokenFromUser._id;
    next();
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
};
