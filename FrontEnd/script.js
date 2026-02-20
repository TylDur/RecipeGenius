
document.addEventListener('DOMContentLoaded', function() {
    const ingredientInput = document.getElementById('ingredientInput');
    const addIngredientBtn = document.getElementById('addIngredient');
    const ingredientsTags = document.getElementById('ingredientsTags');
    const generateRecipeBtn = document.getElementById('generateRecipe');
    const recipeDisplay = document.getElementById('recipeDisplay');
    const recipePlaceholder = document.getElementById('recipePlaceholder');
    const loadingState = document.getElementById('loadingState');

    let ingredients = [];

    function addIngredient() {
        const val = ingredientInput.value.trim().toLowerCase();
        if (val && !ingredients.includes(val)) {
            ingredients.push(val);
            renderTags();
            ingredientInput.value = '';
        }
    }

    function renderTags() {
        ingredientsTags.innerHTML = ingredients.map(ing => 
            `<span class="ingredient-tag">${ing}</span>`).join('');
    }

    function displayRecipe(recipe) {
        document.getElementById('recipeTitle').textContent = recipe.title;
        const recipeIngredients = document.getElementById('recipeIngredients');
        const recipeInstructions = document.getElementById('recipeInstructions');
        
        recipeIngredients.innerHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join('');
        
        // CLEANUP LOGIC: Removes numbers like "1." from the start of the text
        recipeInstructions.innerHTML = recipe.instructions.map((step, index) => {
            const cleanStep = step.replace(/^\d+[\.\)\s]*/, '').trim();
            return `<li class="instruction-step">
                        <span class="step-number">${index + 1}</span>
                        <span>${cleanStep}</span>
                    </li>`;
        }).join('');
    }

    generateRecipeBtn.addEventListener('click', async () => {
        if (ingredients.length === 0) return alert("Add ingredients!");
        
        recipePlaceholder.style.display = 'none';
        recipeDisplay.style.display = 'none';
        loadingState.style.display = 'block';

        try {
            const response = await fetch('http://localhost:3000/api/generate-recipe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ingredients, 
                    servings: document.getElementById('servings').value,
                    time: document.getElementById('cookingTime').value,
                    diet: document.getElementById('diet').value,
                    difficulty: document.getElementById('difficulty').value
                })
            });
            const data = await response.json();
            if (data.success) displayRecipe(data.recipe);
        } catch (e) {
            console.error(e);
        } finally {
            loadingState.style.display = 'none';
            recipeDisplay.style.display = 'block';
        }
    });

    addIngredientBtn.addEventListener('click', addIngredient);
    ingredientInput.addEventListener('keypress', e => { if(e.key === 'Enter') addIngredient(); });
});