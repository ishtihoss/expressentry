import { OpenAIStream } from "@/utils";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Entering pages/api/answer.ts handler');
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { prompt } = (await req.json()) as {
      prompt: string;
    };

    if (!prompt) {
      return new Response("Bad request: missing prompt", { status: 400 });
    }

    const stream = await OpenAIStream(prompt);

    if (!stream) {
      return new Response("Failed to generate response", { status: 500 });
    }

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Error in /api/answer:", error);
    if (error instanceof Error) {
      return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
    } else {
      return new Response("Internal Server Error", { status: 500 });
    }
  }
};

export default handler;
