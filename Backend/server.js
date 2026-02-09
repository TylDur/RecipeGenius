// server.js - Complete AI Version
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google AI
let genAI;
let model;

try {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    console.log('✅ Google AI initialized successfully');
} catch (error) {
    console.error('❌ Failed to initialize Google AI:', error.message);
}

// Test route
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Backend is working!',
        timestamp: new Date().toISOString(),
        aiStatus: genAI ? 'Ready' : 'Not Ready'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    const hasApiKey = !!process.env.GOOGLE_API_KEY && 
                     process.env.GOOGLE_API_KEY.length > 30 &&
                     !process.env.GOOGLE_API_KEY.includes('YOUR_API_KEY');
    
    res.json({ 
        status: 'OK', 
        message: 'RecipeGenius AI Server',
        port: process.env.PORT,
        hasApiKey: hasApiKey,
        aiReady: !!genAI,
        endpoints: [
            'GET /api/health',
            'GET /api/test',
            'POST /api/generate-recipe'
        ]
    });
});

// Recipe generation endpoint
app.post('/api/generate-recipe', async (req, res) => {
    console.log('🔹 Recipe generation request received');
    
    try {
        const { ingredients, servings, time, diet, difficulty } = req.body;
        
        console.log('📦 Request data:', { ingredients, servings, time, diet, difficulty });
        
        // Validate input
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please add at least one ingredient' 
            });
        }
        
        if (!genAI || !model) {
            throw new Error('AI service not available. Check API key.');
        }
        
        // Create AI prompt
        const prompt = createRecipePrompt(ingredients, servings, time, diet, difficulty);
        console.log('📝 Prompt created:', prompt.substring(0, 200) + '...');
        
        // Call Google Gemini
        console.log('🤖 Calling Google Gemini AI...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const recipeText = response.text();
        
        console.log('✅ AI Response received:', recipeText.substring(0, 100) + '...');
        
        // Parse the recipe from AI response
        const recipe = parseAIRecipe(recipeText);
        console.log('📊 Parsed recipe:', { 
            title: recipe.title,
            ingredientsCount: recipe.ingredients?.length || 0,
            instructionsCount: recipe.instructions?.length || 0
        });
        
        res.json({
            success: true,
            recipe: recipe,
            rawResponse: recipeText // For debugging
        });
        
    } catch (error) {
        console.error('❌ AI Error:', error.message);
        console.error('Error stack:', error.stack);
        
        res.status(500).json({ 
            success: false, 
            error: 'Failed to generate recipe. Please try again.',
            details: error.message,
            suggestion: 'Check your API key and internet connection'
        });
    }
});

// Helper function to create prompt
function createRecipePrompt(ingredients, servings, time, diet, difficulty) {
    return `
    ROLE: You are Chef AI, a professional culinary assistant with 20 years of experience.

    TASK: Create a delicious, practical recipe using these main ingredients: ${ingredients.join(', ')}.

    REQUIREMENTS:
    - Servings: ${servings}
    - Total cooking time: ${time}
    - Dietary preference: ${diet}
    - Difficulty level: ${difficulty}
    - Recipe must be practical for home cooking
    - Include common pantry ingredients

    FORMAT THE RECIPE EXACTLY LIKE THIS (NO EXTRA TEXT, NO MARKDOWN):

    TITLE: [Creative Recipe Name]
    TIME: [e.g., "30 minutes" or "1 hour"]
    SERVINGS: [e.g., "2-3 people" or "4 servings"]
    DIFFICULTY: [Easy, Medium, or Hard]

    INGREDIENTS:
    - [Ingredient 1 with quantity and preparation notes]
    - [Ingredient 2 with quantity]
    - [Ingredient 3 with quantity]

    INSTRUCTIONS:
    1. [Clear step 1 with time estimate if applicable]
    2. [Clear step 2]
    3. [Clear step 3]
    4. [Clear step 4]

    TIPS:
    - [Helpful cooking tip 1]
    - [Helpful cooking tip 2]

    IMPORTANT: Be creative but practical. Make sure the recipe actually works!
    `;
}

