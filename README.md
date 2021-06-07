# CoffeBooks - Node.js Booklist
## Info
This is my webserver development course end-project
## Node.js & Express
This is a booklist made with Node.js and express.\
This is also similar to the [PHP-Booklist](https://github.com/VulpesPaw/PHP-BookList "Link to PHP-BookList, Booklist made with native PHP") as well as the [Firebase Booklist](https://github.com/VulpesPaw/FireBookList "Link to FireBookList, Booklist made with Firebase and Firestore") 
## Note
.env-file is not included as it contains config access to mongoDb Database\
The .env-file should be placed topmost in project, same layer as main.js and routes.js\
***.env contains following:***
``` .env
PORT = 5500
URI = "MongoDb_Access_Config_Key_Incluing_Password"
ACCESS_TOKEN_SECRET=A_random_generated_token_on_60_chars
REFRESH_TOKEN_SECRET=A_random_generated_token_on_60_chars
```

This project ***does NOT include node_modules***, thus you'll need to do a npm init,\
all packages will be downloaded as the package.json file is included 
### Honorble mentions
Big thanks to DavLin for teaching me more about Git, Git Bash and Bash files as well as some nifty node execution commands!

Cheers FoxPaw
