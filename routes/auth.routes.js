'use strict';
const {signup, signin, changePassword, deleteUser} = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/AuthJWT");
const {validateUserRequestBody} = require("../middlewares/validateUserRequestBody");

module.exports = function(app){
    app.post("/api/v1/auth/signup", 
            [validateUserRequestBody] , signup);
    app.post("/api/v1/auth/signin", signin)
    app.put("/chngpass", 
           verifyToken,
           changePassword)
    app.delete("/delUser", 
           verifyToken,
           deleteUser)
}