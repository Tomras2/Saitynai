const config = require("../config/auth.config");
const { v4 : uuidv4 } = require("uuid");
const sql = require("../config/db.config.js");

const RefreshToken = function(refreshToken)
{
    this.token = refreshToken.token
    this.expiryDate = refreshToken.expiryDate
    this.user_id_FK = refreshToken.user_id_FK
}

RefreshToken.createToken =  function(user, result) {
    let expiredAt = new Date();

    expiredAt.setSeconds(expiredAt.getSeconds() + process.env.jwtRefreshExpiration);

    console.log(process.env.jwtRefreshExpiration);

    let tok = uuidv4();

    let refreshToken = ({
        token: tok,
        user_id_FK: user.id,
        expiryDate: expiredAt,
    });

    console.log("expiryDate " + expiredAt)

    sql.query("Insert INTO refreshToken SET ?", refreshToken, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
    })

    return refreshToken.token;
};

RefreshToken.verifyExpiration = (token) => {
    console.log("token time" + token.expiryDate.getTime())
    console.log("Date time " + Date().getTime())
    return token.expiryDate.getTime < new Date().getTime();
}

RefreshToken.findByToken= (token, result) => {
    console.log("token is " + token)
    sql.query(`SELECT * FROM refreshtoken WHERE token = '${token}'`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
    
        if (res.length) {
          console.log("found refreshToken: ", res[0]);
          result(null, res[0]);
          return;
        }
    
        // not found user with the id
        result({ kind: "not_found_token" }, null);
      });
};

RefreshToken.Remove = (id, result) => {
    sql.query("DELETE FROM refreshToken WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found_token"}, null);
            return;
        }

        console.log("deleted refreshToken with id: ", id);
        result(null, res);
    });
};

RefreshToken.getUser = (id, result) => {
    sql.query("SELECT from users where id = ? ", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found_user"}, null);
            return;
        }

        console.log("Found user with id: ", id);
        result(null, res);
    });
}



module.exports = RefreshToken;