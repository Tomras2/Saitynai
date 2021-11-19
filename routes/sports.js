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








//const sports = [
    //     {id: 1, name: 'Basketball'},
    //     {id: 2, name: 'Football'},
    //     {id: 3, name: 'Tennis'},
    //     {id: 4, name: 'Tennis2'},
    // ];
    
    // router.get('/', (req, res) => {
    //      res.send(sports);
    // });
    
    // router.get('/:id', (req, res) => {
    //     const sport = sports.find(c => c.id === parseInt(req.params.id));
    //     if (!sport) return res.status(404).send('Sport with the given id not found')
    //     res.send(sport);
    //  });
    
    // router.post('/', (req, res) => {
    //     const { error } = validateSport(req.body);
    //     if (error) {
    //         return res.status(400).send(error.details[0].message);   
    //     }
    //     const sport = {
    //         id: sports.length + 1,
    //         name: req.body.name
    //     };
    //     sports.push(sport);
    //     res.status(201).send(sport);
    // });
    
    // router.put('/:id', (req, res) => {
    //     const sport = sports.find(c => c.id === parseInt(req.params.id));
    //     if (!sport) return res.status(404).send('Sport with the given id not found')
    
    //     const { error } = validateSport(req.body);
    //     if (error) {
    //         return res.status(400).send(error.details[0].message);
    //     }
    
    //     sport.name = req.body.name;
    //     res.send(sport);
    // })
    
    // router.delete('/id', (req, res) => {
    //     const sport = sports.find(c => c.id === parseInt(req.params.id));
    //     if (!sport) return res.status(404).send('Sport with the given id not found')
    
    //     const index = sports.indexOf(sport);
    //     sports.splice(index, 1);
    
    //     res.send(sport);
    // })