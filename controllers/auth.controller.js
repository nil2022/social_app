require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const Post = require("../models/post.model.js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../configs/server.config.js");
const { formatDate } = require("../utils/formatDate.js"); //to convert & view UTC date to Indian Time format (doesn't modify in MongoDB database)

/**************  SIGNUP/REGISTER API ********************/
exports.signup = async (req, res) => {
  try {
    // get the data from request body
    let { name, userId, email, password } = req.body;

    /************ GENERATE HASH FOR PASSWORD  *******************/
    const hash = await bcrypt.hash(password, 10);

    /************* STORE USER DATA TO DB  *************/
    const userCreated = await User.create({
      name,
      userId,
      email,
      password: hash,
    });
    //CONVERT JSON DATE TO INDIA DATE FORMAT
    const IndiaDateCreatedAt = formatDate(userCreated.createdAt);
    //Displays the user created
    console.log(userCreated);

    /************* SEND RESPONSE TO USER ************/
    res
      .status(201)
      .send([
        "Message: User created Successfully",
        {
          Name: userCreated.name,
          UserID: userCreated.userId,
          Email: userCreated.email,
          Created_At: IndiaDateCreatedAt,
        },
      ]);
  } catch (err) {
    console.log("Error Occured!", err.message);
    res.status(500).send("Internal Server Error:");
  }
};

/**************  SIGNIN  API ****************************/
exports.signin = async (req, res) => {
  try {
    // GET DATA FROM REQUEST BODY
    const { userId, password } = req.body;

    /***  CHECK FOR USERID IS PROVIDED IN REQUEST BODY OR NOT  ********************/
    if (!userId) {
      console.log("\nuserId is not provided");
      return res.status(400).send("Bad Request! UserId not provided");
    }

    //FETCH REQUESTED USER FROM DB
    const user = await User.findOne({ userId: userId });

    /**** CHECK FOR USER EXISTS IN DB OR NOT  *********** */
    if (!user) {
      console.log("UserID doesn't exists");
      return res.status(400).send("UserId doesn't exist in our server");
    }

    /*** CHECK FOR PASSWORD IS PROVIDED IN REQUEST BODY OR NOT   ********* */
    if (!password) {
      console.log("Password not entered");
      return res.status(400).send("Please enter the password");
    }

    /*******  CHECK WHETHER PASSWORD IS MATCHING IN DB OR NOT  ***********/
    let isCorrectPassword = await bcrypt.compare(password, user.password);
    /*******  CHECK WHETHER PASSWORD IS CORRECT OR NOT  ***********/
    if (!isCorrectPassword) {
      console.log("Invalid Password");
      return res.status(401).send("Invalid Password");
    }

    /***** CREATE A ACCESS TOKEN  FOR THE USER  ************ */
    let token = jwt.sign({ userId: userId }, JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    /**** CONVERT JSON DATE IN DB TO INDIA DATE FORMAT ***********/
    const IndiaDateCreatedAt = formatDate(user.createdAt);
    const IndiaDateUpdatedAt = formatDate(user.updatedAt);
    /**** CREATE A USER OBJECT TO STRUCTURE THE DATA TO SEND TH RESPONSE TO USER  *****/
    const userData = {
      // name: user.name,
      userId: user.userId,
    };

    /*****  SEND USER DATA IN RESPONSE FOR SIGNIN REQUESTED  ********/
    console.log("SignIn Req for:", userData);
    /*****  SEND ACCESS TOKEN TO USER FOR SIGNIN  *******/
    res.status(200).send({
      Message: "Signed in Successfully!",
      AccessToken: token,
    });
  } catch (error) {
    console.log("Error occured", error);
    res.status(500).send("Internal Server Error");
  }
};

/**************  CHANGE PASSWORD API*********************/
exports.changePassword = async (req, res) => {
  try {
    // GET DATA FROM REQUEST BODY
    const { userId, password } = req.body;

    //FETCH REQUESTED USER FROM DB
    const userCheck = await User.findOne({
      userId: userId,
    });

    /**** CHECK FOR USER EXISTS IN DB OR NOT  *********** */
    if (!userCheck) {
      console.log("UserID doesn't exists");
      return res.status(400).send("UserId doesn't exist in our server");
    }

    /*** CHECK FOR PASSWORD TO CHANGE, IS PROVIDED IN REQUEST BODY OR NOT   ********* */
    if (!password) {
      console.log("Password not entered");
      return res.status(400).send("Please enter the password");
    }

    /************ GENERATE HASH FOR PASSWORD  *******************/
    const hash = await bcrypt.hash(password, 10);

    /************ FIND THE USER, CHANGE PASSWORD, & UPDATE IN DB *******************/
    await User.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        password: hash,
        updatedAt: Date.now(),
      }
    ).exec();

    /***  LOG FOR SUCCESSFULL PASSWORD CHANGE  ****/
    console.log(`Password for user '${userId}' updated!`);
    /***  SEND RESPONSE TO USER FOR SUCCESSFULL PASSWORD CHANGE  ****/
    res.status(200).send(`Password for user '${userId}' updated!`);
  } catch (err) {
    console.log("Error while updating the password", err.message);
    res.status(500).send("Some internal error occured");
  }
};

/**************  DELETE USER API  *********************/
exports.deleteUser = async (req, res) => {
  try {
    /**** GET USERID & PASSWORD FROM REQUEST BODY ********/
    const { userId, password } = req.body;
    /**** CHECK FOR USERID & PASSWORD PROVIDED BY USER OR NOT ********/
    if (!userId || !password) {
      console.log("UserID/Password not provided");
      throw new Error("UserID/Password not provided");
    }

    //find the User in DB from requested userId
    const user = await User.findOne({
      userId: userId,
    });

    /******** CHECK WHETHER USER IN OUR DB OR NOT ***************/
    if (user == null) {
      console.log("User not found in DB/server");
      return res.status(400).send("Requested user is not in our Server!");
    }

    //check whether password provided is correct or not
    let isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid != true) throw new Error("Password not correct");

    //check posts with userId provided in DB
    await Post.find({ user: userId });

    //deletes all posts of provided userId
    Post.deleteMany({ user: userId }).exec();

    //deletes the user with provided userId
    User.findOneAndDelete({ userId: userId }).exec();

    console.log(`User with userId '${userId}' and all it's data are deleted`);
    /********  SEND RESPONSE TO USER ABOUT DELETION  **************/
    res
      .status(200)
      .send(`User with userId '${userId}' and all it's data are deleted`);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(400).send(err.message);
  }
};
