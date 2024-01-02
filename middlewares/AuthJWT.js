const jwt = require("jsonwebtoken");
const { SECRET } = require('../configs/server.config.js')

/***** VERIFY ACCESS TOKEN TO CHECK IF TOKEN IS PRESENT AND VALID ********/
let verifyToken = (req, res, next) => {

    /***  GET THE ACCESS TOKEN FORM HEADER  *****/
    let token = req.headers['x-access-token'];

    /*** CHECK WHETHER ACCESS TOKEN PROVIDED OR NOT *****/
    if (!token) {
        console.log("No token provided 😔")
        return res.status(403).send("No Token Provided");
    }
    /*** VERIFY ACCESS TOKEN FOR THE USER *****/
    jwt.verify(token, SECRET, (err, decoded) => {
        // Checks for any error in JWT verification
        if (err) {
            console.log("Error:", err.message);
            return res.status(401).send("Token Expired!");
        }
        
        else {
            /****** ASSIGN USER FETCHED FROM TOKEN TO REQ.USER ********/
            req.userId = decoded.userId
            next();
        }     
    })
}

module.exports = {
    verifyToken
}