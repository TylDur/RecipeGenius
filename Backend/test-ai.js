// test-ai.js
fetch('http://localhost:3000/api/generate-recipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        ingredients: ["chicken", "rice", "broccoli"],
        servings: "3-4 people",
        time: "30 minutes",
        diet: "Any",
        difficulty: "Medium"
    })
})
.then(response => response.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(error => console.error('Error:', error));
