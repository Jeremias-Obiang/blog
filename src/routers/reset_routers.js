var express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require("mysql");
const nodemailer=require('nodemailer');
const validator=require('validator');
const { promisify } = require('util');
const passwordValidator = require('password-validator');


// Create a schema
var schema = new passwordValidator();


// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(72)                                  // Maximum length 72
.has().not().spaces()                           // Should not have spaces



const db=require('../db/connection');
const DB=require('../db/dbmodel');

let DBModel=new DB(db);
var router =new express.Router();



const fields_validation=(req,res,next) => {
    if(fields_validation_function(req.body)!=true){
        var message=fields_validation_function(req.body);
        res.status(404);
        res.render('reset-password/new_password',{error:message,PageTitle:"Reset Password"});
    }else{
        next();
    }
}


const fields_validation_function = function(data){
    //Getting all the data from form , destructuring data object ...
    const {password,confirmedpassword} = data;
    
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





router.get('/forgot-password',(req,res)=>{
    return res.render('reset-password/reset',{PageTitle:'Reset Password'});
});



router.post('/forgot-password',async (req,res)=>{
    const {email}=req.body;
    try {
        //Check if user exists in the database ...
        let query=`SELECT * FROM ${mysql.escapeId('blog.user')} WHERE email=?`;
        let result=await DBModel.doQueryParams(query,[email]);
        let user=await result[0];
        
        if(result.length<1){
            return res.render('reset-password/reset',{PageTitle:'Reset Password',error:'Something wrong happened, please try again'});
        }

        //After validating the existance of the user we generate a secret token ...
        const secret=process.env.JWT_SECRET;
        const payload={
            email:user.email,
            id:user.id
        }

        const token=jwt.sign(payload,secret,{expiresIn:'10m'});
      
        //Send link to the user's email ...
        const link=`http://localhost:3000/reset-password/${user.id}/${token}`;

        let message=`<h1>Jeremias Obiang BLOG || Password Assistance</h1>
        <p>To authenticate, please use the following one time link</p>
        <a>${link}</a>
        <br>
        <p>Don't share this link with anyone.</p>
        <p>Hope to see you again.</p>`;

        console.log(link);
        main(user,message).catch(err=>{
            console.log(err.message);
            process.exit(1);
        });

        return res.render('reset-password/reset',{PageTitle:'Reset Password',success:'A reset link was sent to your email'});
    } catch (error) {
        
    }
});

router.get('/reset-password/:id/:token',async (req,res)=>{

    const {id,token}=req.params;
    

    //Check if id exists in the database
    const query=`SELECT * FROM ${mysql.escapeId('blog.user')} WHERE id=?`
    const result=await DBModel.doQueryParams(query,[id]);
    const user=await result[0];

    if(result.length<1){
        return res.send('Invalid id');
    }

    const secret=process.env.JWT_SECRET;

    try {
        const payload=jwt.verify(token,secret);
        return res.render('reset-password/new_password',{PageTitle:'Reset Password',user:user});
    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
});


router.post('/reset-password/:id/:token',fields_validation,async (req,res)=>{

    try {

        const {id,token}=req.params;
        const {password,confirmedpassword}=req.body;
        
        //1) verify the token
        const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
        const decoded_token=JSON.parse(JSON.stringify(decoded));
  
        // 2) Check if the user  exists in the database ....
        let query=`SELECT * FROM ${mysql.escapeId('blog.user')} WHERE id=${db.escape(decoded_token.id)};`;
        let result=await DBModel.doQuery(query);
        console.log(result);

        if(result.length<1){
            return res.send('Invalid id');
        }

        //3) Update password ...
        let updatePassword=await DBModel.updatePassword(confirmedpassword,id);
        console.log(updatePassword);
        return res.render('reset-password/new_password',{PageTitle:'Reset Password',success:'Password was reset successfully'});   
        
    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
})



async function main(user,message){
    let transporter=nodemailer.createTransport(
        {
            service:'hotmail',
            auth:{
                user:process.env.EMAIL,
                pass:process.env.EMAIL_PASSWORD
            }
        }
    );

    let final_message={
        //Comma separated list of recipients ...
        to:`${user.username} <${user.email}>`,
        subject:'Jeremias Obiang BLOG || Password Assistance',
        html:message
    }

    let info= await transporter.sendMail(final_message);
    console.log('Message was sent successfully');
}
 

module.exports=router;