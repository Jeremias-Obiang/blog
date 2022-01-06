var express = require('express')
var router =new express.Router();
const home=require('../tools/home/home');
const middleware = require('../../src/middlewares/auth/isLoggedIn');
const https=require('https');

//Home page
router.get('/',middleware.isLoggedIn,home.home);

router.post('/suscribe',home.suscribe);

module.exports = router;
