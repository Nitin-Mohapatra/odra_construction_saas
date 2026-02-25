const express = require('express')
const { query, validationResult, body } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../../models/user');
const User = require('../../models/user');
const env = require('dotenv').config();

// signup
const signup = express.Router()
signup.post('/signUp', [
    body('email').isEmail().withMessage("Enter a valid email"),
    body('name').notEmpty().withMessage("Please enter a valid name"),
    body('password')
        .isLength({ min: 5 }).withMessage("Password too short")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/).withMessage("Password Must be alphanumeric"),
    body('role')
        .notEmpty()
        .withMessage("Please enter a role")
        .isIn(['manager', 'site engineer'])
        .withMessage("Role must be either 'manager' or 'site engineer'")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error(`Validation Error: ${errors.array()}`)
        return res.status(422).json({ success: false, error: errors.array() })
    }

    try {
        const { email, password, role, name } = req.body;
        const response = await user.findOne({ email })  //if the email/user is not there then it will give null .. but if the mongodb connection error isther the  throws error

        if (response) {
            console.error('The user already exits');
            return res.status(409).json({success:false , error: "The user already exists"});
        } else {
            const hassedPw = await bcrypt.hash(password, 12)
            const newUser = await User.create({
                name,
                email,
                role,
                password: hassedPw
            })

            if (newUser) {
                const token = jwt.sign({
                    User_id: newUser._id,
                    isLoggedIn: true,
                    role
                }, process.env.secret_key, { expiresIn: '1h' });
                return res.status(200).json({ success: true, token,User_id: newUser._id ,role,name });
            } 
        }

    } catch (e) {
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }

})


// signin
const signin = express.Router()
signin.post('/signIn',[
    body('email').isEmail().withMessage("Enter a valid email"),
    body('password')
        .isLength({ min: 5 }).withMessage("Password too short")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/).withMessage("Password should alphanumeric"),
    body('role')
        .notEmpty()
        .withMessage("Please enter a role")
        .isIn(['manager', 'site engineer'])
        .withMessage("Role must be either 'manager' or 'site engineer'")
],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.error("Validation Error",errors.array());
        return res.status(422).json({ success: false, error: errors.array() })
    }
    try{
        const {email, role , password} = req.body;
        const response = await User.findOne({email});

        if(!response){
            console.error("The user doesnot exit please singup first");
            return res.status(404).json({success:false , error:"The user doesnot exist"});
        }

        const isMatchPassword = await bcrypt.compare(password,response.password);
        const isMatchRole = (role == response.role);

        if(!isMatchPassword || !isMatchRole){
            console.error("The credentials don't match");
            return res.status(401).json({success:false,error:"Credentials mismatched"});
        }
        
        const token = jwt.sign({
            User_id: response._id,
            isLoggedIn: true,
            role
        },process.env.secret_key,{expiresIn:'1h'});
        console.log(`Token = ${token}`);
        return res.status(200).json({success:true,token,User_id:response._id,role,name:response.name});
    }catch(e){
        console.error('Internal server error',e);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
})

module.exports = {signup,signin}