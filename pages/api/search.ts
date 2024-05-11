import { supabaseAdmin } from "@/utils";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { query, apiKey, matches } = (await req.json()) as {
      query: string;
      apiKey: string;
      matches: number;
    };

    console.log("Request body:", { query, apiKey, matches });

    if (!query || !apiKey || !matches) {
      console.log("Bad request: Missing required parameters");
      return new Response("Bad request", { status: 400 });
    }

    const input = query.replace(/\n/g, " ");

    console.log("Fetching embeddings from OpenAI API...");
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
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
    const embedding = json.data[0].embedding;
    console.log("Embeddings:", embedding);


   // Convert embedding array to JSON object correctly
const embeddingJson = JSON.stringify({ embedding: embedding.map(e => parseFloat(e)) });

    console.log("Searching Express Entry chunks...");
    const { data: chunks, error } = await supabaseAdmin.rpc("express_entry_search", {
      query_embedding: embeddingJson,
      similarity_threshold: 0.01,
      match_count: matches,
    });

    if (error) {
      console.error("Error searching Express Entry chunks:", error);
      return new Response("Error searching Express Entry chunks", { status: 500 });
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
    return new Response("Internal Server Error", { status: 500 });
  }
};

export default handler;