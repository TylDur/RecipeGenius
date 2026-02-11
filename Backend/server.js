// RecipeGenius AI Backend Server
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Global variables
let genAI = null;
let model = null;
let modelName = 'Not initialized';

// Initialize AI function
async function initializeAI() {
    try {
        console.log('🤖 Initializing Google AI...');
        
        // Check API key
        if (!process.env.GOOGLE_API_KEY) {
            console.error('❌ API key missing in .env file');
            return false;
        }
        
        if (process.env.GOOGLE_API_KEY.includes('YOUR_API_KEY')) {
            console.error('❌ Please replace YOUR_API_KEY with your actual key');
            return false;
        }
        
        console.log('✅ API key found');
        genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        
        // Models to try (in order)
        const modelsToTry = [
            'gemini-1.5-flash-latest',
            'gemini-1.5-pro-latest', 
            'gemini-1.0-pro-latest',
            'gemini-pro'
        ];
        
        // Try each model
        for (const tryModel of modelsToTry) {
            try {
                console.log(`🔍 Testing model: ${tryModel}`);
                
                // Create model instance
                const testModel = genAI.getGenerativeModel({ model: tryModel });
                
                // Quick test
                const testResult = await testModel.generateContent('Hello');
                await testResult.response;
                
                // Success!
                model = testModel;
                modelName = tryModel;
                console.log(`✅ Success! Using model: ${modelName}`);
                return true;
                
            } catch (error) {
                console.log(`❌ ${tryModel} failed: ${error.message}`);
                continue;
            }
        }
        
        console.error('❌ No working model found');
        return false;
        
    } catch (error) {
        console.error('❌ AI initialization error:', error.message);
        return false;
    }
}

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'RecipeGenius Backend',
        status: 'OK',
        aiReady: !!model,
        model: modelName,
        time: new Date().toISOString()
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'RecipeGenius AI',
        version: '1.0',
        ai: {
            ready: !!model,
            model: modelName,
            provider: 'Google Gemini'
        },
        endpoints: {
            health: 'GET /api/health',
            test: 'GET /api/test',
            generate: 'POST /api/generate-recipe'
        }
    });
});

// Generate recipe endpoint
app.post('/api/generate-recipe', async (req, res) => {
    console.log('📦 Recipe request received');
    
    try {
        const { ingredients, servings, time, diet, difficulty } = req.body;
        
        // Validate input
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Please add at least one ingredient'
            });
        }
        
        if (!model) {
            return res.status(503).json({
                success: false,
                error: 'AI service not available',
                suggestion: 'Check if AI initialized properly'
            });
        }
        
        console.log(`🧂 Ingredients: ${ingredients.join(', ')}`);
        
        // Create prompt
        const prompt = `Create a recipe using these ingredients: ${ingredients.join(', ')}.
        
Requirements:
- Servings: ${servings || '2-4 people'}
- Time: ${time || '30 minutes'}
- Diet: ${diet || 'Any'}
- Difficulty: ${difficulty || 'Medium'}

Please format your response EXACTLY like this:

TITLE: [Recipe Name]
TIME: [Cooking Time]
SERVINGS: [Number of Servings]
DIFFICULTY: [Easy/Medium/Hard]

INGREDIENTS:
- [Ingredient 1 with quantity]
- [Ingredient 2 with quantity]

INSTRUCTIONS:
1. [Step 1]
2. [Step 2]

Make the recipe practical and delicious!`;
        
        console.log('📝 Sending to AI...');
        
        // Call AI
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const recipeText = response.text();
        
        console.log('✅ AI response received');
        
        // Parse the response
        const recipe = parseRecipe(recipeText);
        
        res.json({
            success: true,
            recipe: recipe,
            metadata: {
                model: modelName,
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('❌ Error generating recipe:', error.message);
        
        res.status(500).json({
            success: false,
            error: 'Failed to generate recipe',
            details: error.message
        });
    }
});

// Parse recipe from AI response
function parseRecipe(text) {
    const recipe = {
        title: 'AI Generated Recipe',
        time: '30 minutes',
        servings: '2-4 people',
        difficulty: 'Medium',
        ingredients: [],
        instructions: []
    };
    
    const lines = text.split('\n');
    let currentSection = '';
    
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        // Check for title
        if (line.startsWith('TITLE:')) {
            recipe.title = line.replace('TITLE:', '').trim();
            continue;
        }
        
        // Check for time
        if (line.startsWith('TIME:')) {
            recipe.time = line.replace('TIME:', '').trim();
            continue;
        }
        
        // Check for servings
        if (line.startsWith('SERVINGS:')) {
            recipe.servings = line.replace('SERVINGS:', '').trim();
            continue;
        }
        
        // Check for difficulty
        if (line.startsWith('DIFFICULTY:')) {
            recipe.difficulty = line.replace('DIFFICULTY:', '').trim();
            continue;
        }
        
        // Check for sections
        if (line === 'INGREDIENTS:' || line === 'INGREDIENTS') {
            currentSection = 'ingredients';
            continue;
        }
        
        if (line === 'INSTRUCTIONS:' || line === 'INSTRUCTIONS') {
            currentSection = 'instructions';
            continue;
        }
        
        // Add ingredients
        if (currentSection === 'ingredients' && line.startsWith('- ')) {
            const ingredient = line.substring(2).trim();
            if (ingredient) {
                recipe.ingredients.push(ingredient);
            }
        }
        
        // Add instructions
        if (currentSection === 'instructions' && /^\d+\./.test(line)) {
            const instruction = line.replace(/^\d+\.\s*/, '').trim();
            if (instruction) {
                recipe.instructions.push(instruction);
            }
        }
    }
    
    // Default fallbacks
    if (recipe.ingredients.length === 0) {
        recipe.ingredients = ['Check the recipe for ingredients'];
    }
    
    if (recipe.instructions.length === 0) {
        recipe.instructions = ['See recipe instructions above'];
    }
    
    return recipe;
}

// Start server function
async function startServer() {
    const PORT = process.env.PORT || 3000;
    
    // Initialize AI
    console.log('\n🚀 Starting RecipeGenius Server...');
    console.log('==============================');
    
    const aiReady = await initializeAI();
    
    app.listen(PORT, () => {
        console.log('\n🎉 SERVER STARTED SUCCESSFULLY!');
        console.log('==============================');
        console.log(`📍 Server URL: http://localhost:${PORT}`);
        console.log(`🤖 AI Status: ${aiReady ? 'READY ✓' : 'NOT AVAILABLE'}`);
        console.log(`📦 AI Model: ${modelName}`);
        console.log('\n📋 Available Endpoints:');
        console.log(`   Health:    http://localhost:${PORT}/api/health`);
        console.log(`   Test:      http://localhost:${PORT}/api/test`);
        console.log(`   Generate:  POST http://localhost:${PORT}/api/generate-recipe`);
        console.log('\n🔧 Quick Test Commands:');
        console.log(`   curl http://localhost:${PORT}/api/health`);
        console.log(`   curl -X POST http://localhost:${PORT}/api/generate-recipe \\`);
        console.log(`     -H "Content-Type: application/json" \\`);
        console.log(`     -d '{"ingredients":["chicken","rice"]}'`);
        console.log('\n💡 Frontend: Open FrontEnd/index.html in browser');
    });
}

// Error handlers
process.on('uncaughtException', (error) => {
    console.error('🔥 Uncaught Exception:', error.message);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
});

// Start the server
startServer().catch(error => {
    console.error('🔥 Failed to start server:', error);
    process.exit(1);
});
