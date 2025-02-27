const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/userdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', userSchema);

// Register a new user
app.post('/addUser', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "❌ User already registered with this email!" });
        }

        // Create new user
        const newUser = new User({ name, email, password });
        await newUser.save();

        console.log("✅ New User Registered:", newUser);
        res.status(201).json(newUser);

    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ message: "❌ Registration failed. Try again." });
    }
});

// Login User
app.post('/loginUser', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ message: "❌ Invalid login credentials!" });
        }

        console.log("✅ User Logged In:", user);
        res.json(user);
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: "❌ Login failed. Try again." });
    }
});

app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});
