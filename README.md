# CoffeBooks - Node.js Booklist

## Background

This is my course exam project for *Webserver Development 1*; spring 2021.

This is also similar to the [PHP-Booklist](https://github.com/VulpesPaw/PHP-BookList "Link to PHP-BookList, Booklist made with native PHP") as well as the [Firebase Booklist](https://github.com/VulpesPaw/FireBookList "Link to FireBookList, Booklist made with Firebase and Firestore") 

## Purpose

CoffeBooks is a Node.JS Express web application that will render a list of books; which is inputted by any user.

 
#### Exam requirements:

- Basic Programing Principels

- Server CRUD should be built as APIs 

- Full CRUD

- Using an Online Database (I used MongoDB)

- Authentication 

- Authorization

- Back-end and Front-end should be developed separately

## Development

I started by developing the backend, its APIs as well as its connection to the MongoDB cluster. I used Postman to generate Get, Post, Delete (and so forth) -requests. By this stage, there where not a single line of front-end development.

The front-end got developed as the back-end got its most important features implemented. JavaScript got used with fetch requests to call the back-end API for data. Thereafter, the front-end javascript put the data into templates and it gets shown to the user.



The project includes but is not limited to the following functionalities:

- Authentication utilizing JWT-tokens

- Appropriate Authorization for the different types of request

- BCrypt-hashing for user account security

- Full CRUD 

- SPA – Single Page Application, whenever a new item is added; the page does not need to reload and data does not need to be fetched unnecessarily

- Node.JS Express server side, built as APIs

- Front-end API fetching

- MongoDB Online Database





### Gui

The main page features an overview of every entry in the database

![coffebooks_preview](https://user-images.githubusercontent.com/63596133/190172768-fd0bb638-7fa3-48af-ac8b-efa1a0064b47.png)


## Serialization 

`./.env` is not included in the project. Location: root folder (`./`)

The environment-variable file contains the following:

``` .env
PORT = 5500
URI = "MongoDb_Access_Config_Key_Incluing_Password"
ACCESS_TOKEN_SECRET=A_random_generated_token_on_60_chars
REFRESH_TOKEN_SECRET=A_random_generated_token_on_60_chars
```



##  Licence
No Licence
 
