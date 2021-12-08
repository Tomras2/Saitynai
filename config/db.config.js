"use strict";

const mysql = require("mysql");

// const dbConn = mysql.createPool(
//     {
//         host : 'localhost',
//         user : 'root',
//         password : '',
//         database : 'sportsdb',
//         connectionLimit : 10
//     }
// );

var connectionState = false;
var connection = mysql.createConnection({
  host: "us-cdbr-east-04.cleardb.com",
  user: "b3ef48ffac1cd6",
  password:"48e4275c",
  database: "heroku_66f4623ceb2cf7f",
  insecureAuth: true
});
connection.on('close', function (err) {
  logger.error('mysqldb conn close');
  connectionState = false;
});
connection.on('error', function (err) {
  logger.error('mysqldb error: ' + err);
  connectionState = false;
});

function attemptConnection(connection) {
  if(!connectionState){
    connection = mysql.createConnection(connection.config);
    connection.connect(function (err) {
      // connected! (unless `err` is set)
      if (err) {
        logger.error('mysql db unable to connect: ' + err);
        connectionState = false;
      } else {
        logger.info('mysql connect!');

        connectionState = true;
      }
    });
    connection.on('close', function (err) {
      logger.error('mysqldb conn close');
      connectionState = false;
    });
    connection.on('error', function (err) {
      logger.error('mysqldb error: ' + err);

      if (!err.fatal) {
        //throw err;
      }
      if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
        //throw err;
      } else {
        connectionState = false;
      }

    });
  }
}
attemptConnection(connection);

var dbConnChecker = setInterval(function(){
  if(!connectionState){
    logger.info('not connected, attempting reconnect');
    attemptConnection(connection);
  }
}, 2000);

// Mysql query wrapper. Gives us timeout and db conn refreshal! 
var queryTimeout = 2000;
var query = function(sql,params,callback){
  if(connectionState) {
    // 1. Set timeout
    var timedOut = false;
    var timeout = setTimeout(function () {
      timedOut = true;
      callback('MySQL timeout', null);
    }, queryTimeout);

    // 2. Make query
    connection.query(sql, params, function (err, rows) {
      clearTimeout(timeout);
      if(!timedOut) callback(err,rows);
    });
  } else {
    // 3. Fail if no mysql conn (obviously)
    callback('MySQL not connected', null);
  }
}

// dbConn.connect(function(err) {
//     if (err) throw err;
//     console.log("Database Connected");

// });

module.exports = dbConn;
