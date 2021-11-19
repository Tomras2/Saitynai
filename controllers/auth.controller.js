const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const validation = require("../validation/validate.js");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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
            var token = jwt.sign({id : data.id}, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            res.status(200).send({
                username: data.username,
                email: data.email,
                role: data.role,
                accessToken: token,
            })
        }
    })
}