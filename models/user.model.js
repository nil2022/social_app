'use strict';

//import mongoose
const mongoose = require("mongoose");

//route handler
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide name']
    },
    userId:{
        type:String,
        required:[true,'Please provide userId'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Please provide password']
    },
    email:{
        type:String,
        required:[true,'Please provide email'],
        lowercase:true,
        unique:true
    },
    createdAt: {
        type: Date,
        immutable:true,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

//export
module.exports = mongoose.model("User", userSchema);