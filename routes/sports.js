module.exports = app => {

const express = require('express')
const router = express.Router()
const sports = require("../controllers/sport.controller.js");
const { authJwt } = require("../middleware");

app.use(function(req, res, next) {
  res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

  // Create a new Sport
  router.post("/", [authJwt.verifyToken], [authJwt.isAdmin], sports.create);

  // Retrieve all Sports
  router.get("/", sports.findAll);

  // Retrieve a single Sport with id
  router.get("/:id", [authJwt.verifyToken], sports.findOne);

  // Update a Sport with id
  router.put("/:id", [authJwt.verifyToken], [authJwt.isAdmin], sports.update);

  // Delete a Sport with id
  router.delete("/:id", [authJwt.verifyToken], [authJwt.isAdmin], sports.delete);

  app.use('/api/sports', router);
};
