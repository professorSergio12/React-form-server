const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const LoginRouter = require('./routes/login');
const SignupRouter = require('./routes/signup');


app.use(cors({ origin: true }));
app.use(express.json());


app.use('/api', LoginRouter);
app.use('/api', SignupRouter);

app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Connected to the database");
    })
    .catch(err => {
        console.log("Error occurred while connecting to the database", err);
    });


const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
