const Sport = require("../models/sport.model.js");
const validation = require("../validation/validate.js");

exports.create = (req, res) => {
    const { error } = validation.validateSport(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);   
    }

const sport = new Sport({
    name: req.body.name
});

Sport.create(sport, (err, data) => {
    if (err)
    res.status(500).send({
        message:
        err.message || "Some error occured while creating the sport"
    });
    else res.send(data);
});
};

exports.findAll = (req, res) => {
    const title = req.query.title;

    Sport.getAll(title, (err, data) => {
        if (err)
        res.status(500).send( {
            message:
            err.message || "Some error occured while retrieving sports"
        });
        else {
            res.send(data);
        }
    })
};

exports.findOne = (req, res) => {
    Sport.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === 'not_found_sport') {
                res.status(404).send({
                    message: `Not found Sport with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Sport with id " + req.params.id
                });
            }
        } else res.send(data);
    })
};

exports.update = (req, res) => {
    //Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Sport.updateById(
        req.params.id,
        new Sport(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found_sport") {
                    res.status(404).send({
                        message: `Not found Sport with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Sport with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );

};

exports.delete = (req, res) => {
    Sport.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found_sport") {
                res.status(404).send({
                    message: `Not found Sport with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Sport with id " + req.params.id
                });
            }
        } else res.send({ message: `Sport was deleted successfully!`});
    });

};