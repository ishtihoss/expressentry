import { supabaseAdmin } from "@/utils";

export const config = {
  runtime: "edge",
};

type ChunkId = {
  id: number;
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Entering pages/api/search.ts handler');
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const { query, matches } = body;

    console.log('Request body:', { query, matches });

    if (!query || typeof matches !== 'number') {
      console.log("Bad request: Missing required parameters");
      return new Response("Bad request", { status: 400 });
    }

    const input = query.replace(/\n/g, " ");
    console.log('Input:', input);

    console.log("Fetching embeddings from OpenAI API...");
    const openAIResponse = await fetch("https://api.openai.com/v1/embeddings", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: "text-embedding-ada-002",
        input,
      }),
    });

    if (!openAIResponse.ok) {
      console.error("Error fetching embeddings:", openAIResponse.statusText);
      return new Response("Error fetching embeddings", { status: 500 });
    }

    const json = await openAIResponse.json();
    console.log('Full OpenAI API Response:', JSON.stringify(json, null, 2));

    // Verify the structure of the response and extract the embedding
    if (!json.data || !json.data[0] || !json.data[0].embedding) {
      console.error("Unexpected OpenAI API response structure:", JSON.stringify(json, null, 2));
      return new Response("Error processing embeddings", { status: 500 });
    }
    const embedding = json.data[0].embedding;
   
    console.log("Searching Express Entry chunks...");
    const { data: chunkIds, error } = await supabaseAdmin.rpc("express_entry_search", {
      query_embedding: embedding,
      similarity_threshold: 0.015,
      match_count: matches,
    });

    if (error) {
      console.error("Error searching Express Entry chunks:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    // Fetch full chunk data for each id
    const chunks = await Promise.all(chunkIds.map(async ({ id }) => {
      const { data: chunk, error } = await supabaseAdmin
        .from('chunks') // Replace with your table name
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Error fetching chunk with id ${id}:`, error);
        // Handle error appropriately
      }

      return chunk;
    }));

    console.log("Search results:", chunks);
    return new Response(JSON.stringify(chunks), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error in /api/search:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export default handler;