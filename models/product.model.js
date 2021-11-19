const sql = require("../config/db.config.js");
const Sport = require("./sport.model.js");
const Club = require("./club.model.js");

const Product = function(product) {
    this.name = product.name;
    this.price = product.price
    this.description = product.description
    this.club_id_FK = product.club_id_FK
};

Product.create = (newProduct, sid, cid, result) => {

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
            Club.findById(cid, sid, (err) =>
            {
                if (err) {
                    if (err.kind === 'not_found_club') {
                       result({kind: "not_found_club"}, null);
                    } else {
                        result(err, null);
                    }
                }
            else {
            sql.query("INSERT INTO product SET ?", newProduct, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }
                console.log("created Product: ", {id : res.insertId, ...newProduct});
                result(null, {id : res.insertId, ...newProduct});
            });
        }
    })
}
    })
  };



Product.findById = (id, sid, cid, result) => {

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
            Club.findById(cid, sid, (err) =>
            {
                if (err) {
                    if (err.kind === 'not_found_club') {
                       result({kind: "not_found_club"}, null);
                    } else {
                        result(err, null);
                    }
                }
            else {
            sql.query(`SELECT * FROM product WHERE id = ${id}`, (err, res) => {
                if (err) {
                  console.log("error: ", err);
                  result(err, null);
                  return;
                }
            
                if (res.length) {
                  console.log("found product: ", res[0]);
                  result(null, res[0]);
                  return;
                }
            
                // not found Club with the id
                result({ kind: "not_found_product" }, null);
              });
        }
    })
}
    })
  };

Product.getAll = (title, sid, cid, result) => {
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
            Club.findById(cid, sid, (err) =>
            {
                if (err) {
                    if (err.kind === 'not_found_club') {
                       result({kind: "not_found_club"}, null);
                    } else {
                        result(err, null);
                    }
                }
            else {
            let query = `SELECT * FROM product WHERE club_id_FK = ${cid}`;

            if (title) {
                query == ` WHERE title LIKE '%${title}%'`;
            }
        
            sql.query(query, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                    return;
                }
                console.log("products: ", res);
                result(null, res);
            });
        }
    })
}
    })
  };

Product.updateById = (id, sid, cid, product, result) => {
    if (product.club_id_FK == null) {
        product.club_id_FK = sid;
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
            Club.findById(cid, sid, (err) =>
            {
                if (err) {
                    if (err.kind === 'not_found_club') {
                       result({kind: "not_found_club"}, null);
                    } else {
                        result(err, null);
                    }
                }
            else {
            sql.query(
                "UPDATE product SET name = ?, price= ?, description = ?, club_id_FK = ? WHERE id = ?",
                [product.name, product.price, product.description, product.club_id_FK, id],
                (err, res) => {
                    if (err) {
                        console.log("error: ", err);
                        result(null, err);
                        return;
                    }
        
                    if (res.affectedRows == 0) {
                        result ({ kind: "not_found_product"}, null);
                        return
                    }
        
                    console.log("updated product: ", {id: id, ...product});
                    result(null, {id: id, ...product});
                });
            }
        })
    }
        })
      };

Product.remove = (id, sid, cid, result) => {
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
            Club.findById(cid, sid, (err) =>
            {
                if (err) {
                    if (err.kind === 'not_found_club') {
                       result({kind: "not_found_club"}, null);
                    } else {
                        result(err, null);
                    }
                }
            else { sql.query("DELETE FROM product WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found_product"}, null);
            return;
        }

        console.log("deleted product with id: ", id);
        result(null, res);
    });
}
})
}
})
};

module.exports = Product;