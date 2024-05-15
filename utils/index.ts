import { Configuration, OpenAIApi } from "openai";
import { createClient } from "@supabase/supabase-js";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";
import axios from "axios";

export const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration, {
  adapter: axios.create({ timeout: 60000 }),
});

const responseCache = new Map<string, string>();

export const OpenAIStream = async (prompt: string) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // Check if the response is already cached
  if (responseCache.has(prompt)) {
    const cachedResponse = responseCache.get(prompt);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(cachedResponse));
        controller.close();
      },
    });
    return stream;
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that accurately answers queries related to Express Entry immigration to Canada. Use the provided information to form your answer, but avoid copying word-for-word. Try to use your own words when possible. Keep your answer concise and under 5 sentences. Be accurate, helpful, and clear.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 150,
    temperature: 0.2,
    stream: true,
  }, { responseType: "stream" });

  let responseText = "";

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            responseCache.set(prompt, responseText);
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content || "";
            responseText += text;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            console.error("Error parsing OpenAI response:", e);
            controller.error(e);
            controller.close(); // Close the stream in case of an error
          }
        }
      };

      const parser = createParser(onParse);

      try {
        for await (const chunk of completion.data as AsyncIterable<Uint8Array>) {
          parser.feed(decoder.decode(chunk));
        }
      } catch (e) {
        console.error("Error reading OpenAI stream:", e);
        controller.error(e);
        controller.close(); // Close the stream in case of an error
      }
    },
  });

  return stream;
};