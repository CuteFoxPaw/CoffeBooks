/* Require npms
----- */
const { ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const dir = __dirname + '/';
const jwt = require('jsonwebtoken');

//
module.exports = (bookList, userList, express, app) => {
  /* Routes
----- */

  /*
  TODO: Fix Auth routes
  TODO: FIX JWT
 */

  // Allows cross origin request
  app.use(cors());
  //fix req?
  // app.use(express.urlencoded({ extended: false }));
  // app.use(express.json());

  /* Authoritisation
----- */

  const auth = require('./auth.js');

  app.post('/register', register);
  app.post('/login', login);
  app.get('/users', auth, async (req, res) => {
    //res.send(await /*DB FOR USERS*/);
  });
  

  async function register(req, res) {
    let user = {
      email: req.body.email,
      nickname: req.body.nickname,
      password: req.body.password,
    };

    // Check inputs & user callbacks
    if (user.email == null)
      return res.send(`Incorrect form, email was null or emptey`);
    if (user.password == null)
      return res.send(`Incorrect form, a password was null or emptey`);
    if (await userList.findOne({ email: user.email }))
      return res.send(`email is already in use`);

    //    let dbUser = await users.findOne({ email: user.email });

    //if(findOne(email)) return exitcode
    //TODO: make sure to check that name and user are set aproprietly incl. as well that the should not already exist

    await bcrypt.hash(user.password, 12, async (err, hash) => {
      user.password = hash;

      if (err)
        return res.send(
          `Error, something went wrong, please make sure you've filled out all fields.
        Error message: ${err.message}`
        );

      try {
        await userList.insertOne(user);
        //?await userList.deleteMany({}); // Deletes ALL documents in collection
        res.send(`Users ${user.nickname} has succsessfully registerd`);
      } catch (err) {
        // console.log(err.message)
      }
    });
  }
  async function login(req, res) {
    let user = req.body;

    try {
      // Searches in db for specific email
      let dbUser = await userList.findOne({ email: user.email });

      if (!dbUser) return res.send(`Email '${user.email}' was not found.`);

      bcrypt.compare(user.password, dbUser.password, (err, result) => {
        if (err) return res.status(500).send(`Compare Error`);
        if (!result)
          return res.status(500).send(`Loggin Error: Passwords does not match`);

        //! MISSING SYNTAX!  WHAT SHOULD 2:ND ARG BE IN JWT SIGN IN? REPL GOT PROCESS.ENV.SECRET
        const token = jwt.sign(dbUser,/* // ! What shoudl be here? */ , { expireIn: 180 });

        res.send(token); // This means you've succesfully logged in
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  /* Routes
----- */
  // returns homepage
  app.get('/', (req, res) => {
    res.sendFile(dir + 'html.html');
  });

  //TODO Change API routes to api prefixes ie. '/api/books' 'api/books/:id'
  // retuns all avalible books
  app.get('/books', async (req, res) => {
    try {
      res.status(201).send(await bookList.find().toArray());
      console.log(
        `🚀-- TBL LOG : ~ file: routes.js ~ line 88 ~ app.get ~ bookList`,
        bookList
      );
      // // ! ERROR CODE: Topology is closed, please connect
    } catch (error) {
      res.send(error.message);
    }
  });

  app.get('/books/:id', async (req, res) => {
    try {
      console.log('THIS IS BOOKS');
      console.log(req.params.id);

      res
        .status(201)
        .send(await bookList.findOne({ _id: ObjectId(req.params.id) }));
      console.log(
        `🚀-- TBL LOG : ~ file: routes.js ~ line 103 ~ app.get ~ bookList`,
        bookList
      );
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  app.get('/*', (req, res) => {
    res.status(404).send(`Page Not Found`);
  });
};

/* Font links
----- */

//https://befonts.com/alegra-sans-serif-font.html

//

