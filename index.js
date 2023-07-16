const express = require('express'),
    app = express(),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

app.use(morgan('common'));

app.use(bodyParser.json());

let users = [
  {
    id: 0,
    username: "jack654",
    email: "jack654@placeholder.com",
    favoriteMovies: []
  },
  {
    id: 1,
    username: "sarah987",
    email: "sarah987@placeholder.com",
    favoriteMovies: ["Interstellar"]
  }
];

let movies = [
  {
    Title: "Interstellar",
    Description: "In Earth's future, a global crop blight and second Dust Bowl are slowly rendering the planet uninhabitable. Professor Brand (Michael Caine), a brilliant NASA physicist, is working on plans to save mankind by transporting Earth's population to a new home via a wormhole. But first, Brand must send former NASA pilot Cooper (Matthew McConaughey) and a team of researchers through the wormhole and across the galaxy to find out which of three planets could be mankind's new home.",
    Genre : [ "Adventure", "Science fiction", "Drama" ],
    Director: [{
      Name: "Christopher Nolan",
      Bio: "Christopher Edward Nolan was born on 30 July 1970, in Westminster, London is a British and American filmmaker and screenwriter. His father, Brendan, was a British advertising executive who worked as a creative director. His mother, Christina, was an American flight attendant from Evanston, Illinois; she would later work as a teacher of English. He has an elder brother, Matthew, and a younger brother, Jonathan, also a filmmaker. Christopher Nolan is Known for his Hollywood blockbusters with complex storytelling, Nolan is considered a leading filmmaker of the 21st century. His films have grossed $5 billion worldwide. The recipient of many accolades, he has been nominated for five Academy Awards, five BAFTA Awards and six Golden Globe Awards. In 2015, he was listed as one of the 100 most influential people in the world by Time, and in 2019, he was appointed Commander of the Order of the British Empire for his contributions to film.",
      Born: 1970
  }],
  ImageURL: "https://m.media-amazon.com/images/M/MV5BNzM4ODUzZjAtNmFhNi00N2VhLTk3NTAtNDNiYTY2MzE2MTE5XkEyXkFqcGdeQXVyNTc3MjUzNTI@.jpg",
  Featured: true
  },
  {
    Title: "The Lord of the Rings",
    Description: "Set in the fictional world of Middle-earth, the films follow the hobbit Frodo Baggins as he and the Fellowship embark on a quest to destroy the One Ring, to ensure the destruction of its maker, the Dark Lord Sauron. The Fellowship eventually splits up and Frodo continues the quest with his loyal companion Sam and the treacherous Gollum. Meanwhile, Aragorn, heir in exile to the throne of Gondor, along with the elf Legolas, the dwarf Gimli, Merry, Pippin, and the wizard Gandalf, unite to save the Free Peoples of Middle-earth from the forces of Sauron and rally them in the War of the Ring to aid Frodo by distracting Sauron's attention.",
    Genre : [ "Adventure", "Action", "Drama" ],
    Director: [{
      Name: "Peter Jackson",
      Bio: "Sir Peter Robert Jackson (born 31 October 1961) is a New Zealand film director, screenwriter and producer. He was born in Wellington and was raised in its far northern suburb of Pukerua Bay. His parents – Joan a factory worker and housewife, and William Bill Jackson, a wages clerk – were emigrants from England. Peter Jackson is best known as the director, writer and producer of the Lord of the Rings trilogy (2001–2003) and the Hobbit trilogy (2012–2014), both of which are adapted from the novels of the same name by J. R. R. Tolkien. Other notable films include the critically lauded drama Heavenly Creatures (1994), the horror comedy The Frighteners (1996), the epic monster remake film King Kong (2005), the World War I documentary film They Shall Not Grow Old (2018) and the documentary The Beatles: Get Back (2021). He is the fourth-highest-grossing film director of all-time, his films having made over $6.5 billion worldwide.",
      Born: 1961
    }],
    ImageURL: "https://upload.wikimedia.org/wikipedia/en/2/23/The_Lord_of_the_Rings%2C_TROTK_%282003%29.jpg",
    Featured: true
  },
  {
    Title: "Cloud Atlas",
    Description: "An exploration of how the actions of individual lives impact one another in the past, present and future, as one soul is shaped from a killer into a hero, and an act of kindness ripples across centuries to inspire a revolution.",
    Genre : [ "Mystery", "Science fiction", "Drama" ],
    Director: [{
      Name: "The Wachowskis",
      Bio: "Lana Wachowski (born June 21, 1965; formerly known as Larry Wachowski) and Lilly Wachowski (born December 29, 1967; formerly known as Andy Wachowski) are American film and television directors, writers and producers. Their mother, Lynne Luckinbill, was a nurse and painter. Their father, Ron Wachowski, was a businessman of Polish descent. Their uncle is an actor and Primetime Emmy Award–winning producer, Laurence Luckinbill. Ron and Lynne died five weeks apart in the late 2010s. Lana and Lilly have two other sisters, Julie and Laura.Julie was assistant coordinator for the film Bound; she is a novelist and screenwriter. The Wachowskis sisters have worked as a writing and directing team through most of their careers. They made their directing debut in 1996 with Bound and achieved fame with their second film, The Matrix (1999), a major box office success for which they won the Saturn Award for Best Director. They wrote and directed its two sequels, The Matrix Reloaded and The Matrix Revolutions (both in 2003), and were involved in the writing and production of other works in the Matrix franchise.",
      Born: [1965, 1967]
    }, {
      Name: "Tom Tykwer",
      Bio: "Tom Tykwer (born 23 May 1965) is a German film director, producer, screenwriter, and composer. He is best known internationally for directing the thriller films Run Lola Run (1998), Heaven (2002), Perfume: The Story of a Murderer (2006), and The International (2009). He collaborated with The Wachowskis as co-director for the science fiction film Cloud Atlas (2012) and the Netflix series Sense8 (2015–2018), and worked on the score for Lana Wachowski's The Matrix Resurrections (2021). Tykwer is also well known as the co-creator of the internationally acclaimed German television series Babylon Berlin (2017–). Tykwer was born in Wuppertal, West Germany. Fascinated by film from an early age, he started making amateur Super 8 films at the age of eleven. He later helped out at a local arthouse cinema in order to see more films, including those for which he was too young to buy tickets. After graduating from high school, he applied to numerous film schools around Europe, unsuccessfully.",
      Born: 1965
    }],
    ImageURL: "https://m.media-amazon.com/images/M/MV5BMTczMTgxMjc4NF5BMl5BanBnXkFtZTcwNjM5MTA2OA@@.jpg",
    Featured: true
  }
];

