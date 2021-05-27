/* Middleware for token verification
----- */
// Keeps users logged in
const jwt = require('jsonwebtoken');
//const cookieParser = require('cookie-parser');

module.exports = (req, res, next) => {
  /*
  try {
    const tokenFromUser = req.cookies.token;
    console.log(req.cookies);

    //if (tokenFromUser == null || tokenFromUser == typeof undefined)
    // return res.sendStatus(401);

    // let userToken = req.query.token;
    console.log(`🚀 ~ file: auth.js ~ line 12 ~ userToken`, userToken);

    userToken = jwt.verify(
      tokenFromUser,
      process.env.ACCESS_TOKEN_SECRET,
      (err, id) => {
        if (err) return res.sendStatus(403);
        req.user = id;
        next();
      }
    );
    // req.userId = userToken.id;s

    //next();
  } catch (err) {
    res.status(401).send({ error: err.message });
  }*/ try {
    let tokenFromUser = req.cookies['token'];

    //if (token == null || token == typeof undefined)
    // return res.sendStatus(401);

    // let userToken = req.query.token;
    // console.log(`🚀 ~ file: auth.js ~ line 12 ~ userToken`, userToken);

    tokenFromUser = jwt.verify(
      tokenFromUser,
      process.env.ACCESS_TOKEN_SECRET,
      (err, id) => {
        if (err) {
          console.log('Error FIERD!');

          return res.sendStatus(403);
        }
        console.log('Asignment');
        req.userid = tokenFromUser.id;
        console.log('Asignment');

        next();
      }
    );
    // req.userId = userToken.id;

    //next();
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
};
