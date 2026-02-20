const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

console.log("Key loaded check:", process.env.GOOGLE_API_KEY ? "YES" : "NO");

const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
let modelReady = false;

async function startAI() {
    try {
        console.log('🤖 Connecting to Gemini 3...');
        await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ role: 'user', parts: [{ text: "hi" }] }]
        });
        console.log(`✅ AI Status: RecipeGenius Online`);
        modelReady = true;
    } catch (error) {
        console.error('❌ AI Initialization Failed:', error.message);
    }
}
startAI();

app.post('/api/generate-recipe', async (req, res) => {
    if (!modelReady) return res.status(503).json({ success: false, error: "AI not ready" });
    
    try {
        const { ingredients, servings, time, diet, difficulty } = req.body;

        // --- NEW VARIETY LOGIC ---
        // This picks a random style to prevent the same recipe from repeating
        const culinaryStyles = ["Mediterranean", "Asian-Fusion", "Modern French", "Classic Italian", "Rustic American", "Latin-Inspired"];
        const chosenStyle = culinaryStyles[Math.floor(Math.random() * culinaryStyles.length)];
        
        // This creates a random "secret" number to force the AI to rethink the response
        const cacheBuster = Math.floor(Math.random() * 1000);

        const prompt = `Act as a world-class Executive Chef. 
        Create a TOTALLY UNIQUE, gourmet recipe in a **${chosenStyle}** style using: ${ingredients.join(', ')}.
        Parameters: ${servings}, ${time} limit, ${diet} diet, ${difficulty} difficulty.
        Seed ID: ${cacheBuster} (Ensure this recipe is different from previous ones).

        STRICT RULES:
        1. NO REPETITION: Do not provide the "Saffron-Infused Chicken" recipe again. Explore new flavors.
        2. LANGUAGE: Use clear, professional English.
        3. STRUCTURE: Provide a creative title and at least 6 detailed steps.
        4. TECHNIQUE: Describe the "how-to" (e.g., "Whisk until stiff peaks form").
        5. CLEAN DATA: Do NOT include numbers (like "1.") inside the instruction text strings.

        Return ONLY JSON:
        {
          "title": "Creative Unique Title",
          "time": "Duration",
          "servings": "Yield",
          "difficulty": "Level",
          "ingredients": ["1 cup ingredient..."],
          "instructions": ["Step one...", "Step two..."]
        }`;

        console.log(`👨‍🍳 Chef is cooking a ${chosenStyle} dish with: ${ingredients.join(', ')}...`);

        const result = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                responseMimeType: 'application/json',
                temperature: 0.8, // Slightly higher for more variety
                thinkingConfig: { thinkingLevel: 'high' }
            }
        });

        res.json({ success: true, recipe: JSON.parse(result.text) });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}); // Fixed missing bracket here

app.listen(3000, () => console.log(`🚀 Server running at http://localhost:3000`));