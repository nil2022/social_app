'use strict';
const Post = require('../models/post.model');
const User = require('../models/user.model')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { SECRET } = require('../configs/server.config.js')

exports.createPost = async (req, res) => {
    try {
        // Verify that the user is authenticated by checking the JWT token in the Authorization header
        let token = req.headers['x-access-token'];

        const decoded = jwt.verify(token, SECRET);

        const user = await User.findOne({
            userId: decoded.id
        });

        // Extract the post data from the request body
        const { title, content } = req.body;

        // Create a new post with the user ID included
        const post = new Post({
            title,
            content,
            user: user._id
        });

        // Save the post to the database
        await post.save();

        res.status(200).json({ message: 'Post created successfully', post });
    } catch (error) {
        console.log("Error occured at post.controller, createPost", error.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.getPostByUserId = async (req, res) => {
    try {
        //Verify that the user is authenticated by checking the JWT token in the Authorization header
        const token = req.headers['x-access-token'];
        const decoded = jwt.verify(token, SECRET);

        const user = await User.findOne({
            userId: decoded.id
        })

        const  userId = user._id.toString() //convert ObjectId to String

        if(!req.body.id) throw new Error  //if no id is provided

        if(userId != req.body.id){
            console.log("Unauthorized User/User not in our Server");
            return res.status(401).send('Unauthorized User!');
        } 
        
        const posts = await Post.find({
            user: req.body.id
        });

        // Check if any posts were found
        if (posts.length === 0) {
            console.log("No posts found");
            return res.status(404).send('Post/Posts not found!');
        }

        // Return the found posts
        res.status(200).send(posts);

    } catch (err) {
        console.error("Internal Error:",err);
        res.status(500).send("Internal Server Error");
    }
};

exports.deletePostById = async (req, res) => {
    const postIdReq = req.query.postId
    try {
         if(!postIdReq) throw new Error("PostId not provided");
         const post = await Post.findOneAndDelete({ _id : postIdReq}).exec()
         if(post == null) throw new Error("Post is null/Post is not in server");
         console.log("Post Deleted for postid:", postIdReq);
         return res.status(200).send('Post Deleted')
         
    }  
    catch (err) 
        {
            console.log("Error deleting post: ", err.message);
            return res.status(500).send("Internal Server Error");
        }

}

exports.deleteAllPostsByUserId = async (req, res) => {
    try {
         //Verify that the user is authenticated by checking the 
         //JWT token in the Authorization header
         const token = req.headers['x-access-token'];
         const decoded = jwt.verify(token, SECRET);
         
         const user = await User.findOne({
             userId: decoded.id
         })

         const  userId = user._id.toString() //convert ObjectId to String

         const posts = await Post.find({
            user: userId
         })

         if(posts.length === 0) {
            console.log(`No posts with user: ${user.name}`);
            return res.status(200).send(`No posts with user: ${user.name}`)
         }    
         Post.deleteMany({ user : userId}).exec()
         console.log(`All Posts of '${user.name}' with Id: ${userId} are deleted`);
         return res.status(200).send(`All Posts of '${user.name}' are deleted`)
    } catch(err) {
        console.log("Error deleting posts", err);
        return res.status(500).send("Internal Server Error")
    }
}