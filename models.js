const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({

    _id: String,

    title: {type: String, required: true},

    description: {type: String, required: true},

    director: [{
      name: String,
      bio: String,
      birthyear: String,
      beathyear: String
    }],

    genre: {
      name: String,
      description: String
    },

    imageurl: String,
    featured: Boolean
});

let userSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  birthday: Date,
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;