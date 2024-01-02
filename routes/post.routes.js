'use strict';
const { addPost, getPostByUserId, deletePostByPostTitle, deleteAllPostsByUserId, getData} = require('../controllers/post.controllers')
const { verifyToken } = require('../middlewares/AuthJWT')

module.exports = function (app) {
    app.post("/api/v1/addPost", verifyToken, addPost)
    app.get("/api/v1/posts", verifyToken, getPostByUserId)
    app.delete("/api/v1/posts", verifyToken, deletePostByPostTitle)
    app.delete("/api/v1/allposts", verifyToken, deleteAllPostsByUserId)

    /***  TEST DATA USING AXIOS API **** */
    // app.get("/api/getdata", getData)
}