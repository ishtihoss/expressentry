require('dotenv').config();
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAIStreaming() {
  try {
    console.log('Sending request to OpenAI...');
    
    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant...'
        },
        {
          role: 'user',
          content: 'Tell me more about streaming responses.'
        }
      ],
      max_tokens: 150,
      temperature: 0.2,
      stream: true,
    });

    // For handling streaming responses
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }

    console.log('\nStream ended.');

  } catch (error) {
    console.error('Error in testOpenAIStreaming:', error);
  }
}

testOpenAIStreaming();
