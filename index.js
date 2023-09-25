'use strict';
require('dotenv').config() //needed to fetch data from .env file
const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const path = require('path')
const app = express()
const { PORT } = require('./configs/server.config.js')
app.use(bodyParser.json());
app.use(express.json())

mongoose.connect(process.env.DB_URL);

try {
  const db = mongoose.connection;
  db.on("error", () => console.log("Can't connect to DB"))
  db.once("open", () => {
      console.log("\nConnected to Mongo DB\n")   
  })
} catch (error) {
    console.log('Error'+error);
}


app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'index.html'))
})

require("./routes/auth.routes")(app);
require("./routes/post.routes")(app);


app.listen(PORT, ()=> {
  console.log(`Application started on port http://127.0.0.1:${PORT}`)
})
