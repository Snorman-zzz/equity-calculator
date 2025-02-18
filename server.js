// server.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // npm install node-fetch@2
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY || "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";
const DEEPSEEKR1_URL = "https://openrouter.ai/api/v1/completions";

app.post("/api/generate-ai-report", async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await fetch(DEEPSEEKR1_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.3-70b-instruct:free", // Adjust as needed
                prompt: prompt,
                max_tokens: 1000,
                temperature: 0.7,
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            return res.status(500).json({ error: "API request failed", details: errorText });
        }
        const data = await response.json();
        const answer = data.choices[0].text.trim();
        res.json({ answer });
    } catch (error) {
        console.error("Error generating AI report:", error);
        res.status(500).json({ error: "Failed to generate AI report" });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});