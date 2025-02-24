require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai'); // Use OpenAI SDK

const app = express();
const PORT = process.env.PORT || 8000;

// Load API credentials from .env
const client = new OpenAI({
    baseURL: process.env.API_URL, 
    apiKey: process.env.API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Server is running! 🚀 Use POST /generate to interact.");
});

// API route to handle requests from frontend
app.post('/generate', async (req, res) => {
    try {
        const userInput = req.body;
        // Construct the prompt with the user's data
        const prompt =  `
        You are an AI assistant that generates structured weekly work schedules in **valid JSON format**.
        Do not include explanations, preambles, or extra text—return **only** a valid JSON object.

        Make sure to customize the title with the "first_name"
        If the User is remote, then do not factor in commute time.
        If the user is both remote and in-person or just in-person, make sure to factor in commute time of atleast 30 minutes into the schedule.
        Customize the activities based on user inputs/preferences.

        You can add or change the work hours
        and activities to fit the user's preferences and availability. Make sure to balance work, personal activities, 
        and sleep and non-negotiables if there are any. For the "..." in the below example you may say Free Time or
        other relevant activities/recommendations based on user input. Try not to be too Repeatitive on tasks/activities.
        and include short encouraging messages or text for empty time. Note you do not have to write the encouraging text
        for every free slot, keep it real and balanced.

        
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
        
        // `
        // Given the following user details, create an optimized **weekly work schedule** that balances work, free time, and adequate sleep. 
        // Ensure the schedule is realistic and considers the user's availability and work preferences.

        // **User Details:**
        // - Occupation: ${userInput.occupation}
        // - Free Time Preferences: ${userInput.freeTime}
        // - Sleeping Hours: ${userInput.sleepHours} hours per day
        // - Days Available: ${userInput.daysAvailability.join(", ")}
        // - Work Preference: ${userInput.workPreference.join(", ")}

        // **Schedule Output Format Example (Monday-Sunday)**
        // - Monday: Work from 9 AM - 5 PM, Gym at 6 PM, Dinner at 7 PM, Relax at 8 PM, Sleep at 10 PM.
        // - Tuesday: (same format)
        // - ...
        
        // Please generate a detailed **daily schedule** for the entire week. 
        // Make sure to balance **work, personal activities, and sleep**, ensuring the user has enough rest.
        // `;
        
        // Send request using OpenAI SDK
        const response = await client.chat.completions.create({
            model: "simplicity-mini",
            messages: [{ role: "user", content: prompt }]
        });

        res.json(response);
    } catch (error) {
        console.error("Error communicating with Simplicity API:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
