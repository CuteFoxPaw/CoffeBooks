/* Require npms
----- */
const { ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const dir = __dirname + '/';
const jwt = require('jsonwebtoken');
console.log = require('./no-indent-logger')(console.log);
//
module.exports = (bookList, userList, express, app) => {
  /* Routes
----- */

  /*
  TODO: Fix Auth routes
  TODO: FIX JWT
 */
  console.log(`sadsad
sadasd as dA
     halös hfäsal f
Lets 
      Try  how
      tis
  mat work
  \n
  asdk
asöld`);

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
      password: req.body.password
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

        //! Check Teams-YT-V-JWT
        const token = jwt.sign(dbUser, { expireIn: 180 });

        //TODO: Store token with cookies
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
  /*
  app.get('/books/delete/:id', (req, res) => {
    try {
      //! Check if user are logged in
      //! Delete object from client as well!
      await bookList.deleteOne({_id:ObjectId(req.params.id)});
      res.status(202).send(`Delete of id: ${req.params.id} accepted`);
      
    } catch (error) {
      res.status(403).send('Error, not auhtorised or other error occured');
    }
  });*/
  app.get('/books/:tag/:arg', async (req, res) => {
    try {
      list = await bookList
        .find({ [req.params.tag]: req.params.arg })
        .toArray();
      if (list.lenght == 0)
        res.status(404).send(`Error 404: Tag or argument not found`);
      res.status(200).send(list);
    } catch (error) {
      res.send(error.message);
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
