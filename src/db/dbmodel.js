// dbmodel.js
'use strict';
const mysql=require('mysql');
const db = require('./connection');


module.exports=class DB {
    constructor(db) {
        this.db = db;
    }

    async getPosts() {
        let query=`SELECT * FROM ${mysql.escapeId('blog.post')}`;
        return await this.doQuery(query);
    }

    async getPostById(array) {
        let query=`SELECT * FROM ${mysql.escapeId('blog.post')} WHERE id = ?`;
        return this.doQueryParams(query, array);
    }

    async updatePost(req,body,id){
        //data to update ...
        const {title,content,sampleFile,category,basic}=body;

        //sql query for post 
        let sql=`UPDATE ${mysql.escapeId('blog.post')} SET title = ?, content = ?, image = ?, category = ? WHERE id =?;`;
        let arr=[title,content,req.img_name,category,id];

        //Execute query ...
        return this.doQueryParams(sql, arr);
    }
 

    async deletePostById(id){
        let query=`SET foreign_key_checks = 0`;
        try {
            await this.doQuery(query);
            let query1=`DELETE FROM ${mysql.escapeId('blog.post')} WHERE id=${mysql.escape(id)}`;
            await this.doQuery(query1);
        } catch (error) {
            console.log(error);
            throw error;
        }finally{
            query=`SET foreign_key_checks = 1`;
        }
    }

    //Get the latest posts ....
    async GetlatestPosts(){
        let query=`SELECT * FROM ${mysql.escapeId('blog.post')} ORDER BY created_at DESC LIMIT 3`;
        return await this.doQuery(query);
    }

    //Get posts from the same category ...
    async getCategory(id){
        let response,data;
        try {
            response= await this.getPostById(id);
            data=await response[0];
            // console.log('Hello this is my category data: ',response[0]);
        } catch (error) {
            throw error;
        }finally{
            let category = await data.category;
            // console.log('Hello this is my category data: ',category);
            let query=`SELECT * FROM ${mysql.escapeId('blog.post')} WHERE category = ${mysql.escape(category)} AND id NOT IN (${mysql.escape(id)})`;
            return await this.doQuery(query);
        }
    }


    //Comment on a post ...
    async comment(text,username,post_id){
        // INSERT INTO `comments` (`content`, `username`, `post_id`) VALUES ('Nice post', 'jeremi', '8');

        // let query=`INSERT INTO ${mysql.escapeId('blog.comments')} ('content','username','post_id') VALUES (${text},${username},${post_id})`;
        let _query = `INSERT INTO ${mysql.escapeId('blog.comments')} SET content=${db.escape(text)},username=${db.escape(username)},post_id=${db.escape(post_id)};`

        return await this.doQuery(_query);
    }

    
    async getComments(id){
        let query=`SELECT * FROM ${mysql.escapeId('blog.comments')} WHERE post_id = ?`;
        return await this.doQueryParams(query,[id]);
    }

    async updatePassword(password,user_id){
        let sql=`UPDATE ${mysql.escapeId('blog.user')} SET user_password = ? where id=?`;
        return await this.doQueryParams(sql,[password,user_id]);
    }


    // CORE FUNCTIONS DON'T TOUCH
    async doQuery(queryToDo) {
        let pro = new Promise((resolve,reject) => {
            let query = queryToDo;
            this.db.query(query, function (err, result) {
                if (err) throw err; // ERRORS HANDLING ...
                resolve(result);
            });
        });

        return pro.then((val) => {
            return val;
        });
    }
    
    async doQueryParams(queryToDo, array) {
      let pro = new Promise((resolve,reject) => {
        let query = queryToDo;
        this.db.query(query, array, function (err, result) {
            if (err) throw err; // ERRORS HANDLING
            resolve(result);
        });
      });

      return pro.then((val) => {
        return val;
      });
    }
      
}

