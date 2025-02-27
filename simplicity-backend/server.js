const { exec } = require("child_process"); // Allows running terminal commands
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
const PORT = process.env.PORT || 8000;

// OpenAI Client Initialization
const client = new OpenAI({
    baseURL: process.env.API_URL,
    apiKey: process.env.API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Endpoint to Fetch the Current ngrok URL
app.get("/ngrok-url", (req, res) => {
    exec("curl -s http://127.0.0.1:4040/api/tunnels", (error, stdout, stderr) => {
        if (error) {
            console.error("Failed to get ngrok URL:", error);
            return res.status(500).json({ error: "Could not retrieve ngrok URL" });
        }

        try {
            const tunnels = JSON.parse(stdout);
            const publicUrl = tunnels.tunnels.find(t => t.proto === "https")?.public_url;

            if (!publicUrl) {
                return res.status(500).json({ error: "No active ngrok tunnel found" });
            }

            res.json({ ngrokUrl: publicUrl });
        } catch (parseError) {
            console.error("Error parsing ngrok response:", parseError);
            res.status(500).json({ error: "Invalid ngrok response" });
        }
    });
});

// ✅ Default route for testing
app.get("/", (req, res) => {
    res.status(200).send("Server is running! 🚀 Use POST /generate to interact.");
});

// ✅ Main API route for generating schedules
app.post("/generate", async (req, res) => {
    try {
        const userInput = req.body;
        
        const prompt = `
        You are an AI assistant that generates structured weekly work schedules in **valid JSON format**.
        Do not include explanations, preambles, or extra text—return **only** a valid JSON object.

        Here are the user's details:
        {
          "occupation": "${userInput.occupation}",
          "free_time": "${userInput.freeTime}",
          "sleep_hours": "${userInput.sleepHours}",
          "first_name": "${userInput.firstName}",
          "days_availability": ${JSON.stringify(userInput.daysAvailability)},
          "work_preference": ${JSON.stringify(userInput.workPreference)}
        }

        **Format the output strictly as a JSON object like this:**
        {
          "schedule": {
            "Monday": "Work from 9 AM - 5 PM, Gym at 6 PM, Dinner at 7 PM, Relax at 8 PM, Sleep at 10 PM.",
            "Tuesday": "...",
            "Wednesday": "...",
            "Thursday": "...",
            "Friday": "...",
            "Saturday": "...",
            "Sunday": "..."
          }
        }

        IMPORTANT: Only return the JSON object. No explanations, introductions.
        `;

        const response = await client.chat.completions.create({
            model: "simplicity-mini",
            messages: [{ role: "user", content: prompt }]
        });

        // ✅ Log API response for debugging
        console.log("OpenAI API Response:", response);

        // ✅ Ensure the response is structured correctly before sending it
        if (!response || !response.choices || response.choices.length === 0) {
            return res.status(500).json({ error: "Invalid response from OpenAI API" });
        }

        res.json(response.choices[0].message.content); // Send only the relevant content

    } catch (error) {
        console.error("Error communicating with OpenAI API:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Start the server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
