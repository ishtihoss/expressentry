import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
export const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const responseCache = new Map<string, string>();

export const OpenAIStream = async (prompt: string): Promise<ReadableStream> => {
  console.log('Entering OpenAIStream function');
  // Check if the response is already cached
  if (responseCache.has(prompt)) {
    const cachedResponse = responseCache.get(prompt)!;
    return new ReadableStream({
      start(controller) {
        controller.enqueue(cachedResponse);
        controller.close();
      },
    });
  }

  try {
    console.log('Calling OpenAI API with prompt:', prompt);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: "Answer questions related to Canada's express entry system. Give exact, specific and precise answers under five sentences.",
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.2,
      stream: true, // Enable streaming
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(text);
        }
        controller.close();
      },
    });

    return stream;
  } catch (error) {
    console.error('Error in OpenAIStream:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new ReadableStream({
      start(controller) {
        controller.enqueue(`Error: ${errorMessage}`);
        controller.close();
      },
    });
  }
};