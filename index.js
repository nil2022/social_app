'use strict';
require('dotenv').config() //needed to fetch data from .env file
const express = require('express')

const mongoose = require('mongoose')

const userIP = require('user-ip');

const { PORT } = require('./configs/server.config.js')
const app = express()
const db_url = process.env.DB_URL || `mongodb://127.0.0.1:27017/${process.env.DB_NAME}`

app.use(express.urlencoded({extended:true}));
app.use(express.json());

// connect to MongoDB
// Event handlers for successful connection and connection error
const connectDB = async () => {
  try { console.time('Mongodb connection time:');
    const connect = await mongoose.connect(db_url,{
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.timeEnd('Mongodb connection time:');
    console.log(`\nMongoDB Connected to Host: ${connect.connection.host}`);
  } catch (error) {
    console.timeEnd();
    console.log("Can't connect to DB:", error.message);
  }
}

// FIRST CONNECT TO MONGODB THEN START LISTENING TO REQUESTS
connectDB().then(() => {
  app.listen(PORT, () => {
      console.log(`\nListening all requests on port ${PORT}`);
  })
}).catch((e)=>console.log(e)) // IF DB CONNECT FAILED, CATCH ERROR


/**************************HOME PAGE**************************** */
app.get('/', (req, res) => {
  const ip = userIP(req);
  console.log("Client Request IP:",ip);
  res.status(200).send(`
  <div style="padding:0.5rem; margin:auto">
    <h2>Social App Backend Running Good 🎉</h2>  
  </div>
  `)
});

/**************  IMPORT API's ********** */
require("./routes/auth.routes")(app);
require("./routes/post.routes")(app);

