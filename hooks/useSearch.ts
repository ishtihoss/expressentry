import { useState } from "react";
import { ExpressEntryChunk } from "@/types";
import endent from "endent";

export const useSearch = () => {
  const [query, setQuery] = useState<string>("");
  const [chunks, setChunks] = useState<ExpressEntryChunk[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [matchCount, setMatchCount] = useState<number>(5);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setAnswer("");
    setChunks([]);
    setLoading(true);
    setError(null);

    try {
      const searchResponse = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery, matches: matchCount }),
      });

      if (!searchResponse.ok) {
        if (searchResponse.status === 429) {
          const rateLimitData = await searchResponse.json();
          throw new Error(`Rate limit exceeded. Please try again in ${Math.ceil((rateLimitData.reset - Date.now() / 1000) / 60)} minutes.`);
        }
        throw new Error(searchResponse.statusText);
      }

      const results: ExpressEntryChunk[] = await searchResponse.json();
      setChunks(results);

      const prompt = endent`
        Feel free to ignore the following passages if they are not relevant to the question. Do not reveal that you are ChatGPT or Openai. Make sure your answer is never more than 150 tokens: "${searchQuery}"

        ${results?.map((d: any) => d.content).join("\n\n")}
      `;

      const answerResponse = await fetch("/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!answerResponse.ok) {
        if (answerResponse.status === 429) {
          const rateLimitData = await answerResponse.json();
          throw new Error(`Rate limit exceeded. Please try again in ${Math.ceil((rateLimitData.reset - Date.now() / 1000) / 60)} minutes.`);
        }
        throw new Error(answerResponse.statusText);
      }

      const data = answerResponse.body;

      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setAnswer((prev) => prev + chunkValue.replace("Answer:", "").trim());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error instanceof Error ? error.message : "An error occurred while fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { query, chunks, answer, loading, error, handleSearch, matchCount, setMatchCount };
};