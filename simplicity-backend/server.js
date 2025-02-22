require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai'); // Use OpenAI SDK

const app = express();
const PORT = process.env.PORT || 5000;

// Load API credentials from .env
const client = new OpenAI({
    baseURL: process.env.API_URL, 
    apiKey: process.env.API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// API route to handle requests from frontend
app.post('/generate', async (req, res) => {
    try {
        const userInput = req.body;

        // Send request using OpenAI SDK
        const response = await client.chat.completions.create({
            model: "simplicity-mini", // Change model if needed
            messages: [
                { role: "user", content: JSON.stringify(userInput) }
            ]
        });

        res.json(response);
    } catch (error) {
        console.error("Error communicating with Simplicity API:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
