var express = require('express')
var router =new express.Router();
const post_tools=require('../tools/posts/post_tools');
const auth = require('../../src/middlewares/auth/isLoggedIn');


//Viewing a single post 
router.get('/post/:id',auth.isLoggedIn,post_tools.view_post);

//Comment on a post 
router.post('/post/:id',auth.isLoggedIn,post_tools.comment);

//Search for a post 
router.post('/search',auth.isLoggedIn,post_tools.search);


module.exports = router;
