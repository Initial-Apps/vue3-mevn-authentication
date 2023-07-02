const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');

require('dotenv').config(); // needed to read our environment variables
const mongoose = require('mongoose');  // We need the mongoose module
const connectString = process.env.MONGODB;  // This holds our username and password, stored as a environment variable
mongoose.connect(connectString, { useNewUrlParser: true }).then(
  () => { 
    console.log ('Succeeded connected to database');
   },
  err => { 
    console.log ('ERROR connecting to database: ' + err);
   }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api', (req, res) => {
  console.log(req.body)
  res.status(200).json({ result: req.body.text });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})