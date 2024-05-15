import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
export const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const responseCache = new Map<string, string>();

export const OpenAIStream = async (prompt: string): Promise<ReadableStream> => {
  // Check if the response is already cached
  if (responseCache.has(prompt)) {
    const cachedResponse = responseCache.get(prompt)!; // Non-null assertion since we checked the existence
    const encoder = new TextEncoder();
    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(cachedResponse));
        controller.close();
      },
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that accurately answers queries related to Express Entry immigration to Canada. Use the provided information to form your answer, but avoid copying word-for-word. Try to use your own words when possible. Keep your answer concise and under 5 sentences. Be accurate, helpful, and clear.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.2,
    });

    if (completion.choices.length === 0) {
      throw new Error('No completion choices returned from OpenAI API');
    }

    const responseText = completion.choices[0]?.message?.content?.trim() || '';
    responseCache.set(prompt, responseText);

    const encoder = new TextEncoder();
    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(responseText));
        controller.close();
      },
    });
  } catch (error) {
    console.error('Error in OpenAIStream:', error);
    // Handling the error by returning a stream with an error message
    const encoder = new TextEncoder();
    return new ReadableStream({
      start(controller) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        controller.enqueue(encoder.encode(`Error: ${errorMessage}`));
        controller.close();
      },
    });
  }
};