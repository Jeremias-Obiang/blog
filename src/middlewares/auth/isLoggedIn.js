require('dotenv').config()
const db=require('../../db/connection');
const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const { promisify } = require('util');




exports.isLoggedIn = async (req, res, next) => {
  // console.log(req.cookies);
  if( req.cookies.jwt) {
    try {
      //1) verify the token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
      const decoded_token=JSON.parse(JSON.stringify(decoded));
      
      // 2) Check if the user still exists
      let user_query=`SELECT * FROM ${mysql.escapeId('blog.user')} WHERE id=${db.escape(decoded_token.user_id)};`;
    
      db.query(user_query, (error, result) => {      
        if(!result) {
          return next();
        }
        req.user = result[0];
        return next();
      });

    }catch (error) {
      console.log(error);
      return next();
    }
  } else {
    next();
  }
}


