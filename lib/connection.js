const mysql = require("mysql")

var connection = mysql.createConnection({
    host: "aap365lhmsfrjh.czloxg7zlvxd.eu-west-1.rds.amazonaws.com",
    user: "electronjs",
    password: "123456789",
    database: "ebdb"
})

connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
  
    console.log('Connected to database.');
  });

module.exports = {
    db: connection
}
