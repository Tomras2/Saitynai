module.exports = app => {

    const express = require('express')
    const router = express.Router()
    const products = require("../controllers/product.controller.js");
    const { authJwt } = require("../middleware");

    app.use(function(req, res, next) {
      res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
      );
      next();
  });

    // Retrieve all products
    router.get("/:sid/clubs/:cid/products", products.findAll);
    
    //   Retrieve a single Product with id
    router.get("/:sid/clubs/:cid/products/:id", [authJwt.verifyToken], products.findOne);
    
    //   Create a new Product
     router.post("/:sid/clubs/:cid/products", [authJwt.verifyToken], [authJwt.isAdmin], products.create);
    
    //   Update a Product with id
    router.put("/:sid/clubs/:cid/products/:id", [authJwt.verifyToken], [authJwt.isAdmin], products.update);
    
    //   Delete a Product with id
    router.delete("/:sid/clubs/:cid/products/:id", [authJwt.verifyToken], [authJwt.isAdmin], products.delete);
    
      app.use('/api/sports', router);
    };