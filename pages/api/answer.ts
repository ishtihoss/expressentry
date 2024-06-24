import { OpenAIStream } from "@/utils";
import { rateLimiter } from "@/utils/rateLimiter";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Entering pages/api/answer.ts handler');
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Apply rate limiting
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success, limit, remaining, reset } = await rateLimiter(ip);

    if (!success) {
      return new Response(JSON.stringify({
        error: "Rate limit exceeded",
        limit,
        remaining,
        reset
      }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString()
        }
      });
    }

    const { prompt } = (await req.json()) as {
      prompt: string;
    };

    if (!prompt) {
      return new Response("Bad request: missing prompt", { status: 400 });
    }

    const answer = await OpenAIStream(prompt);

    const sentences = answer.match(/[^.!?]+[.!?]/g);
    const completeAnswer = sentences ? sentences.join(' ') : answer;

    return new Response(completeAnswer, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache, no-transform",
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString()
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