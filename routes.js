/* Require npms
----- */
const { ObjectId } = require('mongodb');
const cors = require('cors');

//

module.exports = (bookList, express, app) => {
  /* Routes
----- */

  /*
  TODO: Fix Auth routes
  TODO: FIX JWT
 */

app.use(cors());
const auth = require('auth');

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
