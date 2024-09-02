const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/LoginSignup", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Database connected successfully");
})
.catch((err) => {
    console.log("Database connection failed", err);
});

// Define the schema for login
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create a model for the schema
const Login = mongoose.model('Login', LoginSchema);

module.exports = Login;
