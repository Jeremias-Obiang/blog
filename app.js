const express=require('express');
const app=express();
const port=process.env.PORT || 4000;
const db=require('./src/db/connection');
const mysql=require('mysql');
const { query } = require('./src/db/connection');
const DB=require('./src/db/dbmodel');
const path = require('path');

let folderPath= require('path').resolve('public/upload');

app.listen(port, () => console.log(`Listening on port ${port}`));
