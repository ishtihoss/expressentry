// pages/index.tsx
import { Answer } from "@/components/Answer/Answer";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { SettingsModal } from "@/components/SettingsModal";
import { ExpressEntryChunk } from "@/types";
import endent from "endent";
import Head from "next/head";
import Image from "next/image";
import { KeyboardEvent, useEffect, useState } from "react";

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [chunks, setChunks] = useState<ExpressEntryChunk[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [matchCount, setMatchCount] = useState<number>(5);

  const handleSearch = async () => {
    if (!query) {
      alert("Please enter a query.");
      return;
    }

    setAnswer("");
    setChunks([]);

    setLoading(true);

    const searchResponse = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, matches: matchCount })
    });

    if (!searchResponse.ok) {
      setLoading(false);
      throw new Error(searchResponse.statusText);
    }

    const results: ExpressEntryChunk[] = await searchResponse.json();

    setChunks(results);

    setLoading(false);

    return results;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAnswer();
    }
  };

  const handleAnswer = async () => {
    if (!query) {
      alert("Please enter a query.");
      return;
    }

    setAnswer("");
    setChunks([]);

    setLoading(true);

    const searchResponse = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, matches: matchCount })
    });

    if (!searchResponse.ok) {
      setLoading(false);
      throw new Error(searchResponse.statusText);
    }

    const results: ExpressEntryChunk[] = await searchResponse.json();

    setChunks(results);

    const prompt = endent`
    Use the following passages to provide an answer to the query: "${query}"

    ${results?.map((d: any) => d.content).join("\n\n")}
    `;

    const answerResponse = await fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    if (!answerResponse.ok) {
      setLoading(false);
      throw new Error(answerResponse.statusText);
    }

    const data = answerResponse.body;

    if (!data) {
      setLoading(false);
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      console.log("Chunk value:", chunkValue);
      setAnswer((prev) => {
        const updatedAnswer = prev + chunkValue.replace("Answer:","").trim();
        console.log("Updated answer:", updatedAnswer);
        return updatedAnswer;
      });
    }

    setLoading(false);
  };

  const handleSave = () => {
    localStorage.setItem("EE_MATCH_COUNT", matchCount.toString());

    setShowSettings(false);
  };

  const handleClear = () => {
    localStorage.removeItem("EE_MATCH_COUNT");

    setMatchCount(5);
  };

  useEffect(() => {
    if (matchCount > 10) {
      setMatchCount(10);
    } else if (matchCount < 1) {
      setMatchCount(1);
    }
  }, [matchCount]);

  useEffect(() => {
    const EE_MATCH_COUNT = localStorage.getItem("EE_MATCH_COUNT");

    if (EE_MATCH_COUNT) {
      setMatchCount(parseInt(EE_MATCH_COUNT));
    }
  }, []);

  return (
    <>
      <Head>
        <title>Express Entry Search Engine</title>
        <meta
          name="description"
          content={`AI-powered search engine for Express Entry immigration to Canada.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-grow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
              <Image
                src="/logo.png"
                alt="Express Entry Search Engine Logo"
                width={150}
                height={150}
                className="mx-auto"
              />
              <h1 className="text-4xl font-bold mt-4">Express Entry Search Engine</h1>
            </div>
            <div className="mb-8">
              <SearchBar
                query={query}
                onQueryChange={setQuery}
                onSearch={handleAnswer}
                onKeyDown={handleKeyDown}
              />
            </div>

            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
              </div>
            ) : answer ? (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Answer</h2>
                <Answer text={answer} />

                <h2 className="text-2xl font-bold mt-8 mb-4">Relevant Passages</h2>
                {chunks.map((chunk, index) => (
                  <div key={index} className="mb-4 p-4 bg-white rounded-md shadow">
                    <div className="mb-2">
                      <a
                        href={chunk.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {chunk.title}
                      </a>
                    </div>
                    <p>{chunk.content}</p>
                  </div>
                ))}
              </div>
            ) : chunks.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Relevant Passages</h2>
                {chunks.map((chunk, index) => (
                  <div key={index} className="mb-4 p-4 bg-white rounded-md shadow">
                    <div className="mb-2">
                      <a
                        href={chunk.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {chunk.title}
                      </a>
                    </div>
                    <p>{chunk.content}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </main>
        <Footer />
      </div>

      <SettingsModal
        show={showSettings}
        matchCount={matchCount}
        onMatchCountChange={setMatchCount}
        onSave={handleSave}
        onClear={handleClear}
      />

      <button
        className="fixed bottom-4 left-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={() => setShowSettings(!showSettings)}
      >
        {showSettings ? "Hide" : "Show"} Settings
      </button>
    </>
  );
}