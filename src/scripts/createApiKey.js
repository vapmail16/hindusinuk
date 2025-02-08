const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

async function createApiKey() {
  try {
    const key = await openai.apiKeys.create();
    console.log('New API Key:', key.key);
  } catch (error) {
    console.error('Error creating API key:', error);
  }
}

createApiKey(); 