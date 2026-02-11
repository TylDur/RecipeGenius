// RecipeGenius Frontend - CLEAN VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('RecipeGenius loaded!');
    
    // DOM Elements
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
                <span class="tag-sample">Example: rice</span>
                <span class="tag-sample">Example: garlic</span>
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
    
    // Generate recipe function
    async function generateRecipe() {
        console.log('Generate button clicked!');
        
        if (ingredients.length === 0) {
            alert('Please add at least one ingredient!');
            ingredientInput.focus();
            return;
        }
        
        // Show loading, hide others
        recipePlaceholder.style.display = 'none';
        recipeDisplay.style.display = 'none';
        loadingState.style.display = 'block';
        
        // Get filter values
        const servings = document.getElementById('servings').value;
        const time = document.getElementById('cookingTime').value;
        const diet = document.getElementById('diet').value;
        const difficulty = document.getElementById('difficulty').value;
        
        console.log('Sending to backend:', {
            ingredients: ingredients,
            servings: servings,
            time: time,
            diet: diet,
            difficulty: difficulty
        });
        
        try {
            // Call backend API
            const response = await fetch('http://localhost:3000/api/generate-recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ingredients: ingredients,
                    servings: servings,
                    time: time,
                    diet: diet,
                    difficulty: difficulty
                })
            });
            
            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Backend response:', data);
            
            if (data.success) {
                displayRecipe(data.recipe);
            } else {
                throw new Error(data.error || 'Failed to generate recipe');
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
            
            // Show fallback recipe
            const fallbackRecipe = {
                title: `Fallback Recipe with ${ingredients[0]}`,
                time: '30 minutes',
                servings: '2-4 people',
                difficulty: 'Medium',
                ingredients: [
                    `${ingredients[0]}, fresh`,
                    'Salt and pepper to taste',
                    'Oil for cooking',
                    'Garlic, minced'
                ],
                instructions: [
                    `Prepare ${ingredients.join(', ')}`,
                    'Cook according to your preferred method',
                    'Season to taste',
                    'Serve hot'
                ]
            };
            
            displayRecipe(fallbackRecipe);
            
        } finally {
            loadingState.style.display = 'none';
            recipeDisplay.style.display = 'block';
        }
    }
    
    // Display recipe function
    function displayRecipe(recipe) {
        console.log('Displaying recipe:', recipe);
        
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
        alert('Recipe saved! (In a real app, this would save to your account)');
    });
    
    document.getElementById('generateNew').addEventListener('click', generateRecipe);
    
    document.getElementById('shareRecipe').addEventListener('click', function() {
        alert('Share feature coming soon!');
    });
    
    // Initialize
    updateIngredientsDisplay();
    
    console.log('All event listeners set up!');
});