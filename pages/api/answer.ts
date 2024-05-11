import { OpenAIStream } from "@/utils";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { prompt, apiKey } = (await req.json()) as {
      prompt: string;
      apiKey: string;
    };

    if (!prompt || !apiKey) {
      return new Response("Bad request", { status: 400 });
    }

    const stream = await OpenAIStream(prompt, apiKey);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in /api/answer:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export default handler;