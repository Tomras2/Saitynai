const sql = require("../config/db.config.js");
const Sport = require("./sport.model.js");

const Club = function(club) {
    this.name = club.name;
    this.director = club.director
    this.budget = club.budget
    this.sport_id_FK = club.sport_id_FK
};

Club.create = (newClub, sid, result) => {

    Sport.findById(sid, (err) =>
    {
        if (err) {
            if (err.kind === 'not_found_sport') {
               result({kind: "not_found_sport"}, null);
            } else {
                result(err, null);
            }
        }
        else {
            sql.query("INSERT INTO club SET ?", newClub, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }
                console.log("created club: ", {id : res.insertId, ...newClub});
                result(null, {id : res.insertId, ...newClub});
            });
        };
        })
    }



Club.findById = (id, sid, result) => {

    Sport.findById(sid, (err) =>
    {
        if (err) {
            if (err.kind === 'not_found_sport') {
               result({kind: "not_found_sport"}, null);
            } else {
                result(err, null);
            }
        }
        else {
            sql.query(`SELECT * FROM club WHERE id = ${id}`, (err, res) => {
                if (err) {
                  console.log("error: ", err);
                  result(err, null);
                  return;
                }
            
                if (res.length) {
                  console.log("found club: ", res[0]);
                  result(null, res[0]);
                  return;
                }
            
                // not found Club with the id
                result({ kind: "not_found_club" }, null);
              });
        }
    })
  };

Club.getAll = (title, id, result) => {
    Sport.findById(id, (err) =>
    {
        if (err) {
            if (err.kind === 'not_found_sport') {
               result({kind: "not_found_sport"}, null);
            } else {
                result(err, null);
            }
        }
        else {
            let query = `SELECT * FROM club WHERE sport_id_FK = ${id}`;

            if (title) {
                query == ` WHERE title LIKE '%${title}%'`;
            }
        
            sql.query(query, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                    return;
                }
                console.log("clubs: ", res);
                result(null, res);
            });
        }
    })
};

Club.updateById = (id, sid, club, result) => {
    if (club.sport_id_FK == null) {
        club.sport_id_FK = sid;
    }
    Sport.findById(sid, (err) =>
    {
        if (err) {
            if (err.kind === 'not_found_sport') {
               result({kind: "not_found_sport"}, null);
            } else {
                result(err, null);
            }
        }
        else {
            sql.query(
                "UPDATE club SET name = ?, director = ?, budget = ?, sport_id_FK = ? WHERE id = ?",
                [club.name, club.director, club.budget, club.sport_id_FK, id],
                (err, res) => {
                    if (err) {
                        console.log("error: ", err);
                        result(null, err);
                        return;
                    }
        
                    if (res.affectedRows == 0) {
                        result ({ kind: "not_found_club"}, null);
                        return
                    }
        
                    console.log("updated club: ", {id: id, ...club});
                    result(null, {id: id, ...club});
                }
            );
        }
    })
};

Club.remove = (id, sid, result) => {
    Sport.findById(sid, (err) =>
    {
        if (err) {
            if (err.kind === 'not_found_sport') {
               result({kind: "not_found_sport"}, null);
            } else {
                result(err, null);
            }
        }
    else { sql.query("DELETE FROM club WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found_club"}, null);
            return;
        }

        console.log("deleted club with id: ", id);
        result(null, res);
    });
}
})
};

module.exports = Club;