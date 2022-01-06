require('dotenv').config({ path: '../.env'});
const mysql = require('mysql');

//Create connection ..
const db = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'SimaObono140897',
  port:'3306',
  database : 'blog'  
});


db.connect( (error) => {
    if(error) {
      console.log(error);
    } else {
      console.log("MYSQL Connected...")
    }
});


module.exports = db;