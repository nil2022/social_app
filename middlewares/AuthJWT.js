'use strict';
require('dotenv').config()
const jwt = require("jsonwebtoken");

let verifyToken = (req, res, next) => {

    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send("No Token Provided");
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {

        if (err) {
            return res.status(401).send("Unauthorized code");
        }

        req.userId = decoded.id;
        
        next();
    })
}

module.exports = {
    verifyToken,
}