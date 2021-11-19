const sql = require("../config/db.config.js");

const Sport = function(sport) {
    this.name = sport.name;
};

Sport.create = (newSport, result) => {
    sql.query("INSERT INTO sport SET ?", newSport, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created sport: ", {id : res.insertId, ...newSport});
       result(null, {id : res.insertId, ...newSport});
    });
};

Sport.findById = (id, result) => {
    sql.query(`SELECT * FROM sport WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found sport: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Sport with the id
      result({ kind: "not_found_sport" }, null);
    });
  };

Sport.getAll = (title, result) => {
    let query = "SELECT * FROM sport";

    if (title) {
        query == ` WHERE title LIKE '%${title}%'`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("sports: ", res);
        result(null, res);
    });
};

Sport.updateById = (id, sport, result) => {
    sql.query(
        "UPDATE sport SET name = ? WHERE id = ?",
        [sport.name, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result ({ kind: "not_found_sport"}, null);
                return
            }

            console.log("updated sport: ", {id: id, ...sport});
            result(null, {id: id, ...sport});
        }
    );
};

Sport.remove = (id, result) => {
    sql.query("DELETE FROM sport WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found_sport"}, null);
            return;
        }

        console.log("deleted sport with id: ", id);
        result(null, res);
    });
};

module.exports = Sport;