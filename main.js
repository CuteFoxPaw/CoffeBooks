/* Main inports / require
----- */
const express = require('express');
const app = express();
const dir = __dirname + '/';
const MongoClient = require('mongodb').MongoClient;

// Allows the use of enviorment variables
require('dotenv').config();

//

/* Middlewares
----- */

const logger = require('morgan');
app.use(logger('dev'));

//

// Grants access to get and body variabels
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//

/* Conncet and initiate DataBase [MongoDB]
----- */

const uri = process.env.URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connect();

//

/* Application initiation process 
----- */

const PORT = process.env.PORT || 5500;
app.listen(PORT, console.log(`-- Server is running on PORT: ${PORT} --`));

//

/* This is basicly an API, it returns pure data for our enjoyment
----- */
//api - gives pure data
//skickar lista på all data
app.get('/cars', (req, res) => {
  res.send('Hellow World!');
});

//skickar data om ett object

app.get('/cars/:id', (req, res) => {
  res.send('Single Wordls');
});

//skapar nytt ovjekt
app.post('/cars', (req, res) => {
  res.send('crt');
});

//SSR Server side REndering
app.get('/about', (req, res) => {
  res.sendFile(__dirname + 'index.html');
});

//

/* Functions of all manners
----- */

async function connect() {
  const connection = await client.connect();
  const db = client.db('CoffeeBooks');
  const bookList = db.collection('BookList');

  require(dir + 'routes.js')(bookList);

  client.close();
}

//

//

//
/*
TODO: Develop everything backend, afterward develop frontend
-- Develop Server first. Afterwards connect to with client
1) Create a connection to your DB (mongoDB)
2) Create user-list (linked to DB)
3) Create CRUD to mongoDB
5) (Fileupload, book-pictures)(If too much time to spare)

// Mongo DB account - G-mail Direct Auth

*/
//

//

/* Information bubbles
----- */
/*
? status codes:
500 - server problem
404 - client problem
304 - all ok, not modified
201 - all ok
*/

/* Resources
-----

-- Main resource --
• MongoDB, incl: API, JWT, ENV, ROUTES, LOGIN: https://replit.com/@RichardTE18IT/2021-03-24RegUser-with-MongoDB#index.js

• Handlebars: 'D:\Program\OneDrive - Halmstads kommun\Te18IT\Webbserverprogramering 1\Node-Js\2021-02-15-handlebars' index.js

-- Other --
• Node Startup, incl MW: https://replit.com/@RichardTE18IT/nodeonsdag21-02-10#index.js 
• Filesystem (fs) [probably not needed]: 'D:\Program\OneDrive - Halmstads kommun\Te18IT\Webbserverprogramering 1\Node-Js\2021-03-23_rep\main.js'
-- Startups --
• Node Startup: https://replit.com/@RichardTE18IT/21-02-16NodeTraining#index.js
• Node Startup: https://replit.com/@RichardTE18IT/nodetuesday21-02-10#index.js 

 */
/*
git config --global user.name "AUserName" // username set 
git config --global user.name "E@mail.com" //email set 

git --version //checks version
init git // creatre master bash with ./.git
git add . // adds files to 'git-plan-to-comit-changes'
git commit -m"Change Notes" //commits and uploads to git
*/