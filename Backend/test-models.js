// test-models.js - Test different model names
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const modelsToTest = [
    // Try without -latest suffix
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-1.0-pro',
    
    // Try with models/ prefix
    'models/gemini-1.5-flash',
    'models/gemini-1.5-pro',
    'models/gemini-1.0-pro',
    
    // Try older versions
    'gemini-pro-vision',
    'models/gemini-pro',
    
    // Try different API versions
    'gemini-1.5-flash-001',
    'gemini-1.5-pro-001',
];

async function testModel(modelName) {
    try {
        console.log(`\n🧪 Testing: ${modelName}`);
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent('Say "Hello" in one word');
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ ${modelName} WORKS! Response: "${text}"`);
        return { model: modelName, works: true, response: text };
        
    } catch (error) {
        console.log(`❌ ${modelName} FAILED: ${error.message.split('\n')[0]}`);
        return { model: modelName, works: false, error: error.message };
    }
}

async function runTests() {
    console.log('🔍 Testing Google Gemini Models');
    console.log('API Key length:', process.env.GOOGLE_API_KEY?.length);
    
    const results = [];
    for (const model of modelsToTest) {
        const result = await testModel(model);
        results.push(result);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    }
    
    console.log('\n📊 RESULTS:');
    const working = results.filter(r => r.works);
    if (working.length > 0) {
        console.log('✅ WORKING MODELS:');
        working.forEach(r => console.log(`   - ${r.model}`));
        
        // Save working model to file
        const fs = require('fs');
        fs.writeFileSync('working-model.txt', working[0].model);
        console.log(`\n💾 Saved working model to: working-model.txt`);
        
    } else {
        console.log('❌ No models work. Issues:');
        console.log('   1. API key might be invalid');
        console.log('   2. Gemini API not enabled');
        console.log('   3. Region restrictions');
        console.log('\n🔧 SOLUTIONS:');
        console.log('   A. Get new key: https://makersuite.google.com/app/apikey');
        console.log('   B. Enable API: https://console.cloud.google.com/apis/library');
    }
}

runTests();
