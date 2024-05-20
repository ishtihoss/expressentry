require('dotenv').config();
const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const responseCache = new Map();

const OpenAIStream = async (prompt) => {
  // Check if the response is already cached
  if (responseCache.has(prompt)) {
    console.log('Returning cached response');
    return responseCache.get(prompt); // Non-null assertion since we checked the existence
  }

  try {
    console.log('Sending request to OpenAI...');

    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that accurately answers queries related to Express Entry immigration to Canada. Search the web for answers, but avoid copying word-for-word. Provide high quality reference links when possible. Keep your answer concise and under 5 sentences. Be accurate, helpful, and clear.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.2,
      stream: true,
    });

    let responseText = '';

    // For handling streaming responses
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(content);
      responseText += content;
    }

    console.log('\nStream ended.');
    responseCache.set(prompt, responseText); // Cache the complete response

    return responseText;
  } catch (error) {
    console.error('Error in OpenAIStream:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return `Error: ${errorMessage}`;
  }
};

// Test the function with a prompt
OpenAIStream('Tell me about the Express Entry to Canada.')
  .then((response) => {
    console.log('\nComplete response:', response);
  })
  .catch((error) => {
    console.error('Failed to test OpenAIStream:', error);
  });