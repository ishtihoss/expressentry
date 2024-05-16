require('dotenv').config();
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant...',
        },
        {
          role: 'user',
          content: 'What is Express Entry?',
        },
      ],
      max_tokens: 150,
      temperature: 0.2,
    });

    if (completion.choices.length === 0) {
      throw new Error('No completion choices returned from OpenAI API');
    }

    const responseText = completion.choices[0].message.content.trim();
    console.log('Test Result:', responseText);
  } catch (error) {
    console.error('Error in testOpenAI:', error);
  }
}

testOpenAI();