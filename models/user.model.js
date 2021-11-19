const sql = require("../config/db.config.js");

const User = function(user)
{
    this.username = user.username;
    this.email = user.email;
    this.password = user.password
    this.role = user.role
}

User.create = (newUser, result) => {
    sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err. null);
            return;
        }
        console.log("created user: ", {id : res.insertId, ...newUser});
        result(null, {id : res.insertId, ...newUser});
    });
};

User.findById = (id, result) => {
    sql.query(`SELECT * FROM user WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found user: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found user with the id
      result({ kind: "not_found_user" }, null);
    });
  };

  User.findRole = (id, result) => {
    sql.query(`SELECT role FROM user WHERE id = ${id}`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
    
        if (res.length) {
          console.log("found user: ", res[0]);
          result(null, res[0]);
          return;
        }
    
        // not found user with the id
        result({ kind: "not_found_user" }, null);
      });
    };


  User.findByEmail = (email, result) => {
    sql.query(`SELECT * FROM user WHERE email = '${email}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found user: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found user with the email
      result({ kind: "not_found_user" }, null);
    });
  };

  User.findByUsername = (username, result) => {
    sql.query(`SELECT * FROM user WHERE username = '${username}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found user: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found user with the username
      result({ kind: "not_found_user" }, null);
    });
  };

  User.getAll = (title, result) => {
    let query = "SELECT * FROM user";

    if (title) {
        query == ` WHERE title LIKE '%${title}%'`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("users: ", res);
        result(null, res);
    });
};

User.updateById = (id, user, result) => {
    sql.query(
        "UPDATE user SET name = ? WHERE id = ?",
        [user.name, user.email, user.password, user.role, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result ({ kind: "not_found_user"}, null);
                return
            }

            console.log("updated user: ", {id: id, ...user});
            result(null, {id: id, ...user});
        }
    );
};

User.remove = (id, result) => {
    sql.query("DELETE FROM user WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found_user"}, null);
            return;
        }

        console.log("deleted user with id: ", id);
        result(null, res);
    });
};

module.exports = User;