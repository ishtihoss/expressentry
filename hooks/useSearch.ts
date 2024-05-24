// hooks/useSearch.ts
import { useState } from "react";
import { ExpressEntryChunk } from "@/types";
import endent from "endent";

export const useSearch = () => {
  const [query, setQuery] = useState<string>("");
  const [chunks, setChunks] = useState<ExpressEntryChunk[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [matchCount, setMatchCount] = useState<number>(5);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setAnswer("");
    setChunks([]);
    setLoading(true);

    try {
      const searchResponse = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery, matches: matchCount }),
      });

      if (!searchResponse.ok) {
        throw new Error(searchResponse.statusText);
      }

      const results: ExpressEntryChunk[] = await searchResponse.json();
      setChunks(results);

      const prompt = endent`
        Using the following passages, provide an enhanced answer to the question below. Integrate the information from the passages to support and enrich your response, but ensure the answer is not built around the passages. The passages should serve as supplementary material: "${searchQuery}"

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
      alert("An error occurred while fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { query, chunks, answer, loading, handleSearch, matchCount, setMatchCount };
};