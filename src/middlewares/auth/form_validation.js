// require('dotenv').config({ path: '../../../.env'});
const mysql = require("mysql");
const db=require('../../db/connection');
const validator= require('validator');
const passwordValidator = require('password-validator');



// Create a schema
var schema = new passwordValidator();


// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(72)                                  // Maximum length 72
.has().not().spaces()                           // Should not have spaces


module.exports.fields_validation=(req,res,next) => {
    
    if(fields_validation_function(req.body)!=true){
        var message=fields_validation_function(req.body);
        res.status(404);
        res.render('login/signup',{error:message,PageTitle:"User Registration"});
        // res.status(404).send(message);
    }else{
        next();
    }
}

module.exports.check_username_duplicate=(req,res,next)=>{

    const { username, email, password, confirmedpassword } = req.body;
    let username_query = `SELECT username  FROM ${mysql.escapeId('blog.user')} WHERE username =`+db.escape(username);

    db.query(username_query, async (error, results) => {
    
        if(error) {
            console.log(error);
            res.status(500);
            return;
        }
        
        if( results.length > 0 ) {
            // res.status(403).send('Username  already exists');
            res.status(403);
            res.render('login/signup',{error:'Username already exists',PageTitle:"User Registration"});

        }else{
            next();
        }

    });
}


module.exports.check_email_duplicate=(req,res,next)=>{

    const { username, email, password, confirmedpassword } = req.body;

    let email_query = `SELECT email  FROM ${mysql.escapeId('blog.user')} WHERE email =`+db.escape(email);


    db.query(email_query,  (error, results) => {
    
        if(error) {
            console.log(error);
            res.status(500);
            return;
        }
        
        if( results.length > 0 ) {
            res.status(403);
            // res.status(403).send('Email already exists');
            res.render('login/signup',{error:'Email already exists',PageTitle:"User Registration"});
        }else{
            next();
        }
    });
}


const fields_validation_function = function(data){
    //Getting all the data from form , destructuring data object ...
    const {username,email,password,confirmedpassword} = data;
    
    
    //Validating form data before checking for duplicate values ...

    //1.Checking for empty fields ...
    if(validator.isEmpty(username) || validator.isEmpty(email) || validator.isEmpty(password) || validator.isEmpty(confirmedpassword)){
        // message.client='Empty fields not allowed';

        return 'Empty fields not allowed';
    }



    //2.Checking if email is valid email format ...
    if(!validator.isEmail(email)){
        // message.client='Email is not valid';
        return 'Email is not valid';
    }

    //3.Password validation  ...

    //3.A:Checking if password passes our schema options
    if(!schema.validate(password)){
        // message.client='Invalid password';
        return 'Invalid password';
    }




    //3.B:Checking if password contains or is equal to password ...
    if(validator.contains(password.toLowerCase(),"password") || validator.equals(password.toLowerCase(),"password")){
        // message.client='Invalid password';
        return 'Invalid password';
    }

    //3.C:Checking if passwords are matching ...
    if(password!=confirmedpassword){
        // message.client='Passwords not matching';
        return 'Passwords are not matching';
    }
    return true;
}
        
    