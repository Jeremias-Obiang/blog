
const { log } = require('console');
const db=require('../../db/connection');

exports.register = (req, res,next) => {
  
  let sampleFile;
  let uploadPath;
  let folderPath= require('path').resolve('public/upload');
  
  
  if (!req.files || Object.keys(req.files).length === 0) {
    return next();
  }else{
    sampleFile = req.files.sampleFile;
    uploadPath = folderPath+'/'+sampleFile.name;
    

    sampleFile.mv(uploadPath, async function (err) {
      if (err) return res.status(500).send(err);
      req.img_name='http://localhost:3000/upload/'+sampleFile.name;
      return next();
    });
  }

  
};
