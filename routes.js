/* Require npms
----- */
const { ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require('./auth.js');
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

  // Allows cross origin request
  app.use(cors());

  /* Authoritisation
----- */

  // logged in verifier
  const authToken = require('./auth.js');

  // checks if user is logged in
  app.get('/isLoggedIn', authToken, (req, res) => {
    res.send(true);
  });

  // returns user (if logged in)
  app.get('/getUser', authToken, async (req, res) => {
    let user = await userList.findOne({ _id: ObjectId(req.user_id) });
    user.password = "Ain't ya bastards gettin' no nothing"; // Ain't gonna share passwords
    res.send(user);
  });

  app.post('/register', register);
  app.post('/login', login);
  app.get('/users', authToken, async (req, res) => {
    console.log(req.user_id);
    return res.send(await userList.find().toArray());
  });

  async function register(req, res) {
    try {
      console.log(req.body);

      // Check inputs & user callbacks
      if (req.body.email == null || req.body.email == '')
        return res.status(400).send(`Incorrect form, email was null or emptey`);
      if (req.body.nickname == null || req.body.nickname == '')
        return res.status(400).send(`Incorrect form, nickname was null or emptey`);
      if (req.body.password == null || req.body.password == '')
        return res.status(400).send(`Incorrect form, a password was null or emptey`);
      if (await userList.findOne({ email: req.body.email })) return res.status(400).send(`email is already in use`);

      // formats fields
      let user = {
        email: req.body.email.toLowerCase(),
        nickname: req.body.nickname,
        password: req.body.password,
      };

      // hashes password
      await bcrypt.hash(user.password, 12, async (err, hash) => {
        user.password = hash;

        if (err)
          return res.send(
            `Error, something went wrong, please make sure you've filled out all fields.
          Error message: ${err.message}`
          );

        await userList.insertOne(user);
        return res.status(201).send(`Users ${user.nickname} has succsessfully registerd`);
      });
      return res.status(500).send('Unkown error occured, try again later!');
    } catch (error) {
      return res.sendStatus(500);
    }
  }
  async function login(req, res) {
    try {
      let user = req.body;
      user.email = user.email.toLowerCase();
      let dbUser = await userList.findOne({ email: user.email });
      console.log(!dbUser);
      if (!dbUser) {
        return res.status(400).send(`Email '${user.email}' was not found.`);
      }

      bcrypt.compare(user.password, dbUser.password, (err, result) => {
        if (err) {
          return res.status(401).send(`Compare Error`);
        }
        if (!result) {
          return res.status(401).send(`Loggin Error: Passwords does not match`);
        }

        let token = generateToken(dbUser);

        res.cookie('token', token, {
          maxAge: 1000 * 3600 * 24,
          httpOnly: true,
          sameSite: 'Lax',
        });

        //TODO: Store token with cookies
        // 200 = ok
        if (token) {
          res.sendStatus(200);
        }
      });
    } catch (err) {
      res.status(401).send(err.message);
    }
  }

  function generateToken(user) {
    // signs a token for our user
    let { _id } = user;

    console.log(user);
    let token = jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1d',
    });

    return token;
  }

  /* API and Other Routes
----- */

  // returns homepage
  app.get('/', (req, res) => {
    res.sendFile(dir + 'html.html');
  });

  // retuns all avalible books
  app.get('/books', async (req, res) => {
    try {
      res.status(200).send(await bookList.find().toArray());
    } catch (error) {
      res.send(error.message);
    }
  });
  app.get('/bookReader', (req, res) => {
    res.send(`I am not needed for crud and parital single page thingies!`);
  });
  // returns specific book
  app.get('/books/:id', async (req, res) => {
    try {
      res.status(200).send(await bookList.findOne({ _id: ObjectId(req.params.id) }));
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  /* 
? Not yet implimented
  app.get('/books/:tag/:arg', async (req, res) => {
    try {
      //db.stuff.find( { foo: /^bar$/i } );
      const filter = new RegExp(/^req.params.arg$/, 'i');
      const list = await bookList.find({ [req.params.tag]: filter }).toArray();

      if (list.length == 0 || typeof list == 'undefined') res.status(404).send(`Error 404: Tag or argument not found`);
      res.status(200).send(list);
    } catch (error) {
      res.send(error.message);
    }
  });
*/

  // encode charactes in string; XSS security
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

  // route fir creating book
  app.post('/API/book/create', authToken, async (req, res) => {
    try {
      let dbBook = await bookList.findOne({ title: req.body.title });
      if (!req.body.title || !req.body.author) {
        res.status(400).send('Title and auhtor needed!');
      }
      console.log(dbBook.title == req.body.title);

      if (dbBook.title == req.body.title && dbBook.author == req.body.auhtor) {
        res.status(400).send('Book already exist! Otherwise, please contact admin support!');
      }

      let book = {
        title: req.body.title,
        serie: encodeCharacters(req.body.serie || 'No serie'),
        releaseYear: encodeCharacters(req.body.releaseYear || 'unkown'),
        author: encodeCharacters(req.body.author),
        synopsis: encodeCharacters(req.body.synopsis || 'Not yet provided'),
        comments: {},
        scoreTotal: 0,
        scoreVotes: 0,
        creator: { [req.user_id]: Date.now() },
        updator: {},
      };

      bookList.insertOne(book);
      return res.status(201).send(`Book <i>${book.title}</i> created`);
    } catch (error) {
      console.log(error);
      return res.status(500).send(`Procces could not be handled`);
    }
  });

  // Updates book in database
  app.post('/API/book/update', authToken, async (req, res) => {
    try {
      console.log(req.body);
      let dbBook = await bookList.findOne({ _id: ObjectId(req.body.id) });

      if (!dbBook) {
        res.status(404).send('Bookentry not found');
        return;
      }
      console.log(await dbBook);
      dbBook.updator = [];
      dbBook.updator.push({ [req.user_id]: Date.now() });
      bookList.replaceOne(
        { _id: ObjectId(req.body.id) },
        {
          title: encodeCharacters(req.body.title || dbBook.title),
          serie: encodeCharacters(req.body.serie || dbBook.serie),
          releaseYear: encodeCharacters(req.body.releaseYear || dbBook.releaseYear),
          author: encodeCharacters(req.body.author || dbBook.author),
          comments: dbBook.comments,
          scoreTotal: 0,
          scoreVotes: 0,
          creator: dbBook.creator,
          updator: dbBook.updator,
        }
      );

      return res.sendStatus(201);
    } catch (error) {
      console.log(error);
      return res.status(500).send(`Procces could not be handled`);
    }
  });

  // Deletes book from database, based on param id
  app.delete('/API/book/delete/:id', authToken, async (req, res) => {
    try {
      await bookList.deleteOne({ _id: ObjectId(req.params.id) });
      res.status(202).send(`Deletion of id: ${req.params.id} accepted`);
    } catch (error) {
      res.status(403).send('Error, not auhtorised, wrongful Book-ID, or other error occured');
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
