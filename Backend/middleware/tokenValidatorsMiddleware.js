const jwt = require('jsonwebtoken');
require('dotenv').config();


// token validator middleware
exports.authen = (req,res,next)=>{
    if(!req.headers['authorization']){
        return res.status(401).json({success:false,error:"Authorization header not found"});
    }
    const token = req.headers['authorization']?.split(' ')[1];
    
    if(!token){
        return res.status(401).json({success:false,error:"Token not found"});
    }else{
        jwt.verify(token,process.env.secret_key,(err,decoded)=>{
            if(err){
                return res.status(401).json({success:false,error:"Invalid token"});
            }else{
                req.user = decoded;
                
                next();
            }
        })
    }
}

