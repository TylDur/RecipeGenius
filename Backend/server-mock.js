app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));// server-mock.js - Simple Mock Server
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Sample recipes
const recipes = [
    {
        title: "Chicken and Rice Skillet",
        time: "25 minutes",
        servings: "3-4 people",
        difficulty: "Easy",
        ingredients: [
            "500g chicken breast, cubed",
            "1 cup white rice",
            "2 tbsp olive oil",
            "3 cloves garlic, minced",
            "1 onion, chopped",
            "Salt and pepper to taste"
        ],
        instructions: [
            "Cook rice according to package instructions",
            "Heat oil in large skillet over medium heat",
            "Add chicken and cook until golden brown",
            "Add onion and garlic, cook until fragrant",
            "Mix in cooked rice and season with salt and pepper",
            "Serve hot"
        ]
    },
    {
        title: "Vegetable Stir Fry",
        time: "20 minutes",
        servings: "2-3 people",
        difficulty: "Easy",
        ingredients: [
            "2 cups mixed vegetables (broccoli, bell peppers, carrots)",
            "1 tbsp soy sauce",
            "2 cloves garlic, minced",
            "1 tbsp sesame oil",
            "1 tsp grated ginger"
        ],
        instructions: [
            "Chop all vegetables into bite-sized pieces",
            "Heat sesame oil in wok or large pan",
            "Add garlic and ginger, stir for 30 seconds",
            "Add vegetables and stir fry for 5-7 minutes",
            "Mix in soy sauce and serve hot"
        ]
    },
    {
        title: "Creamy Tomato Pasta",
        time: "30 minutes",
        servings: "3-4 people",
        difficulty: "Medium",
        ingredients: [
            "300g pasta",
            "4 large tomatoes, diced",
            "1 onion, chopped",
            "3 cloves garlic, minced",
            "1/2 cup cream",
            "Fresh basil leaves",
            "Parmesan cheese"
        ],
        instructions: [
            "Cook pasta according to package instructions",
            "Sauté onion and garlic in olive oil until soft",
            "Add tomatoes and cook for 10 minutes",
            "Stir in cream and simmer for 5 minutes",
            "Toss sauce with cooked pasta",
            "Garnish with basil and Parmesan"
        ]
    }
];

// Generate recipe endpoint
app.post('/api/generate-recipe', (req, res) => {
    const { ingredients } = req.body;
    
    if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({ 
            success: false, 
            error: 'Please add at least one ingredient' 
        });
    }
    
    // Simulate AI delay (1-2 seconds)
    setTimeout(() => {
        // Pick random recipe
        const randomRecipe = JSON.parse(JSON.stringify(
            recipes[Math.floor(Math.random() * recipes.length)]
        ));
        
        // Personalize title
        randomRecipe.title = `${randomRecipe.title} with ${ingredients[0]}`;
        
        res.json({
            success: true,
            recipe: randomRecipe,
            note: "Demo mode - works without AI"
        });
    }, 1500);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'RecipeGenius',
        mode: 'Demo',
        message: 'Server is running'
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'RecipeGenius Mock Server',
        endpoints: [
            'GET /api/health',
            'GET /api/test',
            'POST /api/generate-recipe'
        ]
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
🎉 RECIPEGENIUS MOCK SERVER
===========================
📍 URL: http://localhost:${PORT}
🤖 Mode: Demo (No API key needed)
🚀 Ready to use!

📋 Test with:
   curl http://localhost:${PORT}/api/health
   
💡 Open FrontEnd/index.html in browser
`);
});
