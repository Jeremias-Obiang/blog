const db=require('../../db/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require("mysql");
const DB=require('../../db/dbmodel');

let DBModel=new DB(db);
let len;


//(Post)Admin Login Page ...
module.exports.post_login= async (req,res)=>{

    const {email,password}=req.body;
    
    let email_query=`SELECT * FROM ${mysql.escapeId('blog.admin')} WHERE email=${db.escape(email)};`;

    try {
        let results= await DBModel.doQuery(email_query);

        //Checking if password or email is incorrect ...
        if (!results || !(await bcrypt.compare(password, results[0].password))) {
            res.status(401).send({ error: "Email or Password is incorrect" });
        } else {

            const id = results[0].id;
        
            var JWT_SECRET_TOKEN='f0b44d5d4e277ba030b7a6999be808c9cfa4befe0a92fd8fb7515a0124a9b9b91a07549d8f29ae9fe9d86b8805292d73445172116f3aef5d5a8f13c93e426446';
            var JWT_EXPIRES_IN = '90d';
            const token=jwt.sign({ id }, JWT_SECRET_TOKEN,{
                expiresIn: JWT_EXPIRES_IN
            });
            
            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.cookie('jwt', token, cookieOptions );
            // res.render('./admin/admin-home',{PageTitle:"Admin Home",action:"view"});

            return res.redirect('/admin/?page=1&table=post');
        }
    } catch (error) {
        throw error;
    }
   
}

//(Get) Admin Login Page ...
module.exports.get_login=(req,res)=>{
    return res.render('login/login',{PageTitle:'Admin Login'});
}
    
//Admin Home Page ....
module.exports.home = (req,res) => {
    //Page title 
    const PageTitle='Admin Home';
    //How many posts we want to show on each page
    const resultsPerPage = 6;

    (async function() {
    
        try {
            let allPosts = await DBModel.getPosts();
                
            if(allPosts.length<=0) return res.render('./admin/admin-home',{PageTitle});

            const numOfResults = allPosts.length;

            const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
            let page = req.query.page ? Number(req.query.page) : 1;
            len=allPosts.length;
            

            if(page > numberOfPages){
                return res.redirect('/admin/?page='+encodeURIComponent(numberOfPages));
            }else if(page < 1){
                return res.redirect('/admin/?page='+encodeURIComponent('1'));
            }
    
            //Determine the SQL LIMIT starting number
            const startingLimit = (page - 1) * resultsPerPage;
     
            //Get the relevant number of POSTS for this starting page
            sql = `SELECT * FROM  ${mysql.escapeId('blog.post')} LIMIT ${startingLimit},${resultsPerPage}`;

            let limitedPosts= await DBModel.doQuery(sql);

            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);

            if(endingLink < (page + 4)){
                iterator -= (page + 4) - numberOfPages;
            }
            if(iterator<1)iterator=1;

            return res.render('./admin/admin-home', {data: limitedPosts, page, iterator, endingLink, numberOfPages,PageTitle,len});
                
        } catch (error) {
            throw error;
        }

    })();
}

//(GET) Create new post page ...
module.exports.create_post_page=(req,res)=>{
    return res.render('admin/admin-create',{PageTitle:'Admin Create New Post',len:len});
}

//(POST) Submit new post data ....
module.exports.create_post=async (req,res)=>{

    if(req.body && req.img_name){
        try {
            const {title,content,image,category}=req.body;
            //Here we extract all the post information needed ....
            await create_post(req,res,req.body);
            return res.status(200).render('admin/admin-create',{PageTitle:'Admin Create New Post',success:'Post Was Successfully Created',len:len});

        } catch (error) {
            console.log(error);
        }
    }
}

//(GET) View post data ...
module.exports.view_post= (req,res)=>{
    
    let DBModel= new DB(db);
    let response;

    (async function() {
        try {
            let post= await DBModel.getPostById([req.params.id]);
            response=await post[0];

        } catch (error) {
            throw error;
        }finally{
            let date=response.created_at.toString().slice(0,16);
            return res.status(200).render('./admin/admin-view',{PageTitle:'View Post',len:len,post:response,date:date});
        }
    })();
}


//(GET) Update specific post ....
module.exports.edit_post_page=(req,res)=>{
    let post_id=req.params.id; 
    return res.status(200).render('./admin/admin-edit',{id:post_id});
}
        
//(POST) Update new post information ...
module.exports.edit_post=(req,res)=>{
    let id=req.params.id;
    const {title,content,sampleFile,category,basic}=req.body;

    (async function() {
        try {
            let result=await DBModel.updatePost(req,req.body,id);
            DBModel.updateTags(req.body,id);
            // console.log('update tags response',response);
            
        } catch (error) {
            throw error;
        }finally{
            // console.log(basic);
            return res.redirect('/admin');
        }
    })();
    (async function(){

    })();

}
    



//Delete specific post ...
module.exports.delete=async (req,res)=>{
    const id=req.params.id;
    DBModel.deletePostById(id);
    return res.redirect('/admin');
}
    
//Search specific post ...
module.exports.search = (req,res) => {
    //Page title 
    const PageTitle='Admin Home';
    //How many posts we want to show on each page
    const resultsPerPage = 6;

    //Search value
    const search=req.body.search;

    (async function() {
        try {
            let allPosts = await DBModel.getPosts();
                
            if(allPosts.length<=0) return res.render('admin/admin-home',{PageTitle});

            const numOfResults = allPosts.length;

            const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
            let page = req.query.page ? Number(req.query.page) : 1;
            len=allPosts.length;
            

            if(page > numberOfPages){
                return res.redirect('/admin/?page='+encodeURIComponent(numberOfPages));
            }else if(page < 1){
                return res.redirect('/admin/?page='+encodeURIComponent('1'));
            }
    
            //Determine the SQL LIMIT starting number
            const startingLimit = (page - 1) * resultsPerPage;
     
            //Get the relevant number of POSTS for this starting page
            sql = `SELECT * FROM  ${mysql.escapeId('blog.post')} WHERE title like ? OR category like ? OR content like ? LIMIT ${startingLimit},${resultsPerPage}`;
            let arr=['%'+search+'%','%'+search+'%','%'+search+'%'];
            let limitedPosts= await DBModel.doQueryParams(sql,arr);

            if(limitedPosts.length<=0) return res.render('admin/admin-home',{PageTitle:PageTitle,message:'No result found'});

            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);

            if(endingLink < (page + 4)){
                iterator -= (page + 4) - numberOfPages;
            }
            if(iterator<1)iterator=1;

            return res.render('admin/admin-home', {data: limitedPosts, page, iterator, endingLink, numberOfPages,PageTitle,len,search:search});
                
        } catch (error) {
            throw error;
        }

    })();
}



//Logout admin ...
exports.logout = async (req, res) => {
    res.cookie('jwt','',{maxAge:1});
    res.status(200).redirect('/admin');
}
    
   
const create_post=function(req,res,body){

    const {title,content,image,category,basic}=body;

    _query = `INSERT INTO ${mysql.escapeId('blog.post')} SET title=${db.escape(title)},content=${db.escape(content)},image=${db.escape(req.img_name)},category=${db.escape(category)};`

    db.query(_query,(err, results) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
       
        req.insert_id=results.insertId;
    });
}

