var express = require('express')
var router =new express.Router();
const admin_tools=require('../tools/admin/admin_tools');
const middleware=require('../middlewares/admin/login_form_validation');
const auth_middleware = require('../../src/middlewares/auth/isLoggedIn');
const middleware2=require('../../src/middlewares/admin/auth');
const image=require('../../src/middlewares/auth/image');
const create_post_middleware=require('../../src/middlewares/admin/create_post_validation');
const db=require('../../src/db/connection');
const DB=require('../../src/db/dbmodel');
const mysql=require('mysql');




//rendering admin login page ...
router.get('/admin_login',auth_middleware.isLoggedIn,middleware2.middle_login,admin_tools.get_login);
router.post('/admin_login',middleware.field_validation,admin_tools.post_login);


//Rendering admin home page ...
router.get('/admin',auth_middleware.isLoggedIn,middleware2.middle_home,admin_tools.home);


//(POST) Search post ...
router.post('/admin/search',admin_tools.search);

//View page that creates new post ...
router.get('/admin/create',auth_middleware.isLoggedIn,middleware2.middle_home,admin_tools.create_post_page);

//Upload new post data ....
router.post('/admin/create',create_post_middleware.validation,image.register,admin_tools.create_post);

//Viewing a specific post ...
router.get('/admin/view/:id',admin_tools.view_post);


//(GET) JSON data of a specific post ....
router.get('/admin/json/:id',(req,res)=>{
    let post_id=req.params.id; 
    let post_data,post_tags;

    let DBModel= new DB(db);

    (async function() {
        try {
            let post= await DBModel.getPostById([post_id]);
            post_data=post[0];            
        } catch (error) {
            throw error;
        }finally{
            return res.status(200).send({post_data});
        }
    })();
 
});

//(GET) Editing a specific post ...
router.get('/admin/edit/:id',admin_tools.edit_post_page);

//(POST) Post new post data ...
router.post('/admin/edit/:id',image.register,admin_tools.edit_post);

//(GET) Delete Post by his id ...
router.get('/admin/delete/:id',admin_tools.delete);

//Logout admin ...
router.get('/admin_logout',admin_tools.logout);

module.exports=router;