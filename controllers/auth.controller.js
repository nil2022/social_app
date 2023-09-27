"use strict";
require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const Post = require("../models/post.model.js");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../configs/server.config.js");
const { formatDate } = require("../utils/formatDate.js")  //to convert & view UTC date to Indian Time format (doesn't modify in MongoDB database)

exports.signup = async (req, res) => {
  const userObject = {
    name: req.body.name,
    userId: req.body.userId,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  };
  try {
    const user = await User.create(userObject);
    console.log(user); //Displays the user created
    res.status(201).send(user);
  } catch (err) {
    console.log("Error Occured!", err);
    res.status(500).send("Internal Server Error:");
  }
};

exports.signin = async (req, res) => {
  try {
    const { userId, password } = req.body;

    //verify whether the userId is correct or not
    const user = await User.findOne({ userId });

    if (!user) {
      console.log("UserID doesn't exists");
      return res.status(400).send("UserId doesn't exist in our server");
    }

    if (!password) {
      console.log("Password not entered");
      return res.status(400).send("Please enter the password");
    }

    let isCorrectPassword = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isCorrectPassword) {
      console.log("Invalid Password");
      return res.status(401).send("Invalid Password");
    }

    let token = jwt.sign({ userId: userId }, SECRET, {
      expiresIn: "12h", //12hours
    });
        const IndiaDateCreatedAt = formatDate(user.createdAt)
        const IndiaDateUpdatedAt = formatDate(user.updatedAt)
        const userData = {
            name: user.name,
            userId: user.userId,
            email: user.email,
            createdAt: IndiaDateCreatedAt,
            updatedAt: IndiaDateUpdatedAt
        }
    console.log("SignIn Req for:-\n", userData);
    res.status(200).send({
      Message: "Signed in Successfully!",
      AccessToken: token
    });
  } catch (error) {
    console.log("Error occured", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId, password } = req.body;

    //verify whether the userId is correct or not
    const userCheck = await User.findOne({
      userId: userId,
    });

    if (!userCheck) {
      console.log("UserID doesn't exists");
      return res.status(400).send("UserId doesn't exist in our server");
    }

    if (!password) {
      console.log("Password not entered");
      return res.status(400).send("Please enter the password");
    }

    const user = await User.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        password: bcrypt.hashSync(password, 10),
        updatedAt: Date.now(),
      }
    ).exec();
    console.log(`Password for user '${userId}' updated!`);
    res.status(200).send(`Password for user '${userId}' updated!`);
  } catch (err) {
    console.log("Error while updating the record", err.message);
    res.status(500).send("Some internal error occured");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userIdReq = req.body.userId;
    const passwordReq = req.body.password;
    const tokenReq = req.headers["x-access-token"];

    if (!userIdReq || !passwordReq) {
      console.log("UserID/Password not provided");
      throw new Error("UserID/Password not provided");
    }

    const tokenValidate = await jwt.verify(tokenReq, SECRET);

    console.log("userIdReq- ", userIdReq);
    console.log("passwordReq- ", passwordReq);
    //console.log("tokenReq- ", tokenReq);
    console.log("tokenValidate.userId- ", tokenValidate.userId);

    if (userIdReq == tokenValidate.userId)
      console.log("userId and token matched");
    else {
      console.log("provided userId and token not matching");
      throw new Error("provided userId and token not matching");
    }

    //find the User in DB from requested userIdReq
    const user = await User.findOne({
      userId: userIdReq,
    });
    console.log(user);
    console.log("user.password-", user.password);

    //check whether password provided is correct or not
    let passwordIsValid = await bcrypt.compare(passwordReq, user.password);
    if (passwordIsValid != true) throw new Error("Password mismatch");
    console.log("Password matched");

    //check posts with userId provided in DB
    const posts = await Post.find({
      user: userIdReq,
    });

    //deletes all posts of provided userId
    Post.deleteMany({ user: userIdReq }).exec();

    //deletes the user with provided userId
    User.findOneAndDelete({ userId: userIdReq }).exec();
    //console.log(posts);
    res.status(200).send(`All Posts of ${userIdReq} are deleted,
                                  User with userId '${userIdReq}' is deleted`);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(400).send(err.message);
  }
};
