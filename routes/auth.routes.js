'use strict';
const authControllers = require("../controllers/auth.controller");
const {validateUserRequestBody} = require("../middlewares/validateUserRequestBody");

module.exports = function(app){
    app.post("/api/v1/auth/signup", 
            [validateUserRequestBody] , 
            authControllers.signup);
    app.post("/api/v1/auth/signin",
            authControllers.signin)
}