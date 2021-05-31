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
module.exports = (bookList, userList, express, app) => {
  /* Routes
----- */

  /*
  TODO: LOGOUT, destroy cookie, if time destroy jwt
  1. Set a reasonable expiration time on tokens
  2. Delete the stored token from client side upon log out
  3. Have DB of no longer active tokens that still have some time to live
  4. Query provided token against The Blacklist on every authorized request
 */
  // ! FIX STRING INPUT char encode for js

  // Allows cross origin request
  app.use(cors());
  //fix req?
  // app.use(express.urlencoded({ extended: false }));
  // app.use(express.json());

  app.use(cookieParser());
  /* Authoritisation
----- */

  const authToken = require('./auth.js');
  app.get('/ww', (req, tes) => {
    console.log(req);
  });
  app.post('/register', register);
  app.post('/login', login);
  app.get('/users', authToken, async (req, res) => {
    console.log(req.user_id);
    res.send(await userList.find().toArray());
  });

  async function register(req, res) {
    let user = {
      email: toLowerCase(req.body.email),
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
        console.log(err.message);
      }
    });
  }
  async function login(req, res) {
    try {
      let user = req.body;
      user.email = user.email.toLowerCase();
      req.user = user;
      //let tokenFromUser = req.headers.token;
      // Searches in db for specific email
      let dbUser = await userList.findOne({ email: user.email });

      if (!dbUser) return res.send(`Email '${user.email}' was not found.`);

      bcrypt.compare(user.password, dbUser.password, (err, result) => {
        if (err) return res.status(401).send(`Compare Error`);
        if (!result)
          return res.status(401).send(`Loggin Error: Passwords does not match`);

        let token = generateToken(dbUser);
        console.log(token);
        //req.headers.token = token;
        // maxAge: mil-seconds, 60 000 = 1 min
        res.cookie('token', token, {
          maxAge: 1000 * 3600 * 24,
          /* httpOnly: true,*/
          sameSite: 'lax',
        });

        //TODO: Store token with cookies
        // res.send(token); // This means you've succesfully logged in
        res.send('succ');
      });
    } catch (err) {
      res.status(401).send(err.message);
    }
  }

  function generateToken(user) {
    // signs a token for our user
    let { _id } = user;
    console.log('IDET: ' + _id);
    console.log(user);
    let token = jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1d',
    });
    console.log(token);
    /*let test = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(test._id);*/
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

  // encode string
  function encodeCharacters(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
      '`': '&#039;',
    };

    return text.replace(/[&<>"']/g, function (m) {
      return map[m];
    });
  }

  app.post('/API/book/create', authToken, async (req, res) => {
    let dbBook = await bookList.findOne({ title: req.body.title });
    if (dbBook.title == req.body.title && dbBook.author == req.body.auhtor) {
      res
        .status(400)
        .send('Book already exist! Otherwise, please contact admin support!');
    }
    // TODO: Check for exisitng books
    //console.log(req.user.id);

    let book = {
      title: encodeCharacters(req.body.title),
      serie: encodeCharacters(req.body.serie),
      releaseYear: encodeCharacters(req.body.releaseYear),
      auhtor: encodeCharacters(req.body.auhtor),
      synopsis: encodeCharacters(req.body.synopsis),
      comments: {},
      scoreTotal: 0,
      scoreVotes: 0,
      creator: req.user_id,
      updator: {},
    };

    bookList.insertOne(book);
    res.status(201).send(`Book ${book.title} created`);
  });
  app.post('/API/book/update', authToken, async (req, res) => {
    try {
      let dbBook = await bookList.findOne({ _id: ObjectId(req.body.id) });
      if (!dbBook) {
        res.status(404).send('Bookentry not found');
      }
      if (!dbBook.updator.find(req.user_id)) {
        dbBook.updator.push(req.user_id);
      }

      bookList.replaceOne(
        { _id: ObjectId(req.body.id) },
        {
          title: encodeCharacters(req.body.title) || dbBook.title,
          serie: encodeCharacters(req.body.serie) || dbBook.serie,
          releaseYear:
            encodeCharacters(req.body.releaseYear) || dbBook.releaseYear,
          author: encodeCharacters(req.body.author) || dbBook.author,
          synopsis: encodeCharacters(req.body.synopsis) || dbBook.synopsis,
          comments: dbBook.comments,
          scoreTotal: 0,
          scoreVotes: 0,
          creator: dbBook.creator,
          updator: dbBook.updator,
        }
      );
      res.sendStatus(201);
    } catch (error) {
      console.log(error);
    }
  });
  app.delete('/API/book/delete/:id', authToken, async (req, res) => {
    try {
      await bookList.deleteOne({ _id: ObjectId(req.params.id) });
      res.status(202).send(`Deletion of id: ${req.params.id} accepted`);
    } catch (error) {
      res
        .status(403)
        .send(
          'Error, not auhtorised, wrongful Book-ID, or other error occured'
        );
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
