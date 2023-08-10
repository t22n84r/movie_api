const jwtSecret = '3785X@Q7YZWd5aet'                                    // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
      passport = require('passport'),
      {check, validationResult, body, param} = require('express-validator');

require('./passport.js');

let generateJWTtoken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.username,
        expiresIn: '3d',
        algorithm: 'HS256'
    });
}


module.exports = (router) => {
    router.post('/login', [
        body('username').isLength({min: 5, max:10}).withMessage("Username is required and should be at least 5 characters long.")
        .isAlphanumeric().withMessage("Username can only contain alphanumeric characters."),

        body('password').isLength({min:8, max:16}).withMessage("Password is required and should be at least 8 characters long.")
        .isAlphanumeric().withMessage("Password has to be Alphanumeric, no other characters allowed.")
    ], (req, res) => {
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
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }
        
        passport.authenticate('local', {session: false}, (error, user, info) => {
            if (error) {
                return res.status(400).json({
                  message: 'An error occurred',
                  error: error,
                });
            }
              
            if (!user) {
            return res.status(400).json({
                message: 'Authentication failed',
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