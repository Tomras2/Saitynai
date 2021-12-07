const Club = require("../models/club.model.js");
const validation = require("../validation/validate.js");

exports.create = (req, res) => {
const club = new Club({
    name: req.body.name,
    director: req.body.director || "",
    budget: req.body.budget || "",
    sport_id_FK: req.params.sid
});

Club.create(club, req.params.sid, (err, data) => {
    if (err) {
            if (err.kind === 'not_found_sport') {
                res.status(404).send({
                    message: `Not found sport with id ${req.params.sid}.`
                });
            } 
else{
    const { error } = validation.validateClub(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);   
    }
    res.status(500).send({
        message:
        err.message || "Some error occured while creating the club"
    });
}
    }
else
   res.status(201).send(data);
});
};

exports.findAll = (req, res) => {
    const title = req.query.title;

    Club.getAll(title, req.params.id, (err, data) => {
        if (err) {
             if (err.kind === "not_found_sport") {
                 console.log("No sport ID found")
                res.status(404).send({
                    message: `Not found sport with id ${req.params.id}.`
                });
            }
            else {
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
    Club.findById(req.params.id, req.params.sid, (err, data) => {
        if (err) {
            if (err.kind === 'not_found_club') {
                res.status(404).send({
                    message: `Not found club with id ${req.params.id}.`
                });
            } else if (err.kind === "not_found_sport") {
                res.status(404).send({
                    message: `Not found sport with id ${req.params.sid}.`
                });
             
            }else {
                res.status(500).send({
                    message: "Error retrieving club with id " + req.params.id
                });
            }
        } else res.send(data);
    })
};

exports.update = (req, res) => {

    Club.updateById(
        req.params.id,
        req.params.sid,
        new Club(req.body),
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
                        message: "Error updating club with id " + req.params.id
                    });
                }
            } else {
                const { error } = validation.validateClub(req.body);
                if (error) {
                    return res.status(400).send(error.details[0].message);   
                }
                else {
            res.send(data);
                }
            }
        }
    );

};

exports.delete = (req, res) => {
    Club.remove(req.params.id, req.params.sid, (err, data) => {
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
                    message: "Could not delete club with id " + req.params.id
                });
            }
        } else res.send({ message: `club was deleted successfully!`});
    });

};