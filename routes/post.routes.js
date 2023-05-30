'use strict';
const { createPost, getPostByUserId, deletePostById, deleteAllPostsByUserId} = require('../controllers/post.controllers')
const { verifyToken } = require('../middlewares/AuthJWT')

module.exports = function (app) {
    app.post("/api/v1/addPost", verifyToken, createPost)
    app.get("/api/v1/posts", verifyToken, getPostByUserId)
    app.delete("/api/v1/posts", verifyToken, deletePostById)
    app.delete("/api/v1/allposts", verifyToken, deleteAllPostsByUserId)
}