const express = require('express'),
      morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topMovies = [
    {
      Title: 'Interstellar',
      Director: 'Christopher Nolan'
    },
    {
      Title: 'Lord of the Rings',
      Director: 'Peter Jackson'
    },
    {
      Title: 'StarWars',
      Director: 'George Lucas'
    },
    {
      Title: 'Avengers: Infinity War',
      Director: 'Anthony and Joe Russo'
    }
  ];

app.get('/', (req, res) => {
    res.send('Welcome to my movie database');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.use('/', express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});