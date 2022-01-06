const db=require('../../db/connection');
const mysql=require('mysql');
const DB=require('../../db/dbmodel');
const validator= require('validator');
let DBModel=new DB(db);


// //Viewing a specific post ...
module.exports.view_post=async (req,res) =>{
    let post,latest,same_category,comments;
    try {
        post=await DBModel.getPostById(req.params.id);
        latest=await DBModel.GetlatestPosts();
        comments=await DBModel.getComments(req.params.id);
    } catch (error) {
        console.log(error);
        throw error;
    }finally{
        same_category=await DBModel.getCategory(req.params.id);
        let comments_len=await comments.length;
        return res.render('post/post-page',{post:post[0],same_category:same_category,latest:latest,PageTitle:post[0].title,user:req.user,comments:comments,len:comments_len});
    }        
}


//Commenting on a specific post ...
module.exports.comment=async (req,res)=>{
    let post,latest,same_category,category,comments,comments_len;

    try {
        post=await DBModel.getPostById(req.params.id);
        same_category=await DBModel.getCategory(req.params.id);
        latest=await DBModel.GetlatestPosts();
        comments=await DBModel.getComments(req.params.id);
    } catch (error) {
        console.log(error);
        throw error;
    }finally{
        if(req.user && !validator.isEmpty(req.body.content)){
            try{
                const content =req.body.content;
                let commenting=await DBModel.comment(content,req.user.username,req.params.id);
            }catch(error){
                console.log(error);
                throw error;
            }finally{
                return res.redirect('/post/'+req.params.id);
            }
        }else if(req.user && validator.isEmpty(req.body.content)){
            return res.render('post/post-page',{post:post[0],same_category:same_category,latest:latest,PageTitle:post[0].title,error:'Field cannot be empty',user:req.user,comments:comments,len:comments_len});
        }else if(!req.user){
            return res.render('post/post-page',{post:post[0],same_category:same_category,latest:latest,PageTitle:post[0].title,error:'User must be logged in to comment',comments:comments,len:comments_len});
        }
    }    
}

//Search for a specific post ...
module.exports.search = (req,res) => {
    //Page title 
    const PageTitle='Jeremias Obiang';
    //How many posts we want to show on each page
    const resultsPerPage = 6;

    (async function() {
    
        try {
            let allPosts = await DBModel.getPosts();

            if(allPosts.length<=0) return res.render('home/home-page',{PageTitle});

            const numOfResults = allPosts.length;

            const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
            let page = req.query.page ? Number(req.query.page) : 1;
            len=allPosts.length;
            
            if(page > numberOfPages){
                return res.redirect('home/home-page/?page='+encodeURIComponent(numberOfPages));
            }else if(page < 1){
                return res.redirect('home/home-page/?page='+encodeURIComponent('1'));
            }
    
            //Determine the SQL LIMIT starting number
            const startingLimit = (page - 1) * resultsPerPage;
     
            //Get the relevant number of POSTS for this starting page
            let search=req.body.search;
            let sql = `SELECT * FROM  ${mysql.escapeId('blog.post')} WHERE title like ? OR category like ? OR content like ? LIMIT ${startingLimit},${resultsPerPage}`;
            let arr=['%'+search+'%','%'+search+'%','%'+search+'%'];
            let limitedPosts= await DBModel.doQueryParams(sql,arr);
            
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);

            if(endingLink < (page + 4)){
                iterator -= (page + 4) - numberOfPages;
            }
            if(iterator<1)iterator=1;
           
            return res.render('home/home-page', {data: limitedPosts, page, iterator, endingLink, numberOfPages,PageTitle,user:req.user,nav:"home"});
            
        } catch (error) {
            throw error;
        }

    })();
}
