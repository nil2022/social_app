"use strict";
const User = require("../models/user.model");

/*********** Convert & View UTC Time & date to Indian Time format (doesn't modify in MongoDB database) *******/
const { formatDate } = require("../utils/formatDate");

/*** VALIDATE DETAILS PROVIDED BY USER ******/
let validateUserRequestBody = async (req, res, next) => {
  try {

    let { name, userId, email, password } = req.body;
    /**************  NAME VALIDATION  ****************** */
    if (!name) {
      console.log("\nName is not provided");
      return res.status(400).send("Bad Request! Name not provided");
    }

    /**************  USERID VALIDATION  ****************** */
    if (!userId) {
      console.log("\nuserId is not provided");
      return res.status(400).send("Bad Request! UserId not provided");
    }

    const user = await User.findOne({ userId: userId });

    //check whether UserId already exists in DB
    if (user != null) {
      const IndiaDateCreatedAt = formatDate(user.createdAt);
      const IndiaDateUpdatedAt = formatDate(user.updatedAt);
      const userData = {
        name: user.name,
        userId: user.userId,
        email: user.email,
        createdAt: IndiaDateCreatedAt,
        updatedAt: IndiaDateUpdatedAt,
      };
      console.log("\nuserId with this data already exists!", userData);
      return res.status(400).send(`Failed!, userId '${userData.userId}' already exists!`);
    }

    /**************  EMAIL VALIDATION  ****************** */
    //***  Check if email is provided by user or not in "req.body"   *********
    if (!email) {
      console.log("\nEmail not provided");
      return res.status(400).send("Bad Request! Email not provided");
    }

    //*******  If email is provided by user, Check whether it is already exists in DB or not  *********
    const emailReq = await User.findOne({ email: email });

    if (emailReq != null) {
      console.log("\nEmail \'"+email+ "\' already exists");
      return res.status(400).send(`Failed! Email '${emailReq.email}' already exists`);
    }

    /*************  PASSWORD VALIDATION  ***************** */
    if (!password) {
      console.log("\nPassword not provided");
      return res.status(400).send("Bad Request! Password not provided");
    }

    next();
    
  } catch (error) {
    console.log("Error at validateUserRequestBody:", error.message);
    res.status(400).send("Internal Error Occured!");
  }
};

/*******  EXPORT USER VALIDATION FUNCTIONS  **********/
module.exports = {
  validateUserRequestBody,
};
