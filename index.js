'use strict';
require('dotenv').config() //needed to fetch data from .env file
const express = require('express')
// const bodyParser = require('body-parser');  //not needed as express.json is used
const mongoose = require('mongoose')
const path = require('path')
const app = express()
const { PORT } = require('./configs/server.config.js')
const db_url = process.env.DB_URL || 'mongodb://127.0.0.1:27017/instagram'
// app.use(bodyParser.json());  //not needed as express.json is used
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// connect to MongoDB
mongoose.connect(db_url,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Get the default connection
const db = mongoose.connection

// Event handlers for successful connection and connection error
db.on("error", (err) => console.log("Can't connect to DB", err))
// db.once("open", () => {
//     console.log("\nConnected to Mongo DB\n")   
// })

db.on('open', ()=> {
  console.log("\nConnected to MongoDB\n")
})

// Graceful shutdown on process termination
process.on('SIGINT', async () => {
  try {
    await db.close('close');
    console.log('MongoDB connection closed due to application termination');
    process.exit(0);
  } catch (err) {
    console.error('Error while closing MongoDB connection:', err);
    process.exit(1);
  }
});

app.get('/', (req, res) => {
  res.status(200).send(`
  <div>
    <h3>Social App Backend Running Good 🎉🎆</h3>  
  </div>
  `)
});

require("./routes/auth.routes")(app);
require("./routes/post.routes")(app);

//console.log(process.env); //to show environment variables paths

app.listen(PORT, ()=> {
  console.log(`\nApplication started on port http://127.0.0.1:${PORT}`)
})
