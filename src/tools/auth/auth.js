require('dotenv').config()
const db=require('../../db/connection');
const bcrypt = require('bcryptjs');
const mysql = require("mysql");
const jwt = require('jsonwebtoken');


exports.login = async (req, res) => {
  try {
    
    const { email, password }=req.body;

    let email_query=`SELECT * FROM ${mysql.escapeId('blog.user')} WHERE email=${db.escape(email)};`;

    db.query(email_query, async (error, results) => {

      if(error){
        res.end();
        return console.log(err);
      }
    
      if(results.length<1 || !(await bcrypt.compare(password, results[0].user_password)) ) {
        res.status(401).render('login/login', {error: 'There was a problem logging in. Check your email and password or create an account.',PageTitle:"Login"});
      }
      
      else {
        
        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        }
        
        const token=generateAccessToken(results[0].id);

        res.cookie('jwt', token, cookieOptions );
        return res.status(200).redirect("/");
      }
    });

  } catch (error) {
    console.log(error);
  }
}

exports.login_page=  (req, res) => {
  return res.render('login/login',{PageTitle:'Login'});
}


exports.register_page=(req,res) =>{
  return res.render('login/signup',{PageTitle:'Register'});
}
  
exports.register =async (req, res) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;
    let hashedPassword = await bcrypt.hash(password, 8);
    let default_img='default_img.jpg';
    let _query;
   
  
    if(req.img_name){
      _query = `INSERT INTO ${mysql.escapeId('blog.user')} SET username=${db.escape(username)},email=${db.escape(email)},user_password=${db.escape(hashedPassword)},image=${db.escape(req.img_name)};`
    }else{
      _query = `INSERT INTO ${mysql.escapeId('blog.user')} SET username=${db.escape(username)},email=${db.escape(email)},user_password=${db.escape(hashedPassword)},image=${db.escape(default_img)};`;
    }

    db.query(_query,(err,result) => {
      if(err){
        console.log(err);
        res.status(500);
        return; 
      }
      return res.render('login/signup',{success:'User was created successfully',PageTitle:'Register'});
    });
    
  } catch (error) {
    console.log(error);
  }
      
};

exports.logout = async (req, res) => {
  res.cookie('jwt','',{maxAge:1});
  res.status(200).redirect('/');
}

//Generate token
function generateAccessToken(user_id) {
  return  jwt.sign({ user_id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
}





      
  


      
      


                
                
                


  