exports.validateRoles = (roles = [])=>(req,res,next)=>{
    console.log("req.user.role ", req.user.role);
    console.log("roles ", roles);
    if(!req.user){return res.status(401).json({"message":"User not found"})};
    if(!Array.isArray(roles)){
        roles = [roles];
    }
    if(!roles.includes(req.user.role)){
        return res.status(403).json({"message":'Forbidden — insufficient role' });
    }
    next();
}