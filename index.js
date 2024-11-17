require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');


const app = express();
const PORT = 8000;

mongoose.connect('mongodb://127.0.0.1:27017/')
.then(e=>console.log("MongoDB Connected"));



app.use(express.json());
app.use(cors());

app.use('/user',userRoute)
app.use('/admin',adminRoute)

app.listen(PORT, () => {
    console.log('Server is running on port',PORT);
  });