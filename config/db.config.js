'use strict';

const mysql = require('mysql');

// const dbConn = mysql.createConnection(
//     {
//         host : 'localhost',
//         user : 'root',
//         password : '',
//         database : 'sportsdb'
//     }
// );

const dbConn = mysql.createConnection(
    {
        host : 'us-cdbr-east-04.cleardb.com',
        user : 'b3ef48ffac1cd6',
        password : '48e4275c',
        database : 'heroku_66f4623ceb2cf7f'
    }
);

dbConn.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected");

});

module.exports = dbConn;
