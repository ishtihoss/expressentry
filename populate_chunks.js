require('dotenv').config();
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Read the JSON file
const jsonData = fs.readFileSync('express_entry_data.json', 'utf-8');
const data = JSON.parse(jsonData);
const chunks = data.chunks;

// Connect to your Supabase database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Insert the chunks into the database
const insertChunks = async () => {
  for (const chunk of chunks) {
    const { data, error } = await supabase
      .from('chunks')
      .insert([
        {
          url: chunk.url,
          title: chunk.title,
          content: chunk.content,
          length: chunk.length,
          tokens: chunk.tokens,
        },
      ]);

    if (error) {
      console.error('Error inserting chunk:', error);
    } else {
      console.log('Chunk inserted successfully:', data);
    }
  }
};

// Wrap the call to insertChunks in an IIFE
(async () => {
  await insertChunks();
})();