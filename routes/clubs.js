module.exports = app => {

    const express = require('express')
    const router = express.Router()
    const clubs = require("../controllers/club.controller.js");
    const { authJwt } = require("../middleware");

    app.use(function(req, res, next) {
      res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
      );
      next();
  });

      // Retrieve all clubs
      router.get("/:id/clubs", clubs.findAll);
    
    //   Retrieve a single Club with id
    router.get("/:sid/clubs/:id", [authJwt.verifyToken], clubs.findOne);
    
    //   Create a new Club
     router.post("/:sid/clubs", [authJwt.verifyToken], [authJwt.isAdmin], clubs.create);
    
    //   Update a Club with id
    router.put("/:sid/clubs/:id", [authJwt.verifyToken], [authJwt.isAdmin], clubs.update);
    
    //   Delete a Club with id
    router.delete("/:sid/clubs/:id", [authJwt.verifyToken], [authJwt.isAdmin], clubs.delete);
    
      app.use('/api/sports', router);
    };