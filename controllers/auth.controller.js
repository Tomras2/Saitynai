const db = require("../models");
const User = db.user;
const validation = require("../validation/validate.js");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const RefreshToken = require("../models/refreshToken.model");


exports.signup = (req, res) => {
const { error } = validation.validateUser(req.body);
if (error) {
    return res.status(400).send(error.details[0].message);   
}
const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    role: req.body.role || 2
})
User.create(user, (err, data) => {
    if (err) {
    res.status(500).send({
        message:
        err.message || "Some error occured while creating the user"
    });
}
    else res.status(201).send(data);
});
};

exports.signin = (req, res) => {
    User.findByUsername(req.body.username, (err, data) => {
        if (err) {
            if (err.kind === 'not_found_user') {
                res.status(404).send({
                    message: `User not found`
                });
            }
            else {
            res.status(500).send({
                message: "Failed! Something went wrong"
            });
            return;
        }
        }
        else {
            console.log(req.body.password + " " +     data.password)
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                data.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken : null,
                    message: "Invalid Password"
                });
            }
            var token = generateAccesToken({id : data.id, role : data.role});
            let refreshToken = RefreshToken.createToken(data, (err, data) => {
                if (err) {
                    if (err.kind === 'not_found_token') {
                        res.status(403).json({
                            message: `Refresh token is not in the database!.`
                        });
                    }
                    else {
                        console.log("There was some error creating token")
                        res.status(403).json({ message : err.message})
                    }
                }
            })
            console.log("Got refresh token " + refreshToken);
            res.status(200).send({
                username: data.username,
                email: data.email,
                role: data.role,
                accessToken: token,
                refreshToken: refreshToken
            })
        }
    })
}

exports.refreshToken = (req, res) => {
    const {refreshToken : requestToken} = req.body;

    console.log("Hey")

    if (requestToken == null) {
        return res.status(403).json({message : "Refresh Token is required!"});
    }

    console.log("Sec")
    console.log("Token is " + requestToken)

    try {
        RefreshToken.findByToken(requestToken, (err, data) => {
            console.log("Start")
            if (err) {
                console.log("Error")
                if (err.kind === 'not_found_token') {
                    res.status(403).json({
                        message: `Refresh token is not in the database!.`
                    });
                }
                else res.status(400).json({
                    message: err.message
                })
            }
            else {
                let refreshToken = data
                console.log("yo")
                console.log(refreshToken)
            }
            console.log("Fin")
        })
        console.log("Next")
            if (RefreshToken.verifyExpiration(refreshToken)) {
                RefreshToken.Remove(refreshToken.id, (err, data) => {
                    if (err) {
                        if (err.kind === "not_found_token") {
                            res.status(404).send({
                                message: `Not found Token with id ${refreshToken.id}.`
                            });
                        }
                    }
                    else {
                        res.status(403).json({
                            message: "Refresh token was expired. Please make a new signin request"
                        });
                        return;
                    }
                })
            }

            const user = refreshToken.getUser(refreshToken.user_id_FK, (err, data) => {
                if (err) {
                    if (err.kind === "not_found_user") {
                        res.status(404).send({
                            message: `Not found User with id ${refreshToken.user_id_FK}.`
                        });
                    }
                }
            })
            let newAccessToken = generateAccesToken({id : data.id, role : data.role});
            return res.status(200).json({
                accessToken : newAccessToken,
                refreshToken: refreshToken.token
            });
    } catch (err) {
        return res.status(500).json({message : err});
    }
}

function generateAccesToken(user) {
    return jwt.sign(user, process.env.Access_Token_Secret, {expiresIn : process.env.jwtExpiration} )
}