var express = require('express')
var router =new express.Router();
const login_tools=require('../tools/auth/auth');
const middleware=require('../../src/middlewares/auth/form_validation');
const image=require('../../src/middlewares/auth/image');
const login_validation=require('../../src/middlewares/admin/login_form_validation');

router.get('/register',login_tools.register_page);
// router.post('/register',middleware.fields_validation,middleware.check_username_duplicate,middleware.check_email_duplicate,login_tools.register);
router.post('/register',image.register,middleware.fields_validation,middleware.check_username_duplicate,middleware.check_email_duplicate,login_tools.register);

router.get('/login',login_tools.login_page);
router.post('/login',login_validation.field_validation,login_tools.login);

router.get('/logout',login_tools.logout);

module.exports = router;
