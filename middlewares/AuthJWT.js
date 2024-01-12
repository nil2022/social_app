const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../configs/server.config.js");

/***** VERIFY ACCESS TOKEN TO CHECK IF TOKEN IS PRESENT AND VALID ********/
let verifyToken = (req, res, next) => {
  /***  GET THE ACCESS TOKEN FORM HEADER  *****/
  let token = req.headers["x-access-token"];

  /*** CHECK WHETHER ACCESS TOKEN PROVIDED OR NOT *****/
  if (!token) {
    console.log("No token provided 😔");
    return res.status(403).send("No Token Provided");
  }
  /*** VERIFY ACCESS TOKEN FOR THE USER *****/
  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    // Checks for any error in JWT verification
    if (err) {
      console.log("Error --> Token Expired", err.name);
      return res.status(401).send("Token Expired!");
    } else {
      /****** USER FETCHED FROM TOKEN ASSIGNED TO REQ.USERID ********/
      req.userId = decoded.userId;
      next();
    }
  });
};

module.exports = {
  verifyToken,
};
