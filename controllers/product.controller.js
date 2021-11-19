const Product = require("../models/product.model.js");
const validation = require("../validation/validate.js");

exports.create = (req, res) => {
const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description || "",
    club_id_FK: req.params.cid
});
Product.create(product, req.params.sid, req.params.cid, (err, data) => {
    if (err) {
        if (err.kind === 'not_found_sport') {
                res.status(404).send({
                    message: `Not found sport with id ${req.params.sid}.`
                });
            }
        else if (err.kind === "not_found_club") {
            res.status(404).send({
                message: `Not found club with id ${req.params.cid}.`
            });
        } 
else{
    const { error } = validation.validateProduct(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);   
    }
    res.status(500).send({
        message:
        err.message || "Some error occured while creating the product"
    });
}
    }
else
   res.send(data);
});
};

exports.findAll = (req, res) => {
    const title = req.query.title;

    Product.getAll(title, req.params.sid, req.params.cid, (err, data) => {
        if (err) {
             if (err.kind === "not_found_sport") {
                 console.log("No sport ID found")
                res.status(404).send({
                    message: `Not found sport with id ${req.params.sid}.`
                });
            }
            else if (err.kind === "not_found_club"){
                res.status(404).send({
                    message: `Not found club with id ${req.params.cid}.`
                });
            } else {
            console.log("Sum error");
        res.status(500).send( {
            message:
            err.message || "Some error occured while retrieving clubs"
        });
    }
}
        else 
        {
            console.log("Data here");
            res.send(data);
        }
    })
};

exports.findOne = (req, res) => {
    Product.findById(req.params.id, req.params.sid, req.params.cid, (err, data) => {
        if (err) {
            if (err.kind === 'not_found_club') {
                res.status(404).send({
                    message: `Not found club with id ${req.params.cid}.`
                });
            } else if (err.kind === "not_found_sport") {
                res.status(404).send({
                    message: `Not found sport with id ${req.params.sid}.`
                });
            } else if (err.kind === "not_found_product") {
                res.status(404).send({
                    message: `Not found product with id ${req.params.id}.`
                });
            
            }else {
                res.status(500).send({
                    message: "Error retrieving product with id " + req.params.id
                });
            }
        } else res.send(data);
    })
};

exports.update = (req, res) => {

    Product.updateById(
        req.params.id,
        req.params.sid,
        req.params.cid,
        new Product(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found_club") {
                    res.status(404).send({
                        message: `Not found club with id ${req.params.id}.`
                    });
                    
                } else if (err.kind === "not_found_sport") {
                    res.status(404).send({
                        message: `Not found sport with id ${req.params.sid}.`
                    });
                }else {
                    res.status(500).send({
                        message: "Error updating product with id " + req.params.id
                    });
                }
            } else {
                const { error } = validation.validateProduct(req.body);
                if (error) {
                    return res.status(400).send(error.details[0].message);   
                } 
            res.send(data);
            }
        }
    );

};

exports.delete = (req, res) => {
    Product.remove(req.params.id, req.params.sid, req.params.cid, (err, data) => {
        if (err) {
             if (err.kind === "not_found_sport") {
                res.status(404).send({
                    message: `Not found sport with id ${req.params.sid}.`
                });
            } else if (err.kind === "not_found_club") {
                res.status(404).send({
                    message: `Not found club with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete product with id " + req.params.id
                });
            }
        } else res.send({ message: `product was deleted successfully!`});
    });

};