var express = require('express')
var router =new express.Router();
const user_tools=require('../tools/user/user');
const auth = require('../../src/middlewares/auth/isLoggedIn');

router.get('/profile/:id',auth.isLoggedIn,user_tools.view_user);
router.post('/profile/:id',auth.isLoggedIn,user_tools.update_password);

module.exports=router;
