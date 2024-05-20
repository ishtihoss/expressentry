import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
export const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const responseCache = new Map<string, string>();

export const OpenAIStream = async (prompt: string): Promise<string> => {
  // Check if the response is already cached
  if (responseCache.has(prompt)) {
    return responseCache.get(prompt)!; // Non-null assertion since we checked the existence
  }

  try {
    const completion = await openai.chat.completions.create({
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
    });

    if (!completion || !completion.choices || completion.choices.length === 0) {
      throw new Error('No completion choices returned from OpenAI API');
    }

    const responseText = completion.choices[0]?.message?.content?.trim() || '';
    responseCache.set(prompt, responseText);

    console.log('OpenAI API Response:', responseText); // logging the response to the console

    return responseText;
  } catch (error) {
    console.error('Error in OpenAIStream:', error);
    // Handling the error by returning an error message
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return `Error: ${errorMessage}`;
  }
};