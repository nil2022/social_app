'use strict';
const User = require("../models/user.model");
const { formatDate } =  require("../utils/formatDate")  //to convert & view UTC date to Indian Time format (doesn't modify in MongoDB database)

let validateUserRequestBody = async (req,res,next)=>{

    //validating name 
    if(!req.body.name){
        console.log("Name is not provided");
        return res.status(400).send("Failed! Name is not provided")
    }

       //validating userId 
       if(!req.body.userId){
        console.log("userId is not provided");
        return res.status(400).send("Failed! userId is not provided")
    }

    const user = await User.findOne({userId:req.body.userId});

    //check whether UserId already exists in DB
    if(user!=null){
        const IndiaDateCreatedAt = formatDate(user.createdAt)
        const IndiaDateUpdatedAt = formatDate(user.updatedAt)
        const userData = {
            name: user.name,
            userId: user.userId,
            email: user.email,
            createdAt: IndiaDateCreatedAt,
            updatedAt: IndiaDateUpdatedAt
        }
        console.log("userId already exists!", userData);
        return res.status(400).send({
            Message: "Failed!, userId already exists!"
        });
    }

       //validating email 
       if(!req.body.email){
        console.log("email not provided");
        return res.status(400).send("Failed! email is not provided")
    }

    const email = await User.findOne({email:req.body.email});

    //check whether EmailID already exists in DB
    if(email!=null){
        console.log("email already exists");
        return res.status(400).send("Failed! email already exists");
    }

    //validating email 
    if(!req.body.password){
        console.log("password not provided");
        return res.status(400).send("Failed! Password not provided");
    }

    next();

}

module.exports={
    validateUserRequestBody
}