/* Middleware for token verification
----- */
// Keeps users logged in
const jwt = require('jsonwebtoken');
//const cookieParser = require('cookie-parser');

module.exports = (req, res, next) => {
  try {
    let tokenFromUser = req.cookies.token;
console.log(req.cookies);
    //if (token == null || token == typeof undefined)
    // return res.sendStatus(401);

    // let userToken = req.query.token;
    // console.log(`🚀 ~ file: auth.js ~ line 12 ~ userToken`, userToken);

    tokenFromUser = jwt.verify(
      tokenFromUser,
      process.env.ACCESS_TOKEN_SECRET,
    /*  (err, id) => {
     //   if (err) return res.status(403).send(err.message);
//
      //?


      }*/

    );
      //req.userid = tokenFromUser.id;
        console.log(`-- TokenFromUser ${tokenFromUser.id} --`);
       

        

       next();
  
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
};
