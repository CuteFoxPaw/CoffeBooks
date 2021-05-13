/* Require npms
----- */
const { ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const dir = __dirname + '/';

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

  /* Authoritisation
----- */

  const auth = require('./auth.js');

  app.post('/register', register);
  app.post('/login', login);
  app.get('/users', auth, async (req, res) => {
    //res.send(await /*DB FOR USERS*/);
  });

  async function register(req, res) {
    let user = req.body;
    await bcrypt.hash(user.pwd, 12, async (err, hash) => {
      user.pwd = hash;
      console.log(user);

      if (err)
        return res.send(
          `Error, something went wrong, please make sure you've filled out all fields.
        Error message: ${err.message}`
          //! Error message: Illegal arguments: undefined, number
        );
      try {
        await userList.insertOne(user);
        res.send(`Users ${user.name} has succsessfully registerd`);
      } catch (err) {}
    });
  }
  async function login(req, res) {}

  /* Routes
----- */
  // returns homepage
  app.get('/', (req, res) => {
    res.sendFile(dir + 'html.html');
  });

  //! Change API routes to api prefixes ie. '/api/books' 'api/books/:id'
  // retuns all avalible books
  app.get('/books', async (req, res) => {
    try {
      res.status(201).send(await bookList.find().toArray());
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
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  app.get('/*', (req, res) => {
    res.status(404).send(`Page Not Found`);
  });
};
