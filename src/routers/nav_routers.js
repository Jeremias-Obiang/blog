var express = require('express')
var router =new express.Router();
var auth=require('../../src/middlewares/auth/isLoggedIn');


router.get('/about',auth.isLoggedIn,(req,res)=>{
  return res.render('about/about',{PageTitle: 'About',nav:'about',user:req.user});
});
  

router.get('/contact',auth.isLoggedIn,(req,res)=>{
  return res.render('contact/contact',{PageTitle: 'Contact',nav:'contact',user:req.user});
});

module.exports=router;