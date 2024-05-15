import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import OpenAI from 'openai';

// Load environment variables
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.env.PROJECT_ROOT || '');

interface Chunk {
  url: string;
  title: string;
  content: string;
  length: number;
  tokens: number;
}

const generateAndPopulateChunks = async () => {
  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Initialize Supabase client
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  // Read the data file
  const rawData = fs.readFileSync("C:/projects/express-entry-chatbot/express_entry_data.json", "utf8");
  const data = JSON.parse(rawData);

  // Iterate over each chunk in the data file
  for (const chunk of data.chunks) {
    const { url, title, content } = chunk;

    // Generate embedding for the content using the new model
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: content,
      encoding_format: "float", // Ensure this matches the expected format for your use case
    });

    // Extract the embedding, adjust based on the actual response structure
    let embedding;
    if (embeddingResponse.data && embeddingResponse.data.length > 0) {
      embedding = embeddingResponse.data[0].embedding;
    } else {
      console.error("Invalid embedding response structure:", embeddingResponse);
      continue; // Skip to the next iteration if the structure is not as expected
    }

    // Insert data into Supabase
    const { data: insertData, error } = await supabase
      .from("chunks")
      .insert([{
        url,
        title,
        content,
        length: content.length, // Assuming length refers to content's length
        tokens: chunk.tokens,
        embedding: embedding
      }]);

    if (error) {
      console.error("Error inserting data:", error);
    } else if (insertData) {
      console.log("Data inserted successfully:", insertData);
    } else {
      console.log("Insertion returned no data, likely due to a configuration issue.");
    }

    // Throttle requests to avoid hitting rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }
};

(async () => {
  try {
    await generateAndPopulateChunks();
    console.log("All data processed and inserted.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();