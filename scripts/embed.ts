import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';

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
  // Initialize OpenAI and Supabase clients
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);
  const supabase: SupabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  // Read the data file
  const rawData = fs.readFileSync("C:/projects/express-entry-chatbot/express_entry_data.json", "utf8");
  const data = JSON.parse(rawData);

  // Iterate over each chunk in the data file
  for (const chunk of data.chunks) {
    const { url, title, content } = chunk;

    // Generate embedding for the content
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: content
    });

    const embedding = embeddingResponse.data.data[0].embedding;

    const { data: insertData, error } = await supabase
    .from("chunks")
    .insert({
      url,
      title,
      content,
      length: chunk.length,
      tokens: chunk.tokens,
      embedding
    })
    .select();
  
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