// RecipeGenius - JavaScript

// Waits for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('RecipeGenius loaded!');
    
    // Get DOM elements
    const ingredientInput = document.getElementById('ingredientInput');
    const addIngredientBtn = document.getElementById('addIngredient');
    const ingredientsTags = document.getElementById('ingredientsTags');
    const generateRecipeBtn = document.getElementById('generateRecipe');
    const recipePlaceholder = document.getElementById('recipePlaceholder');
    const recipeDisplay = document.getElementById('recipeDisplay');
    const loadingState = document.getElementById('loadingState');
    
    // Recipe display elements
    const recipeTitle = document.getElementById('recipeTitle');
    const recipeTime = document.getElementById('recipeTime');
    const recipeServings = document.getElementById('recipeServings');
    const recipeDifficulty = document.getElementById('recipeDifficulty');
    const recipeIngredients = document.getElementById('recipeIngredients');
    const recipeInstructions = document.getElementById('recipeInstructions');
    
    // Store ingredients
    let ingredients = [];
    
    // Sample recipes
    const sampleRecipes = [
        {
            title: "Garlic Butter Chicken with Rice",
            time: "30 minutes",
            servings: "3-4 people",
            difficulty: "Medium",
            ingredients: [
                "500g chicken breast, cubed",
                "2 cups rice",
                "3 cloves garlic, minced",
                "2 tbsp butter",
                "1 onion, chopped",
                "1 cup chicken broth",
                "Salt and pepper to taste",
                "Fresh parsley for garnish"
            ],
            instructions: [
                "Cook rice according to package instructions",
                "Season chicken with salt and pepper",
                "Heat butter in a large pan, add chicken and cook until golden",
                "Add onion and garlic, cook until fragrant",
                "Pour in chicken broth, simmer for 10 minutes",
                "Serve chicken over rice, garnish with parsley"
            ]
        },
        {
            title: "Vegetable Stir Fry",
            time: "20 minutes",
            servings: "2-3 people",
            difficulty: "Easy",
            ingredients: [
                "2 cups mixed vegetables (broccoli, bell peppers, carrots)",
                "1 tbsp olive oil",
                "2 cloves garlic, minced",
                "1 tbsp soy sauce",
                "1 tsp ginger, grated",
                "1 tbsp honey",
                "Sesame seeds for garnish"
            ],
            instructions: [
                "Chop all vegetables into bite-sized pieces",
                "Heat oil in a wok or large pan",
                "Add garlic and ginger, stir for 30 seconds",
                "Add vegetables and stir fry for 5-7 minutes",
                "Mix in soy sauce and honey",
                "Garnish with sesame seeds and serve hot"
            ]
        }
    ];
    
    // Add ingredient function
    function addIngredient() {
        const ingredient = ingredientInput.value.trim().toLowerCase();
        
        if (ingredient && !ingredients.includes(ingredient)) {
            ingredients.push(ingredient);
            updateIngredientsDisplay();
            ingredientInput.value = '';
            ingredientInput.focus();
        }
    }
    
    // Update ingredients display
    function updateIngredientsDisplay() {
        ingredientsTags.innerHTML = '';
        
        if (ingredients.length === 0) {
            ingredientsTags.innerHTML = `
                <span class="tag-sample">Example: chicken</span>
                <span class="tag-sample">Example: tomatoes</span>
            `;
            return;
        }
        
        ingredients.forEach(ingredient => {
            const tag = document.createElement('span');
            tag.className = 'ingredient-tag';
            tag.textContent = ingredient;
            
            // Click to remove
            tag.addEventListener('click', function() {
                ingredients = ingredients.filter(ing => ing !== ingredient);
                updateIngredientsDisplay();
            });
            
            ingredientsTags.appendChild(tag);
        });
    }
    
    // Generate recipe
    function generateRecipe() {
        if (ingredients.length === 0) {
            alert('Please add at least one ingredient!');
            ingredientInput.focus();
            return;
        }
        
        // Show loading, hide others
        recipePlaceholder.style.display = 'none';
        recipeDisplay.style.display = 'none';
        loadingState.style.display = 'block';
        
        // Simulate AI processing
        setTimeout(() => {
            const recipe = getGeneratedRecipe();
            displayRecipe(recipe);
            
            loadingState.style.display = 'none';
            recipeDisplay.style.display = 'block';
        }, 1500);
    }
    
    // Get generated recipe
    function getGeneratedRecipe() {
        const randomRecipe = sampleRecipes[Math.floor(Math.random() * sampleRecipes.length)];
        
        // Get filter values
        const servings = document.getElementById('servings').value;
        const time = document.getElementById('cookingTime').value;
        const diet = document.getElementById('diet').value;
        const difficulty = document.getElementById('difficulty').value;
        
        // Add user ingredients
        const userIngredients = ingredients.map(ing => 
            `${ing.charAt(0).toUpperCase() + ing.slice(1)} (from your kitchen)`
        );
        
        return {
            title: `${randomRecipe.title} with ${ingredients[0]}`,
            time: time,
            servings: servings,
            difficulty: difficulty,
            ingredients: [...userIngredients, ...randomRecipe.ingredients.slice(2)],
            instructions: randomRecipe.instructions
        };
    }
    
    // Display recipe
    function displayRecipe(recipe) {
        recipeTitle.textContent = recipe.title;
        recipeTime.textContent = recipe.time;
        recipeServings.textContent = recipe.servings;
        recipeDifficulty.textContent = recipe.difficulty;
        
        // Clear and add ingredients
        recipeIngredients.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            recipeIngredients.appendChild(li);
        });
        
        // Clear and add instructions
        recipeInstructions.innerHTML = '';
        recipe.instructions.forEach((step, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${step}`;
            recipeInstructions.appendChild(li);
        });
    }
    
    // Event listeners
    addIngredientBtn.addEventListener('click', addIngredient);
    
    ingredientInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addIngredient();
        }
    });
    
    generateRecipeBtn.addEventListener('click', generateRecipe);
    
    // Sample buttons
    document.querySelectorAll('.sample-btn').forEach(button => {
        button.addEventListener('click', function() {
            const sampleIngredients = this.getAttribute('data-ingredients').split(', ');
            ingredients = sampleIngredients;
            updateIngredientsDisplay();
            
            // Auto generate after 1 second
            setTimeout(generateRecipe, 1000);
        });
    });
    
    // Recipe action buttons
    document.getElementById('saveRecipe').addEventListener('click', function() {
        alert('Recipe saved!');
    });
    
    document.getElementById('generateNew').addEventListener('click', generateRecipe);
    
    document.getElementById('shareRecipe').addEventListener('click', function() {
        alert('Share feature coming soon!');
    });
    
    // Initialize
    updateIngredientsDisplay();
});
