const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      Models = require('./models.js'),
      passportJWT = require('passport-jwt');

let users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username, password, callback) => {
            console.log(`${username} ${password}`);
            await users.findOne({username: username})
            .then ((user) => {
            if (!user) {
                console.log('incorrect username');
                return callback(null, false, {message: 'Incorrect username.'});
            }
            if (!user.validatePassword(password)) {
                console.log('incorrect password');
                return callback(null, false, {message: 'Incorrect password'});
            }
            console.log('finished');
            return callback(null, user);
            })
            .catch ((error) => {
                console.log(error);
                return callback(error);
            })
        }
    )
);

passport.use(new JWTStrategy ({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: '3785X@Q7YZWd5aet',

    verifyJwt: async (token, done) => {
        const jwtPayload = await jwt.verify(token, '3785X@Q7YZWd5aet');
        done(null, jwtPayload);
    }

}, async (jwtPayload, callback) => {
    return await users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error);
        });
}));