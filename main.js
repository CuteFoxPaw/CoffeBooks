/* Main inports / require
----- */
const express = require("express");
const app = express();
const dir = __dirname + "/";
const MongoClient = require("mongodb").MongoClient;

// Allows the use of enviorment variables
require("dotenv").config();

//This  is a comment by david!!!

//

/* Middlewares
----- */

const logger = require("morgan");
app.use(logger("dev"));

//function middleWares() {
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./static"));
//}
//

// Grants access to get and body variabels
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//

/* Conncet and initiate DataBase [MongoDB]
----- */

const uri = process.env.URI;
console.log(`-- TBL LOG :: process`, process);
console.log("Super duper thingyfi: process", process);
console.log("uri", uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
connect();

//

//

/* Application initiation process 
----- */

const PORT = process.env.PORT || 5500;

//

/* This is basicly an API, it returns pure data for our enjoyment
----- */

require("./tempAPI-example.js")(app);

//

//

/* Functions of all manners
----- */

async function connect() {
  const connection = await client.connect();
  const db = client.db("CoffeeBooks");
  const bookList = db.collection("BookList");
  const userList = db.collection("users");

  // middleWares();

  app.listen(PORT, console.log(`-- Server is running on PORT: ${PORT} --`));

  require(dir + "routes.js")(bookList, userList, express, app);

  //!  client.close();
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
400 - Bad Request; The server cannot or will not process the request due to an apparent client error 
304 - all ok, not modified
201 - all ok

https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_client_errors
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
// Sync vs extension https://itnext.io/settings-sync-with-vs-code-c3d4f126989
/*
git config --global user.name "AUserName" // username set 
 git config --global user.name "E@mail.com" //email set 

git --version //checks version
init git // creatre master bash with ./.git, done once
git add . // adds all files to 'git-plan-to-comit-changes'
git add "index.js" // adds only index.js to git
git commit -m"Change Notes" //commits the git

git status // checks satus of files

// if you have a secure file, like password. create a '.gitignore' file in which you'll just add the name of document, more files-ignore is seperated by new lines. You can also add a whole dir of the mat. '.gitignore' must be in root

//--- upload to github --

git remote add origin https://github.com/CuteFoxPaw/testerVisual.git

git remote // gets origin

git push origin master // uploads code, master root-doc = brach, origin = github address

git clone origin master// get project, used firts time
git pull origin master// gets changes


// reset local branch
  https://stackoverflow.com/questions/1125968/how-do-i-force-git-pull-to-overwrite-local-files 
*/
