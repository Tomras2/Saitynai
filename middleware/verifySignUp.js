const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    User.findByUsername(req.body.username, (err, data) => {
        if (data) {
            res.status(400).send({
                message: "Failed! Username is already in use!"
            });
            return;
        }
   
    User.findByEmail(req.body.email, (err, data) => {
        if (data) {
            res.status(400).send({
                message: "Failed! Email is already in use!"
            });  
            return;
        }
        next();
    })
    })
};
    const verifySignUp = {
        checkDuplicateUsernameOrEmail : checkDuplicateUsernameOrEmail
    };
    
    module.exports = verifySignUp;
