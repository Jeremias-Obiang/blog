require('dotenv').config({ path: '../.env'});
const mysql = require('mysql');

//Create connection ..
const db = mysql.createConnection({
  host     : process.env.DATABASE_HOST,
  user     : process.env.DATABASE_ROOT,
  password : process.env.DATABASE_PASSWORD,
  port:process.env.DATABASE_PORT,
  database : process.env.DATABASE  
});


db.connect( (error) => {
    if(error) {
      console.log(error);
    } else {
      console.log("MYSQL Connected...")
    }
});


module.exports = db;