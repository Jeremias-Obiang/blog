require('dotenv').config();
const express=require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
var cookieParser = require('cookie-parser');



const app=express();
const port=process.env.PORT || 3000;


// Define for Express config
const publicDir = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../views');


// Setup handlebars and views location
app.set('view engine', 'ejs'); // Defining view type/format
app.set('views', viewsPath); //Setting the views to that path location

// default option
app.use(fileUpload());

// Setup static directory to serve
app.use(express.static(publicDir));
app.use(express.static('upload'));


// Parse application/json
app.use(express.json());

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

//---------------------------------Loading  routes-----------------------

//Loading the home router
const homeRouter=require('./routers/home_router');

//Loading post router
const postRouter=require('./routers/post_routers');


//Loading admin router
const adminRouter=require('./routers/admin_routers');

//Auth router
const authRouter=require('./routers/auth_router');

//User router
const userRouter=require('./routers/user_router');


//Nav router
const navRouter=require('./routers/nav_routers');

//Reset password router ...
const resetRouter=require('./routers/reset_routers');

app.use(navRouter);
app.use(homeRouter);
app.use(authRouter);
app.use(adminRouter);
app.use(userRouter);
app.use(postRouter);
app.use(resetRouter);


app.listen(port, () => console.log(`Listening on port ${port}`));
