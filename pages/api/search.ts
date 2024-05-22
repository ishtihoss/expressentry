import { supabaseAdmin } from "@/utils";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Entering pages/api/search.ts handler');
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json() as {
      query: string;
      matches: number;
    };

    const { query, matches } = body;
    console.log('Request body:', { query, matches });

    if (!query || matches === undefined) {
      console.log("Bad request: Missing required parameters");
      return new Response("Bad request", { status: 400 });
    }

    const input = query.replace(/\n/g, " ");
    console.log('Input:', input);

    console.log("Fetching embeddings from OpenAI API...");
    const res = await fetch("https://api.openai.com/v1/embeddings", {
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

    if (!res.ok) {
      console.error("Error fetching embeddings:", res.statusText);
      return new Response("Error fetching embeddings", { status: 500 });
    }

    const json = await res.json();
    console.log('Embeddings response:', json);
    const embedding = json.data[0].embedding;
    
    console.log("Searching Express Entry chunks...");
    const { data: chunks, error } = await supabaseAdmin.rpc("express_entry_search", {
      query_embedding: embedding,
      similarity_threshold: 0.015,
      match_count: matches,
    });

    if (error) {
      console.error("Error searching Express Entry chunks:", error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    console.log("Search results:", chunks);

    return new Response(JSON.stringify(chunks), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error in /api/search:", error);
    if (error instanceof Error) {
      return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
    } else {
      return new Response("Internal Server Error", { status: 500 });
    }
  }
};

export default handler;