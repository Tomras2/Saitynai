const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    
jwt.verify(token.replace(/['"]+/g, ''), config.secret, (err, decoded) => {
    if (err) {
        console.log(token)
        return res.status(401).send({
            message: "Unauthorized!" + " " + err
        });
    }
    req.userId = decoded.id;
    next();
})
}
isAdmin = (req, res, next) => {
    User.findRole(req.userId, (err, data) => {
        if (data.role === 3){
            console.log("YES")
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