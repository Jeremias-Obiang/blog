const db=require('../../db/connection');
const mysql=require('mysql');
const DB=require('../../db/dbmodel');
const validator= require('validator');
let DBModel=new DB(db);
let len;
const https=require('https');

module.exports.home = (req,res) => {
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
            sql = `SELECT * FROM  ${mysql.escapeId('blog.post')} LIMIT ${startingLimit},${resultsPerPage}`;

            let limitedPosts= await DBModel.doQuery(sql);
    
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);

            if(endingLink < (page + 4)){
                iterator -= (page + 4) - numberOfPages;
            }
            if(iterator<1)iterator=1;

            return res.render('home/home-page', {data: limitedPosts, page, iterator, endingLink, numberOfPages,PageTitle,len,user:req.user,nav:"home"});
                
        } catch (error) {
            throw error;
        }

    })();
}

module.exports.suscribe=(req,res,next)=>{
    //Page title 
    const PageTitle='Jeremias Obiang';
    //How many posts we want to show on each page
    const resultsPerPage = 6;

    (async function() {
        try {
            const {firstName,lastName,email} = req.body;
            
            
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
            sql = `SELECT * FROM  ${mysql.escapeId('blog.post')} LIMIT ${startingLimit},${resultsPerPage}`;

            let limitedPosts= await DBModel.doQuery(sql);

            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);

            if(endingLink < (page + 4)){
                iterator -= (page + 4) - numberOfPages;
            }
            if(iterator<1)iterator=1;

            const data=JSON.stringify({
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            });
                
            const api_key=process.env.SUSCRIBE_API_KEY;
            const options={
                method:'POST', //Post method , sending data to a web server
                auth:`jeremias:${api_key}` // API authentification
            }
        
            const list_id=process.env.LIST_ID;
            const url=`https://us1.api.mailchimp.com/3.0/lists/${list_id}/members`;
        
            const request=https.request(url,options,response=>{
                //If the request is made correctly and everything was successfully sent then the statusCode will be 200 
                //Allows us to see the post response data sent back by the server
        
                if(response.statusCode===200){
                    return res.render('home/home-page', {data: limitedPosts, page, iterator, endingLink, numberOfPages,PageTitle,len,user:req.user,nav:"home",success:'You have successfully suscribed to my newsletter'});
                }else{
                    return res.render('home/home-page', {data: limitedPosts, page, iterator, endingLink, numberOfPages,PageTitle,len,user:req.user,nav:"home",error:'Something went wrong, please try again.'});
                }
            })
                 
            //Catching any error during the post request 
            request.on('error',error=>{
                console.error('Something wrong happened: '+error);
            });
        
            //Sending our data to the web server 
            request.write(data);
        
            //We and our https request 
            request.end();
        } catch (error) {
            throw error;
        }
    })();
}

