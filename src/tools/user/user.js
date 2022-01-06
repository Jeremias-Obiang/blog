const db=require('../../db/connection');
const DB=require('../../db/dbmodel');
const validator= require('validator');
const bcrypt = require('bcryptjs');
let DBModel=new DB(db);




module.exports.view_user=async (req,res)=>{
    if(req.user){
        return res.status(200).render('user/user',{user:req.user,PageTitle:req.user.username,nav:"profile"});
    }else{
        return res.redirect('/');
    }
}



module.exports.update_password=async (req,res)=>{

    const {old_password,new_password}=req.body;
    let update;
    
    try{
        //1) Check if old password is correct ...
        //2) check if both password are matching ...
        if(await bcrypt.compare(old_password,req.user.user_password) && old_password!=new_password){
            //if verification passed then we update the user's password ...
            //1) Before updating the user's password we must first hash it ...
            let hashedPassword = await bcrypt.hash(new_password, 8);
            update = await DBModel.updatePassword(hashedPassword,req.user.id);
            return res.status(200).render('user/user',{success:'Password was updated successfully',nav:"profile",PageTitle:req.user.username,user:req.user});
        }else{
            return res.status(401).render('user/user',{error:'Could not update password',nav:"profile",PageTitle:req.user.username,user:req.user});
        }
    }catch(error){
        console.log(error);
        throw error;
    }
}

