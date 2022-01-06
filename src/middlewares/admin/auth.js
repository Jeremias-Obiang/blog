exports.middle_login=function(req, res, next){
    if(req.user){
        const user=JSON.parse(JSON.stringify(req.user));
        if(user && user.is_admin!=0){
            return res.redirect('/admin_home');
        }else{
            return next();
        }
    }else{
        return next();
    }
}


exports.middle_home=function(req, res, next){
    if(req.user){
        const user=JSON.parse(JSON.stringify(req.user));
        if(user && user.is_admin!=0){
            return next();
        }else{
            return res.render('login/login',{PageTitle:'Login'});
        }
            
    }else{
        return res.render('login/login',{PageTitle:'Login'});
    }
        
}