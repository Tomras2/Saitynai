const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const {TokenExpiredError} = jwt;

const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        msg= "Unauthorized! Access Token was expired!";
        return res.status(401).send({message: JSON.stringify(msg)})
    }
    msg = "Unauthorized!"
    return res.sendStatus(401).send({ message: JSON.stringify(msg) });
}

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).send({
            message: "No token provided!"
        });
    }
    
jwt.verify(token.replace(/['"]+/g, ''), process.env.Access_Token_Secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
})
}
isAdmin = (req, res, next) => {
    User.findRole(req.userId, (err, data) => {
        if (data.role === 3){
            next();
            return;
        }
else {
    res.status(403).send({
        message: "Admin role required!"
    });
    return;
}
})
}

isUser = (req, res, next) => {
    User.findRole(req.userId).then(role => {
        if (role === "user"){
            next();
            return;
        }

    res.status(403).send({
        message: "User role required!"
    });
    return;
})
}

isUserOrAdmin = (req, res, next) => {
    User.findRole(req.userId).then(role => {
        if (role === "user"){
            next();
            return;
        }
        if (role === "admin"){
            next();
            return;
        }

    res.status(403).send({
        message: "User or Admin role required!"
    });
    return;
})
}

const authJwt = {
    verifyToken: verifyToken,
    isAdmin : isAdmin,
    isUser : isUser,
    isUserOrAdmin : isUserOrAdmin
};
module.exports = authJwt;