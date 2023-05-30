'use strict';
require('dotenv').config()
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { SECRET } = require('../configs/server.config.js')

exports.signup = async (req,res)=>{

    const userObject={
        name:req.body.name,
        userId:req.body.userId,
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password, 8),
    }
    try {
        const user = await User.create(userObject);
        console.log(user) //Displays the user created
        res.status(201).send(user);
    }
    catch(err){
        console.log("Error Occured!", err)
        res.status(500).send("Internal Server Error:");
    }
}

exports.signin = async (req,res)=>{
    try {
        let tokenValidate = null
        const {userId,password} = req.body;

        //verify whether the userId is correct or not 
        const user = await User.findOne({userId});

        if(!user){
            console.log("UserID doesn't exists");
            return res.status(400).send("UserId doesn't exist in our server");   
        }

        if(!password){
            console.log("Password not entered");
             return res.status(400).send("Please enter the password");  
        }

        let isCorrectPassword= bcrypt.compareSync(req.body.password, user.password);

        if(!isCorrectPassword){
            console.log("Invalid Password");
            return res.status(401).send("Invalid Password");
        }

            const token = jwt.sign({id:user.userId},SECRET,{
                expiresIn:'12h' //12hours
            });
    
            tokenValidate = token;
    
            console.log("SignIn Req for:-\n", user);
            res.status(200)
            .send({
                name:user.name,
                userId:user.userId,
                email:user.email,
                accessToken:token
            });
       
    } catch (error) {
        console.log("Error occured",error);
        res.status(500).send('Internal Server Error');
    }
}