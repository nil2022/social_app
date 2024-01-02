require('dotenv').config()
const Post = require('../models/post.model');
const User = require('../models/user.model')
const jwt = require('jsonwebtoken');
const { SECRET } = require('../configs/server.config.js')
const { formatDate } = require("../utils/formatDate")  //to convert & view UTC date to Indian Time format (doesn't modify in MongoDB database)

/********* STORE POST TO DB REQUESTED BY USER *********/
exports.addPost = async (req, res) => {
    try {
        // Extract the post data from the request body
        const { title, content } = req.body;
        // Verify that the user is authenticated by checking the JWT token in the Authorization header
        let token = req.headers['x-access-token'];

        const decoded = jwt.verify(token, SECRET);
        // console.log(decoded);
        const user = await User.findOne({ userId: decoded.userId });

        //check if title of post is already in DB or not
        const titleCheck = await Post.findOne({ title: title })

        if(titleCheck) {
            console.log("Title already in DB, create unique title");
            return res.status(409).send("Title already in DB, create unique title")
        }

        // Create a new post with the user ID included
        const createPost = new Post({
            title,
            content
        });

        // Save the post to the database
        await createPost.save();
        console.log("Post created successfully", createPost);
        res.status(201).send({Message: "Post created successfully",createPost});

    } catch (error) {
        console.log("Error at post.controller:", error.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.getPostByUserId = async (req, res) => {
    try {
        //Verify that the user is authenticated 
        //by checking the JWT token in the Authorization header
        const token = req.headers['x-access-token'];
        
        const decoded = jwt.verify(token, SECRET);
        // console.log(decoded);
        // console.log("decoded.id", decoded.userId);

        if(!req.body.userId) throw new Error  //if no id is provided

        if(decoded.userId != req.body.userId){
            console.log("Unauthorized User/User not in our Server");
            return res.status(401).send('Unauthorized User!');
        } 
        
        const user = await User.findOne({ userId: decoded.userId });

        const posts = await Post.find({
            user: user._id
        });

        // Check if any posts were found
        if (posts.length === 0) {
            console.log("No posts found");
            return res.status(404).send('Post/Posts not found!');
        }

        // Return the found posts
        let allPostData = [];
        posts.forEach(element => {
            const IndiaDateCreatedAt = formatDate(element.createdAt)
            const IndiaDateUpdatedAt = formatDate(element.updatedAt)
            let postData = {
                id: element._id,
                title: element.title,
                content: element.content,
                createdAt: IndiaDateCreatedAt,
                updatedAt: IndiaDateUpdatedAt
            }
            allPostData.push(postData);
        });
        console.log(allPostData);
        res.status(200).send(allPostData);
        // const IndiaDateCreatedAt = formatDate(posts.createdAt)
        // const IndiaDateUpdatedAt = formatDate(posts.updatedAt)
    //     const postData = {
    //         id: posts._id,
    //         title: posts.title,
    //         content: posts.content,
    //         user: posts.user,
    //         // createdAt: IndiaDateCreatedAt,
    //         // updatedAt: IndiaDateUpdatedAt
    //     }
    //    // res.status(200).send(postData);

    } catch (err) {
        console.error("Internal Error:",err.message);
        res.status(500).send("Internal Server Error");
    }
};

exports.deletePostByPostTitle = async (req, res) => {
    const titleReq = req.query.title
    try {
         if(!titleReq) throw new Error("Title of post not provided");

         const post = await Post.findOneAndDelete({ title : titleReq }).exec()

         if(post == null) throw new Error("Post is null/Post is not in server");

         console.log(`Post Deleted for Title: "${titleReq}"`);
         return res.status(200).send(`Post Deleted Successfully! for Title: "${titleReq}"`)
         
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


/***  TEST DATA USING AXIOS   CONTROLLER**** */
// exports.getData = async (req, res) => {
//     try {
//         const posts = await Post.find();
//         res.status(200).send(posts);

//     } catch (error) {
//         console.log('Error:', error);
//         res.status(500).send('Internal Error')
//     }
// }