module.exports = (app) => {
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
};
