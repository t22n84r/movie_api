const jwtSecret = '3785X@Q7YZWd5aet'                                    // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
      passport = require('passport');

require('./passport.js');

let generateJWTtoken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.username,
        expiresIn: '3d',
        algorithm: 'HS256'
    });
}


module.exports = (router) => {
    router.post('/login', (req, res) => {
    /*
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                description: "username & password credentials for the user.",
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
                            }
                        }
                    },
                    "example": {
                        "username": "johndoe",
                        "password": "secret"
                    }
                }
            }
        }
    }
    */
        passport.authenticate('local', {session: false}, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, {session: false}, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTtoken(user.toJSON());
                return res.json({user: user, token: token});
            });
        })(req, res);
    });
}