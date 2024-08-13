const mongoose = require('mongoose');

const UserDetails = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] // Validates email format
    },
    password: {
        type: String,
        required: true,
    }
});

// Creating a model for the UserDetails schema
const details = mongoose.model('UserDetail', UserDetails);

module.exports = details;
