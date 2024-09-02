const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const Login = require('./config'); // Import the model

const app = express();

// Middleware setup
app.use(express.static('public')); // Serve static files
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.set('view engine', 'ejs');

// Route to render the login page
app.get('/', (req, res) => {
    res.render('login');
});

// Route to render the signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Handle signup form submission
app.post('/signup', async (req, res) => {
    const { name, password } = req.body;

    try {
        if (!name || !password) {
            throw new Error("Name and password are required");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const user = new Login({
            name,
            password: hashedPassword
        });

        // Save the user to the database
        await user.save();

        res.redirect('/'); // Redirect to the login page after successful signup
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).send("Error creating user. Please check the server logs for more details.");
    }
});

// Handle login form submission
app.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        // Find the user in the database
        const user = await Login.findOne({ name });

        if (!user) {
            return res.status(400).send("User not found");
        }

        // Compare the hashed password with the entered password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send("Invalid password");
        }

        // If password matches, redirect to the home page
        res.render('home', { name: user.name });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send("Error during login. Please check the server logs for more details.");
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