let genres = [

  { Name: "Adventure",
    Description: "An adventure story feautures a protagonist who journeys to epic or distant places to accomplish something. Main plot elements include quests for lost continents, a jungle or desert settings, characters going on a treasure hunts and heroic journeys into the unknown. Adventure films are mostly set in a period background and may include adapted stories of historical or fictional adventure heroes within the historical context."},

  { Name: "Science fiction",
    Description: "Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, dinosaurs, mutants, interstellar travel, time travel, or other technologies. Science fiction films have often been used to focus on political or social issues, and to explore philosophical issues like the human condition."},

  { Name: "Drama",
    Description: "Drama is a genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone, focusing on in-depth development of realistic characters who must deal with realistic emotional struggles."},

  { Name: "Mystery",
    Description: "A mystery story follows an investigator as they attempt to solve a puzzle. The details and clues are presented as the story continues and the protagonist discovers them and by the end of the story the mystery is solved."},

  { Name: "Action",
    Description: "Action genre is generally defined by risk and stakes. Action films tend to feature a resourceful character struggling against life-threatening situations which generally conclude in victory for the hero."}

];

app.get('/', (req, res) => {                                            // Read operation for homepage
  res.send('Welcome to my movie database');
});

app.post('/users', (req, res) => {                                      // Create operation for adding new user
  const newUser = req.body;

  if (newUser.username) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  }
});

app.put('/users/:username', (req, res) => {                             // UPDATE username for existing users
  const {username} = req.params;
  const updatedUser = req.body;
  let user = users.find((user) => { return user.username === username });

  if (user) {
    user.username = updatedUser.username;
    res.status(200).json(user);
  } else {
    res.status(404).send('User with the username ' + req.params.username + ' was not found.');
  }
});

app.put('/users/:username/:movieTitle', (req, res) => {                             // UPDATE favorite movies for existing users
  const {username, movieTitle} = req.params;

  let user = users.find((user) => { return user.username === username });

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${user.username}'s list.`);
  } else {
    res.status(400);
  }
});

app.delete('/users/:username/:movieTitle', (req, res) => {                             // DELETE favorite movies for existing users
  const {username, movieTitle} = req.params;

  let user = users.find((user) => { return user.username === username });

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from ${user.username}'s list.`);
  } else {
    res.status(400);
  }
});

app.delete('/users', (req, res) => {                                        // DELETE a user from array
  const deletedUser = req.body;

  let user = users.find((user) => { return user.username === deletedUser.username });

  if (user) {
    users = users.filter(user => user.username !== deletedUser.username);
    res.status(200).send(`User ${deletedUser.username} has been deleted.`);
  } else {
    res.status(400);
  }
});

app.get('/movies/:title', (req, res) => {                               // Read operation to find a single movie by title
const {title} = req.params;
const movie = movies.find((movie) => movie.Title === title);

if (movie) {
  res.status(200).json(movie);
} else {
  res.status(404).send('No such movie!!')
}

});

app.get('/movies/director/:directorName', (req, res) => {                // Read operation to find a director by name
  const {directorName} = req.params;
  const director = movies
    .flatMap((movie) => movie.Director)
    .find((director) => director.Name === directorName);
  
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('No such director!!')
  }
  
});

app.get('/movies', (req, res) => {                                        // Read opeartion to get all movies in the database
  res.status(200).json(movies);
});

app.get('/genres/:name', (req, res) => {                                  // Read operation to get a genre description by name
  const {name} = req.params;
  const genre = genres.find((genre) => genre.Name === name);
  
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('No such genre!!')
  }
  
});

app.use('/', express.static('public'));                                    // serve the documentation webpage

app.use((err, req, res, next) => {                                          // catch unknown error
console.error(err.stack);
res.status(500).send('Something broke!');
});

app.listen(8080, () => {                                                     // server listening port
console.log('Your app is listening on port 8080.');
});