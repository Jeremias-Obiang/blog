const validator= require('validator');
var email_validator = require("email-validator");

module.exports.field_validation=function(req, res, next){


    const field_validation_function=function(){
        //Destructuring our request body ...
        const {email,password}=req.body;
            
        //1.Checking for empty fields ...
        if(validator.isEmpty(email) && validator.isEmpty(password)){
            return 'Empty fields not allowed';
        }else if(validator.isEmail(email)===false){
            return 'Please provide a valid email';
        }
        else if(validator.isEmpty(email)){
            return 'Please provide a valid email';
        }
        else if(validator.isEmpty(password)){
            return 'Please provide a password';
        }else{
            return true;
        }
    }
    
    if(field_validation_function()!=true){
        var message=field_validation_function();
        res.render('login/login',{error:message,PageTitle:"Login"});
    }else{
        next();
    }
}

 


