const validator= require('validator');
const db=require('../../db/connection');
const mysql = require("mysql");


module.exports.validation=(req,res,next) => {
    let post_query=`SELECT * FROM ${mysql.escapeId('blog.post')}`;
    var len_out;

    const elements_validation=function(){
        const {title,content,image,category,basic}=req.body;

        if(validator.isEmpty(title) || validator.isEmpty(content)  || validator.isEmpty(category)) return false;
        return true;
    }

    db.query(post_query,(err,result)=>{
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        let len=result.length;
        if(elements_validation()){
            return next();
        }else{
            return res.status(400).render('admin/admin-create',{PageTitlte:'Admin Create New Post',error:'Could not create new post,Check the form again',len:len});
        }
    });

}
   
