const express = require('express'),
  app = express(),
  morgan = require('morgan'),
  uuid = require('uuid'),
  swaggerJsdoc = require('swagger-jsdoc'),
  swaggerUi = require('swagger-ui-express'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  cors = require('cors'),
  {check, validationResult, body, param} = require('express-validator');

const movies = Models.Movie;
const users = Models.User;

/*let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];                                // CORS implementation 

app.use(cors({
  origin: (origin, callback) => {

    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      let message = "The CORS policy for this application doesn't allow access from origin" + origin;
      return callback(new Error(message), false);
    }
    return callback (null, true);
  }
}));*/

app.use(cors({                                                                                          // Allow requests from all origins
  origin: (origin, callback) => {
    callback(null, true);
  }
}));

mongoose.connect( process.env.CONNECTION_URI , {                                                        // DB connection
  useNewUrlParser: true, useUnifiedTopology: true 
})   .then(() => {
  console.log('Connected to MongoDB Atlas.');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

let auth = require('./auth.js')(app)                                                                    // passport initialize
const passport = require('passport');
require('./passport.js')

app.use(morgan('common'));                                                                              // morgan logging

app.post('/users', [                                                                                    // Create operation for adding new user

  body('username').isLength({min: 5, max:10}).withMessage("Username is required and should be at least 5 characters long.")
    .isAlphanumeric().withMessage("Username can only contain alphanumeric characters."),

  body('password').isLength({min:8, max:16}).withMessage("Password is required and should be at least 8 characters long.")
    .isAlphanumeric().withMessage("Password has to be Alphanumeric, no other characters allowed."),

  body('confirmPassword').notEmpty().withMessage("Please confirm your password.")
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match.');
    }
    return true;
  }),

  body('email').isEmail().withMessage("Invalid email."),

  body('birthday').isDate().withMessage("Invalid date, supported date format is YYYY-MM-DD.")

], async (req, res) => {
/*
#swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      description: "Details of the user to be added.",
      schema: {
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
            "confirmPassword": {
            "type": "string",
            "description": "The password again for confirmation."
            },
            "email": {
            "type": "string",
            "description": "email of the user"
            },
            "birthday": {
            "type": "date",
            "description": "Date of birth of the user"
            }
          }
        },
        "example": {
          "username": "johndoe",
          "password": "secret",
          "confirmPassword": "secret",
          "email": "example@example.com",
          "birthday" : "1999-09-29"
        }
      }
    }
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
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = users.hashPassword(req.body.password);

  await users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        users
          .create({
            username: req.body.username,
            password: hashedPassword,
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

app.put('/users/:username', [                                                                          // UPDATE user details for existing users

  body('username').optional().isLength({min: 5, max:10}).withMessage("Username is required and should be at least 5 characters long.")
    .isAlphanumeric().withMessage("Username can only contain alphanumeric characters."),

  body('password').optional().isLength({min:8, max:16}).withMessage("Password is required and should be at least 8 characters long.")
    .isAlphanumeric().withMessage("Password has to Alphanumeric, no other characters allowed."),

  body('confirmPassword').optional().custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Confirm password does not match.');
    }
    return true;
  }),

  body('email').optional().isEmail().withMessage("Invalid email."),

  body('birthday').optional().isDate().withMessage("Invalid date, supported date format is YYYY-MM-DD.")

], passport.authenticate('jwt', { session: false }), async (req, res) => {
/*
#swagger.security = [{"BearerAuth": []}]
#swagger.parameters["username"] = {
  in: "path",
  description: "The username of the user.",
  required: true,
  type: "string"
}
#swagger.requestBody = {
  required: false,
  content: {
    "application/json": {
      description: "Info fields of the user that can be updated. Fields that are not being updated should be removed from the request body.",
      schema: {
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
            "confirmPassword": {
            "type": "string",
            "description": "The password again for confirmation."
            },
            "email": {
            "type": "string",
            "description": "email of the user"
            },
            "birthday": {
            "type": "date",
            "description": "Date of birth of the user"
            }
          }
        },
        "example": {
          "username": "johndoe",
          "password": "secret",
          "confirmPassword": "secret",
          "email": "example@example.com",
          "birthday" : "1999-09-29"
        }
      }
    }
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
		return res.status(401).send("Permission denied");
	}

	let errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

  let hashedPassword;

  if (req.body.password) {   
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(422).json({ errors: [{ msg: 'Password and confirm password do not match.' }] });
    } else {
      hashedPassword = users.hashPassword(req.body.password);
    }
  }

	await users
		.findOneAndUpdate(
			{ username: req.params.username },
			{
				$set: {
					username: req.body.username,
					password: hashedPassword,
					email: req.body.email,
					birthday: req.body.birthday,
				},
			},
			{ new: true }                                                           // This line makes sure that the updated document is returned
		)
		.then((updatedUser) => {
			res.status(200).json(updatedUser);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send("Error: " + error);
		});
});

app.put('/users/:username/:movieID', [                                                          // UPDATE favorite movies for existing users

  param('username').isLength({min: 5, max:10}).withMessage("Username is required and should be at least 5 characters long.")
  .isAlphanumeric().withMessage("Username can only contain alphanumeric characters."),

  param('movieID').notEmpty().withMessage("movieID is required.")
  .isAlphanumeric().withMessage("movieID can only contain alphanumeric characters.")

], passport.authenticate('jwt', { session: false }), async (req, res) => {
/*
#swagger.security = [{"BearerAuth": []}]
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
  { new: true })                                                                              // This line makes sure that the updated document is returned
 .then((updatedUser) => {
   res.status(200).json(updatedUser);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

app.delete('/users/:username/:movieID', [                                                   // DELETE favorite movies for existing users

  param('username').isLength({min: 5, max:10}).withMessage("Username is required and should be at least 5 characters long.")
    .isAlphanumeric().withMessage("Username can only contain alphanumeric characters."),

  param('movieID').notEmpty().withMessage("movieID is required.")
  .isAlphanumeric().withMessage("movieID can only contain alphanumeric characters.")

], passport.authenticate('jwt', { session: false }), async (req, res) => {
/*
#swagger.security = [{"BearerAuth": []}]
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

app.delete('/users',[                                                                       // DELETE a user from array

  body('username').isLength({min: 5, max:10}).withMessage("Username is required and should be at least 5 characters long.")
    .isAlphanumeric().withMessage("Username can only contain alphanumeric characters.")

], passport.authenticate('jwt', { session: false }), async (req, res) => {
/*
#swagger.security = [{"BearerAuth": []}]
#swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      description: "Username of the user to be deleted.",
      schema: {
        "data": {
          "type": "object",
          "properties": {
            "username": {
            "type": "string",
            "description": "The username of the user."
            }
          }
        },
        "example": {
          "username": "johndoe"
        }
      }
    }
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

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
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

app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {          // Read operation to find a single movie by title
/*
#swagger.security = [{"BearerAuth": []}]
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

app.get('/movies/director/:directorName', [

  param('directorName').notEmpty().withMessage("Director name is required.")
  .matches(/^[a-zA-Z\s]+$/).withMessage("Director name can only contain alphabet characters.")
  
], passport.authenticate('jwt', { session: false }), async (req, res) => {                // Read operation to find a director by name
/*
#swagger.security = [{"BearerAuth": []}]
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

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

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

app.get('/movies', async (req, res) => {                                        // Read operation to get all movies in the database
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

app.get('/genres/:name', [

  param('name').notEmpty().withMessage("Genre name is required.")
  .matches(/^[a-zA-Z\s]+$/).withMessage("Genre name can only contain alphabet characters.")

], passport.authenticate('jwt', { session: false }), async (req, res) => {                                  // Read operation to get a genre description by name
/*
#swagger.security = [{"BearerAuth": []}]
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
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

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

app.use((err, req, res, next) => {                                                        // catch unknown error
console.error(err.stack);
res.status(500).send('Something broke!');
});

const swaggerDocument = require('./swagger-output.json');                                 // swagger config

app.use( "/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 8080;                                                    // server listening port
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});