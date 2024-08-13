const express = require('express');
const zod = require('zod');
const router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require('../models/user');

// Define a schema using Zod
const signupSchema = zod.object({
    firstname: zod.string(),
    lastname: zod.string(),
    email: zod.string().email("Invalid email address"),
    password: zod.string()
        .min(6, "Password must be at least 6 characters long")
        .refine(password => /[A-Z]/.test(password), {
            message: "Password must contain at least one uppercase letter"
        })
        .refine(password => /[0-9]/.test(password), {
            message: "Password must contain at least one number"
        })
        .refine(password => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
            message: "Password must contain at least one special character"
        })
});

router.post('/signup', async (req, res) => {
    const validationResult = signupSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({ errors: validationResult.error.errors });
    }

    const { firstname, lastname, email, password } = validationResult.data;

    try {
        // Check if user already exists
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new userModel({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        // Save the new user to the database
        await newUser.save();
        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

module.exports = router;
