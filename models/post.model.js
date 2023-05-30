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
        type: String,
        immutable:true,
        default: () => {
            const date = new Date();
            return date.toString();
        }
    },
    updatedAt: {
        type: String,
        default: () => {
            const date = new Date();
            return date.toString();
        }
    }
})

module.exports = mongoose.model("Post", postSchema);