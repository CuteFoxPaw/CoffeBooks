const express = require('express');
const app = express();

module.exports = (BookList) => {
  /* Routes
----- */

  app.get('/', (req, res) => {
    res.sendFile(dir + 'html.html');
  });

  app.get('/*', (req, res) => {
    res.status(404).send(`Page Not Found`);
  });
};

// added comment from GitHub
