'use strict';

//import mongoose
const mongoose = require("mongoose");

//route handler
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,'Please provide title of post'],
        unique:true
    },
    content: {
        type: String,
        required: [true,'Please provide content']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
module.exports = mongoose.model("Post", postSchema);