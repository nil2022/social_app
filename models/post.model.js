'use strict';
const mongoose = require("mongoose");
const User = require('./user.model')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique:true
    },
    content: {
        type: String,
        required: true
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

module.exports = mongoose.model("Post", postSchema);