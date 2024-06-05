import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import OpenAI from 'openai';

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
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  // Delete all old rows from the 'chunks' table
  const { error: deleteError } = await supabase.from('chunks').delete().match({ url: { neq: null } });
  if (deleteError) {
    console.error("Error deleting old rows:", deleteError);
    return;
  }

  let rawData;
  try {
    rawData = fs.readFileSync("C:/projects/expressentry/express_entry_data.json", "utf8");
  } catch (error) {
    console.error("Error reading file:", error);
    return;
  }

  let data;
  try {
    data = JSON.parse(rawData);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return;
  }

  for (const chunk of data.chunks) {
    const { url, title, content } = chunk;

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: content,
      encoding_format: "float",
    });

    let embedding;
    if (embeddingResponse.data && embeddingResponse.data.length > 0) {
      embedding = embeddingResponse.data[0].embedding;
      // Log the embedding data
      console.log("Embedding data:", embedding);
    } else {
      console.error("Invalid embedding response structure:", embeddingResponse);
      continue;
    }

    const { data: insertData, error: insertError } = await supabase
      .from("chunks")
      .insert([{
        url,
        title,
        content,
        length: content.length,
        tokens: chunk.tokens,
        embedding: embedding
      }]);

    if (insertError) {
      console.error("Error inserting data:", insertError);
    } else if (insertData) {
      console.log("Data inserted successfully:", insertData);
    } else {
      console.log("Insertion returned no data, likely due to a configuration issue.");
    }

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