const express = require('express'),
  app = express(),
  morgan = require('morgan'),
  uuid = require('uuid'),
  swaggerJsdoc = require('swagger-jsdoc'),
  swaggerUi = require('swagger-ui-express'),
  mongoose = require('mongoose'),
  Models = require('./models.js');

const movies = Models.Movie;
const users = Models.User;

mongoose.connect('mongodb://127.0.0.1:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

let auth = require('./auth.js')(app)
const passport = require('passport');
require('./passport.js')

app.use(morgan('common'));

/*app.get('/', (req, res) => {                                            // Read operation for homepage
  res.send('Welcome to my movie database');
});*/

app.post('/users', async (req, res) => {                                      // Create operation for adding new user
/*
#swagger.parameters["obj"] = {
  in: "body",
  description: "Details of the user to be addded.",
  schema: {
    "username": "username of the user",
    "password": "password of the user",
    "email": "email of the user",
    "birthday": "Date of birth of the user"
  }
}
#swagger.responses[200] = {
  "description": "Details of the user that was added.",
  "schema": {
    "data": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "The username of the user."
        },
        "password": {
          "type": "string",
          "description": "The password of the user."
        },
        "email": {
          "type": "string",
          "description": "The email of the user."
        },
        "birthday": {
          "type": "date",
          "description": "The birthday of the user."
        }
      }
    }
  }
}
*/
  await users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        users
          .create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            birthday: req.body.birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

app.put('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {                             // UPDATE username for existing users
/*
#swagger.parameters["username"] = {
  in: "path",
  description: "The username of the user.",
  required: true,
  type: "string"
}
#swagger.parameters["obj"] = {
  in: "body",
  description: "Info fields of the user that can be updated. Fields that are not being updated should be removed from the request body",
  schema: {
    "username": "username of the user",
    "password": "password of the user",
    "email": "email of the user",
    "birthday": "Date of birth of the user"
  }
}
#swagger.responses[200] = {
  "description": "Details of the user with the updated field.",
  "schema": {
    "data": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "The username of the user."
        },
        "password": {
          "type": "string",
          "description": "The password of the user."
        },
        "email": {
          "type": "string",
          "description": "The email of the user."
        },
        "birthday": {
          "type": "date",
          "description": "The birthday of the user."
        },
        "favoriteMovies": {
          "type": "array",
          "description": "List of favorite movies of the user."
        }
      }
    }
  }
}
*/
  if (req.user.username !== req.params.username) {
    return res.status(401).send('Permission denied');
  }

  await users.findOneAndUpdate({ username: req.params.username },
    { $set:
    {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      birthday: req.body.birthday
    }
  },
  { new: true })                                                                  // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.status(200).json(updatedUser);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

app.put('/users/:username/:movieID', passport.authenticate('jwt', { session: false }), async (req, res) => {                             // UPDATE favorite movies for existing users
/*
#swagger.parameters["username"] = {
  in: "path",
  description: "The username of the user.",
  required: true,
  type: "string"
}
#swagger.parameters["movieID"] = {
  in: "path",
  description: "ID of the movie that needs to be added",
  required: true,
  type: "string"
}
#swagger.responses[200] = {
  "description": "Details of the user with the updated favorite movies list.",
  "schema": {
    "data": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "The username of the user."
        },
        "password": {
          "type": "string",
          "description": "The password of the user."
        },
        "email": {
          "type": "string",
          "description": "The email of the user."
        },
        "birthday": {
          "type": "date",
          "description": "The birthday of the user."
        },
        "favoriteMovies": {
          "type": "array",
          "description": "List of favorite movies of the user."
        }
      }
    }
  }
}
*/
  if (req.user.username !== req.params.username) {
    return res.status(401).send('Permission denied');
  }

  await users.findOneAndUpdate({ username: req.params.username }, {
    $addToSet: { favoriteMovies: req.params.movieID }
  },
  { new: true })                                                                 // This line makes sure that the updated document is returned
 .then((updatedUser) => {
   res.status(200).json(updatedUser);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

app.delete('/users/:username/:movieID', passport.authenticate('jwt', { session: false }), async (req, res) => {                             // DELETE favorite movies for existing users
/*
#swagger.parameters["username"] = {
  in: "path",
  description: "The username of the user.",
  required: true,
  type: "string"
}
#swagger.parameters["movieID"] = {
  in: "path",
  description: "ID of the movie that needs to be deleted.",
  required: true,
  type: "string"
}
#swagger.responses[200] = {
  "description": "Details of the user with the updated favorite movies list.",
  "schema": {
    "data": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "description": "The username of the user."
        },
        "password": {
          "type": "string",
          "description": "The password of the user."
        },
        "email": {
          "type": "string",
          "description": "The email of the user."
        },
        "birthday": {
          "type": "date",
          "description": "The birthday of the user."
        },
        "favoriteMovies": {
          "type": "array",
          "description": "List of favorite movies of the user."
        }
      }
    }
  }
}
*/
  await users.findOneAndUpdate({ username: req.params.username }, {
    $pull: { favoriteMovies: req.params.movieID }
  },
  { new: true })                                                                 // This line makes sure that the updated document is returned
 .then((updatedUser) => {
   res.status(200).json(updatedUser);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

app.delete('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {                                        // DELETE a user from array
/*
#swagger.parameters["obj"] = {
  in: "body",
  description: "Details of the user to be deleted.",
  schema: {
    "username": "username of the user to be deleted",
  }
}
#swagger.responses[200] = {
  "description": "A message with the username of the user that was deleted",
}
#swagger.responses[400] = {
  "description": "A message saying that the username of the user was not found",
}
*/
  if (req.user.username !== req.body.username) {
    return res.status(401).send('Permission denied');
  }

  await users.findOneAndRemove({ username: req.body.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.body.username + ' was not found');
      } else {
        res.status(200).send(req.body.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {                               // Read operation to find a single movie by title
/*
#swagger.parameters["title"] = {
  in: "path",
  description: "The title of the movie.",
  required: true,
  type: "string"
}
#swagger.responses[200] = {
  "description": "Details of a movie that was searched by title.",
  "schema": {
    "data": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "The title of the movie."
        },
        "description": {
          "type": "string",
          "description": "A brief description of the movie."
        },
        "director": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string",
                "description": "The name of the director."
              },
              "bio": {
                "type": "string",
                "description": "A brief biography of the director."
              },
              "birthyear": {
                "type": "string",
                "description": "The birthyear of the director."
              },
              "deathyear": {
                "type": "string",
                "description": "The deathyear of the director."
              }
            }
          }
        },
        "genre": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "description": "The name of the director."
                },
                "description": {
                  "type": "string",
                  "description": "A brief biography of the director."
                }
              }
            }
          },
        "imageURL": {
          "type": "string",
          "description": "The URL of the movie poster."
        },
        "featured": {
          "type": "boolean",
          "description": "Whether or not the movie is featured."
        }
      }
    }
  }
}
*/
  await movies.findOne ({title: req.params.title})
    .then ((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {                // Read operation to find a director by name
/*
#swagger.parameters["directorName"] = {
  in: "path",
  description: "The name of director.",
  required: true,
  type: "string"
}
#swagger.responses[200] = {
  "description": "Details of the director that was searched by name.",
  "schema": {
    "data": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "The name of the director."
        },
        "bio": {
          "type": "string",
          "description": "A brief life history of the director."
        },
        "birthyear": {
          "type": "string",
          "description": "The birthyear of the director."
        },
        "deathyear": {
          "type": "string",
          "description": "The deathyear of the director."
        }
      }
    }
  }
}
*/
  const {directorName} = req.params;

  await movies.findOne ({ 'director.name':directorName })

    .then((movie) => {
      res.status(200).json(movie.director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {                                        // Read opeartion to get all movies in the database
/*
#swagger.security = [{"BearerAuth": []}]
#swagger.responses[200] = {
  "description": "A list of movies.",
  "schema": {
    "data": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "description": "The title of the movie."
          },
          "description": {
            "type": "string",
            "description": "A brief description of the movie."
          },
          "director": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "description": "The name of the director."
                },
                "bio": {
                  "type": "string",
                  "description": "A brief biography of the director."
                },
                "birthyear": {
                  "type": "string",
                  "description": "The birthyear of the director."
                },
                "deathyear": {
                  "type": "string",
                  "description": "The deathyear of the director."
                }
              }
            }
          },
          "genre": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "description": "The name of the director."
                },
                "description": {
                  "type": "string",
                  "description": "A brief biography of the director."
                }
              }
            }
          },
          "imageURL": {
            "type": "string",
            "description": "The URL of the movie poster."
          },
          "featured": {
            "type": "boolean",
            "description": "Whether or not the movie is featured."
          }
        }
      }
    }
    }
  }
}
*/
  await movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/genres/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {                                  // Read operation to get a genre description by name
/*
#swagger.parameters["name"] = {
  in: "path",
  description: "The name of genre.",
  required: true,
  type: "string"
}
#swagger.responses[200] = {
  "description": "Details of the genre that was searched by name.",
  "schema": {
    "data": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "The name of the genre."
        },
        "description": {
          "type": "string",
          "description": "A brief definition of the genre ."
        }
      }
    }
  }
}
*/
  const {name} = req.params;

  await movies.findOne ({ 'genre.name': name })

  .then((movie) => {
    res.status(200).json(movie.genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//app.use('/', express.static('public'));                                    // serve the documentation webpage

app.use((err, req, res, next) => {                                          // catch unknown error
console.error(err.stack);
res.status(500).send('Something broke!');
});

const swaggerDocument = require('./swagger-output.json');

app.use( "/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(8080, () => {                                                     // server listening port
console.log('Your app is listening on port 8080.');
});