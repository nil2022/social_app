'use strict';
const jwt = require("jsonwebtoken");
const { SECRET } = require('../configs/server.config.js')

let verifyToken = (req, res, next) => {

    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send("No Token Provided");
    }

    jwt.verify(token, SECRET, (err, decoded) => {

        if (err) {
            console.log("Error at jwt.verify: ", err.message);
            return res.status(401).send("Unauthorized Access!");
        }

        req.userId = decoded.id;
        
        next();
    })
}

module.exports = {
    verifyToken
}