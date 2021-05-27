/* Require npms
----- */
const { ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dir = __dirname + '/';

console.log = require('./no-indent-logger')(console.log);
//
module.exports = (bookList, userList, express, app, envCookies) => {
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

  app.use(cookieParser());
  /* Authoritisation
----- */

  const authToken = require('./auth.js');

  app.post('/register', register);
  app.post('/login', login);
  app.get('/users', authToken, async (req, res) => {
    console.log('Asignment');

    res.send(await userList.find().toArray());
  });

  async function register(req, res) {
    let user = {
      email: req.body.email,
      nickname: req.body.nickname,
      password: req.body.password,
    };

    // Check inputs & user callbacks
    //TODO Check for correct inputed email
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
        res
          .status(201)
          .send(`Users ${user.nickname} has succsessfully registerd`);
      } catch (err) {
        // console.log(err.message)
      }
    });
  }
  async function login(req, res) {
    try {
      let user = req.body;

      //let tokenFromUser = req.headers.token;
      // Searches in db for specific email
      let dbUser = await userList.findOne({ email: user.email });

      if (!dbUser) return res.send(`Email '${user.email}' was not found.`);

      bcrypt.compare(user.password, dbUser.password, (err, result) => {
        if (err) return res.status(500).send(`Compare Error`);
        if (!result)
          return res.status(500).send(`Loggin Error: Passwords does not match`);

        let token = generateToken(dbUser);
        //req.headers.token = token;
        // maxAge: mil-seconds, 60 000 = 1 min
        res.cookie('token', token, { maxAge: 600000 });

        //TODO: Store token with cookies
        res.send(token); // This means you've succesfully logged in
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
  /*
    const username = req.body.username;
    const user = { user: username };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
  }
  const post = [
    { username: 'kyle', title: 'post 1' },
    { username: 'jim', title: 'post 2' },
  ];
*/
  function authingToken(req, res, next) {
    /* const token = req.headers.token;
    console.log(
      `🚀 ~ file: routes.js ~ line 119 ~ authingToken ~ req.headers`,
      req.headers
    );
    console.log(
      `🚀 ~ file: routes.js ~ line 119 ~ authingToken ~ token`,
      token
    );
    if (token == null || token == typeof undefined) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });*/ try {
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
  }

  app.get('/logins', authingToken, (req, res) => {
    console.log('---');
    res.json(post.filter((post) => post.username == req.user.name));
    console.log(
      `🚀 ~ file: routes.js ~ line 139 ~ app.get ~ req.user`,
      req.user
    );
  });
  function generateToken(user) {
    // signs a token for our user

    let { id } = user;
    let token = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 600,
    });
    return token;
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
      res.status(200).send(await bookList.find().toArray());

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
        .status(200)
        .send(await bookList.findOne({ _id: ObjectId(req.params.id) }));
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.get('/books/:tag/:arg', async (req, res) => {
    try {
      //db.stuff.find( { foo: /^bar$/i } );
      const filter = new RegExp(/^req.params.arg$/, 'i');
      const list = await bookList.find({ [req.params.tag]: filter }).toArray();

      if (list.length == 0 || typeof list == 'undefined')
        res.status(404).send(`Error 404: Tag or argument not found`);
      res.status(200).send(list);
    } catch (error) {
      res.send(error.message);
    }
  });

  app.post('API/book/create', (req, res) => {
    // TODO: Check for exisitng books
    let book = {
      title: req.body.title,
      serie: req.body.serie,
      releaseYear: req.body.releaseYear,
      auhtor: req.body.auhtor,
      comments: {},
      genre: [],
      title: req.body.title,
      title: req.body.title,
      scoreTotal: 0,
      scoreVotes: 0,
      creator: req.user.id,
    };

    bookList.insertOne(book);
    res.status(201).send(`Book ${book.title} created`);
  });
  app.get('/API/book/delete/:id', async (req, res) => {
    try {
      //! Check if user are logged in
      //! Delete object from client as well!
      //! Check id != null
      await bookList.deleteOne({ _id: ObjectId(req.params.id) });
      res.status(202).send(`Delete of id: ${req.params.id} accepted`);
    } catch (error) {
      res.status(403).send('Error, not auhtorised or other error occured');
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