// Helper function to parse AI response
function parseAIRecipe(aiText) {
    console.log('📄 Parsing AI text...');
    
    // Default recipe structure
    const recipe = {
        title: 'AI Generated Recipe',
        time: 'Not specified',
        servings: 'Not specified',
        difficulty: 'Medium',
        ingredients: [],
        instructions: [],
        tips: []
    };
    
    try {
        const lines = aiText.split('\n').map(line => line.trim()).filter(line => line !== '');
        
        let currentSection = '';
        
        for (const line of lines) {
            // Check for section headers
            if (line.startsWith('TITLE:')) {
                recipe.title = line.replace('TITLE:', '').trim();
                continue;
            }
            if (line.startsWith('TIME:')) {
                recipe.time = line.replace('TIME:', '').trim();
                continue;
            }
            if (line.startsWith('SERVINGS:')) {
                recipe.servings = line.replace('SERVINGS:', '').trim();
                continue;
            }
            if (line.startsWith('DIFFICULTY:')) {
                recipe.difficulty = line.replace('DIFFICULTY:', '').trim();
                continue;
            }
            if (line === 'INGREDIENTS:') {
                currentSection = 'ingredients';
                continue;
            }
            if (line === 'INSTRUCTIONS:') {
                currentSection = 'instructions';
                continue;
            }
            if (line === 'TIPS:') {
                currentSection = 'tips';
                continue;
            }
            
            // Process content based on current section
            if (currentSection === 'ingredients' && (line.startsWith('- ') || line.startsWith('• '))) {
                const ingredient = line.replace(/^[-•]\s*/, '').trim();
                if (ingredient) recipe.ingredients.push(ingredient);
            }
            else if (currentSection === 'instructions' && (/^\d+\./.test(line) || line.startsWith('- '))) {
                const instruction = line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim();
                if (instruction) recipe.instructions.push(instruction);
            }
            else if (currentSection === 'tips' && (line.startsWith('- ') || line.startsWith('• '))) {
                const tip = line.replace(/^[-•]\s*/, '').trim();
                if (tip) recipe.tips.push(tip);
            }
        }
        
        // If parsing failed, try a simpler approach
        if (recipe.ingredients.length === 0 || recipe.instructions.length === 0) {
            console.log('⚠️ Using fallback parsing...');
            return fallbackParse(aiText);
        }
        
    } catch (error) {
        console.error('Error parsing recipe:', error);
        return fallbackParse(aiText);
    }
    
    return recipe;
}

// Fallback parsing if main parser fails
function fallbackParse(aiText) {
    const recipe = {
        title: 'AI Generated Recipe',
        time: '30 minutes',
        servings: '2-4 people',
        difficulty: 'Medium',
        ingredients: ['Check the full recipe for ingredients'],
        instructions: ['Check the full recipe for instructions'],
        tips: [],
        rawText: aiText
    };
    
    // Try to extract title
    const lines = aiText.split('\n');
    for (const line of lines) {
        if (line.trim() && !line.startsWith('#') && line.length < 100) {
            recipe.title = line.trim();
            break;
        }
    }
    
    return recipe;
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🎉 RecipeGenius AI Server Started!`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
    console.log(`🤖 AI Status: ${genAI ? 'READY' : 'NOT READY - Check API Key'}`);
    console.log(`\n📋 Available Endpoints:`);
    console.log(`   GET  /api/health`);
    console.log(`   GET  /api/test`);
    console.log(`   POST /api/generate-recipe`);
    console.log(`\n🚀 To test: curl -X POST http://localhost:${PORT}/api/generate-recipe \\`);
    console.log(`   -H "Content-Type: application/json" \\`);
    console.log(`   -d '{"ingredients":["chicken","rice"],"servings":"2","time":"30 minutes","diet":"Any","difficulty":"Easy"}'`);
});
