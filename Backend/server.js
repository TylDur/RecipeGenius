const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize the Gemini 3 Client with your API Key
const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
let modelReady = false;

// 1. Initialize and test the connection   
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

// HEALTH CHECK ENDPOINT - ADD THIS!
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'RecipeGenius',
        ai: {
            ready: modelReady,
            message: modelReady ? 'AI is connected and ready!' : 'AI not ready'
        },
        timestamp: new Date().toISOString()
    });
});

// 2. The API Route your Frontend calls  
app.post('/api/generate-recipe', async (req, res) => {  
    if (!modelReady) {
        return res.status(503).json({ success: false, error: "AI not ready" });
    }
    
    try {
        const { ingredients, servings, time, diet, difficulty } = req.body;

        const prompt = `Create a recipe using: ${ingredients.join(', ')}.
        Requirements: Serves ${servings}, Prep time ${time}, Diet: ${diet}, Difficulty: ${difficulty}.
   
        You MUST return ONLY a JSON object with this exact structure:
        {
          "title": "Recipe Name",
          "time": "Total Time",
          "servings": "Servings Info",
          "difficulty": "Difficulty Level",
          "ingredients": ["list item 1", "list item 2"],
          "instructions": ["step 1", "step 2"]
        }`;

        const result = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                responseMimeType: 'application/json'
            }
        });

        const recipeData = JSON.parse(result.text);
        res.json({ success: true, recipe: recipeData });

    } catch (error) {
        console.error("Generation Error:", error);
        res.status(500).json({ success: false, error: "The AI chef had a slip-up. Please try again!" });
    }
});

const PORT = 3000;
startAI().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
});
