// list-models.js - Check available models
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    try {
        console.log('🔍 Listing available models...');
        console.log('API Key exists:', !!process.env.GOOGLE_API_KEY);
        
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        
        console.log('\n📞 Calling Google API...');
        const models = await genAI.listModels();
        
        console.log('\n✅ AVAILABLE MODELS:');
        console.log('=====================');
        
        models.models.forEach((model, index) => {
            console.log(`\n${index + 1}. ${model.name}`);
            console.log(`   Display: ${model.displayName}`);
            console.log(`   Description: ${model.description || 'N/A'}`);
            if (model.supportedGenerationMethods && model.supportedGenerationMethods.length > 0) {
                console.log(`   Methods: ${model.supportedGenerationMethods.join(', ')}`);
            }
        });
        
        console.log('\n🎯 MODELS SUPPORTING generateContent:');
        const generateModels = models.models.filter(m => 
            m.supportedGenerationMethods?.includes('generateContent')
        );
        
        if (generateModels.length > 0) {
            generateModels.forEach(m => {
                console.log(`   - ${m.name} (${m.displayName})`);
            });
        } else {
            console.log('   No models support generateContent');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\n💡 TROUBLESHOOTING:');
        console.error('1. Check API key at https://makersuite.google.com/app/apikey');
        console.error('2. Enable Gemini API at https://console.cloud.google.com/apis/library');
        console.error('3. Wait 5 minutes after enabling');
        console.error('4. Try a new API key');
    }
}

listModels();const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listAvailableModels() {
    try {
        console.log('🔍 Fetching available models...');
        console.log('API Key exists:', !!process.env.GOOGLE_API_KEY);
        
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        
        // List all available models
        const models = await genAI.listModels();
        
        console.log('\n✅ AVAILABLE MODELS:');
        console.log('====================');
        
        models.models.forEach((model, index) => {
            console.log(`\n${index + 1}. ${model.name}`);
            console.log(`   Display: ${model.displayName}`);
            console.log(`   Description: ${model.description || 'N/A'}`);
            console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        });
        
        console.log('\n📌 RECOMMENDED FOR TEXT:');
        const textModels = models.models.filter(m => 
            m.supportedGenerationMethods?.includes('generateContent')
        );
        textModels.forEach(m => console.log(`   - ${m.name} (${m.displayName})`));
        
    } catch (error) {
        console.error('❌ Error listing models:', error.message);
    }
}

listAvailableModels();
