const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const express = require('express')
const router = express.Router()

module.exports = function(app) {
  
    // app.use(function(req, res, next) {
    //     res.header(
    //         "Access-Control-Allow-Headers",
    //         "x-access-token, Origin, Content-Type, Accept"
    //     );
    //     next();
    // });

    router.post(
        "/api/auth/signup",
        [
          verifySignUp.checkDuplicateUsernameOrEmail,
        ],
        controller.signup
      );

    router.post("/api/auth/signin", controller.signin);

    router.post("/api/auth/refreshToken", controller.refreshToken);

    app.use("/", router);
};