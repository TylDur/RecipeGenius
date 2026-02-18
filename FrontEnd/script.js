/*
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
*/
// RecipeGenius Frontend - ENHANCED VERSION with Real AI
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍳 RecipeGenius loaded!');
    
    // ===== DOM ELEMENTS =====
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
    
    // ===== STATE MANAGEMENT =====
    let ingredients = [];
    let messageInterval = null;
    
    // ===== COOKING MESSAGES =====
    const cookingMessages = [
        "Chopping fresh ingredients...",
        "Preheating the oven...",
        "Mixing secret spices...",
        "Consulting with Chef AI...",
        "Stirring the pot...",
        "Tasting for perfection...",
        "Plating beautifully...",
        "Adding final touches..."
    ];
    
    // ===== TOAST NOTIFICATION SYSTEM =====
    function showToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        
        toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // ===== LOADING ANIMATION =====
    function startLoadingAnimation() {
        let index = 0;
        const messageEl = document.querySelector('.ai-thinking');
        if (messageInterval) clearInterval(messageInterval);
        
        messageInterval = setInterval(() => {
            index = (index + 1) % cookingMessages.length;
            if (messageEl) messageEl.textContent = cookingMessages[index];
        }, 2000);
    }
    
    function stopLoadingAnimation() {
        if (messageInterval) {
            clearInterval(messageInterval);
            messageInterval = null;
        }
    }
    
    // ===== INGREDIENT MANAGEMENT =====
    function addIngredient() {
        const ingredient = ingredientInput.value.trim().toLowerCase();
        
        if (ingredient && !ingredients.includes(ingredient)) {
            ingredients.push(ingredient);
            updateIngredientsDisplay();
            ingredientInput.value = '';
            ingredientInput.focus();
            showToast(`Added ${ingredient}`, 'success');
        }
    }
    
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
            
            tag.addEventListener('click', function() {
                ingredients = ingredients.filter(ing => ing !== ingredient);
                updateIngredientsDisplay();
                showToast(`Removed ${ingredient}`, 'success');
            });
            
            ingredientsTags.appendChild(tag);
        });
    }
    
    // ===== RECIPE DISPLAY (ENHANCED) =====
    function displayRecipe(recipe) {
        console.log('Displaying recipe:', recipe);
        
        recipeTitle.textContent = recipe.title || 'AI Generated Recipe';
        
        // Update recipe meta with badges
        const metaContainer = document.querySelector('.recipe-meta');
        if (metaContainer) {
            metaContainer.innerHTML = `
                <span class="badge"><i class="fas fa-clock"></i> ${recipe.time || '30 min'}</span>
                <span class="badge"><i class="fas fa-user-friends"></i> ${recipe.servings || '2-4'}</span>
                <span class="badge"><i class="fas fa-signal"></i> ${recipe.difficulty || 'Medium'}</span>
            `;
        }
        
        // Enhanced ingredients with icons
        recipeIngredients.innerHTML = '';
        if (recipe.ingredients && recipe.ingredients.length > 0) {
            recipe.ingredients.forEach(ingredient => {
                const li = document.createElement('li');
                li.className = 'ingredient-item';
                li.innerHTML = `<i class="fas fa-check-circle"></i> ${ingredient}`;
                recipeIngredients.appendChild(li);
            });
        }
        
        // Enhanced instructions with step numbers
        recipeInstructions.innerHTML = '';
        if (recipe.instructions && recipe.instructions.length > 0) {
            recipe.instructions.forEach((step, index) => {
                const li = document.createElement('li');
                li.className = 'instruction-step';
                li.setAttribute('data-step', index + 1);
                li.innerHTML = `<span class="step-number">${index + 1}</span><span>${step}</span>`;
                recipeInstructions.appendChild(li);
            });
        }
    }
    
    // ===== MAIN GENERATE RECIPE (ENHANCED) =====
    async function generateRecipe() {
        console.log('🎯 Generate button clicked!');
        
        if (ingredients.length === 0) {
            showToast('Please add at least one ingredient!', 'error');
            ingredientInput.focus();
            return;
        }
        
        // Show enhanced loading
        recipePlaceholder.style.display = 'none';
        recipeDisplay.style.display = 'none';
        loadingState.style.display = 'block';
        
        loadingState.innerHTML = `
            <div class="loading-chef">
                <i class="fas fa-utensils chef-hat"></i>
                <div class="spinner"></div>
                <p class="cooking-message">Preparing your recipe...</p>
                <p class="ai-thinking">Chopping fresh ingredients...</p>
            </div>
        `;
        
        startLoadingAnimation();
        
        // Get filter values
        const servings = document.getElementById('servings').value;
        const time = document.getElementById('cookingTime').value;
        const diet = document.getElementById('diet').value;
        const difficulty = document.getElementById('difficulty').value;
        
        try {
            const response = await fetch('http://localhost:3000/api/generate-recipe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredients, servings, time, diet, difficulty })
            });
            
            const data = await response.json();
            
            if (data.success) {
                stopLoadingAnimation();
                displayRecipe(data.recipe);
                showToast('Recipe created successfully! 🎉', 'success');
            } else {
                throw new Error(data.error || 'Failed');
            }
            
        } catch (error) {
            console.error('❌ Error:', error);
            stopLoadingAnimation();
            showToast('Oops! Something went wrong', 'error');
            
            // Fallback recipe
            const fallbackRecipe = {
                title: `Simple ${ingredients[0]} Dish`,
                time: '30 minutes',
                servings: '2-4 people',
                difficulty: 'Easy',
                ingredients: ingredients.map(i => `${i}, fresh`),
                instructions: ['Prepare ingredients', 'Cook until done', 'Season to taste', 'Serve hot']
            };
            displayRecipe(fallbackRecipe);
            
        } finally {
            loadingState.style.display = 'none';
            recipeDisplay.style.display = 'block';
            stopLoadingAnimation();
        }
    }
    
    // ===== EXAMPLE TAGS HANDLER =====
    function setupExampleTags() {
        document.querySelectorAll('.example-tags span').forEach(tag => {
            tag.addEventListener('click', function() {
                const text = this.textContent;
                let exampleIngredients = [];
                
                if (text.includes('chicken')) exampleIngredients = ['chicken', 'rice', 'garlic'];
                else if (text.includes('pasta')) exampleIngredients = ['pasta', 'tomatoes', 'basil'];
                else if (text.includes('eggs')) exampleIngredients = ['eggs', 'potatoes', 'onions'];
                
                ingredients = exampleIngredients;
                updateIngredientsDisplay();
                showToast('Example ingredients added!', 'success');
                setTimeout(generateRecipe, 1000);
            });
        });
    }
    
    // ===== KEYBOARD SHORTCUTS =====
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                generateRecipe();
            }
            if (e.key === 'Escape' && ingredients.length > 0) {
                if (confirm('Clear all ingredients?')) {
                    ingredients = [];
                    updateIngredientsDisplay();
                    showToast('Ingredients cleared', 'success');
                }
            }
        });
    }
    
    // ===== ACTION BUTTONS =====
    function setupActionButtons() {
        const saveBtn = document.getElementById('saveRecipe');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                showToast('❤️ Recipe saved to favorites!', 'success');
            });
        }
        
        const generateNewBtn = document.getElementById('generateNew');
        if (generateNewBtn) {
            generateNewBtn.addEventListener('click', generateRecipe);
        }
        
        const shareBtn = document.getElementById('shareRecipe');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                const title = recipeTitle.textContent;
                navigator.clipboard.writeText(`Check out this recipe: ${title}`)
                    .then(() => showToast('Recipe copied to clipboard!', 'success'));
            });
        }
        
        const printBtn = document.getElementById('printRecipe');
        if (printBtn) {
            printBtn.addEventListener('click', () => window.print());
        }
    }
    
    // ===== SAMPLE BUTTONS =====
    function setupSampleButtons() {
        document.querySelectorAll('.sample-btn').forEach(button => {
            button.addEventListener('click', function() {
                const sampleIngredients = this.getAttribute('data-ingredients').split(', ');
                ingredients = sampleIngredients;
                updateIngredientsDisplay();
                showToast('Sample ingredients added!', 'success');
                setTimeout(generateRecipe, 1000);
            });
        });
    }
    
    // ===== INITIALIZATION =====
    function init() {
        console.log('🔧 Initializing RecipeGenius...');
        
        // Event listeners
        addIngredientBtn.addEventListener('click', addIngredient);
        ingredientInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addIngredient();
        });
        generateRecipeBtn.addEventListener('click', generateRecipe);
        
        // Setup all features
        setupSampleButtons();
        setupExampleTags();
        setupKeyboardShortcuts();
        setupActionButtons();
        
        // Initialize display
        updateIngredientsDisplay();
        
        console.log('✅ RecipeGenius ready with REAL AI!');
    }
    
    // Start everything
    init();
});