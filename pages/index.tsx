import { Answer } from "@/components/Answer/Answer";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ExpressEntryChunk } from "@/types";
import { IconArrowRight, IconExternalLink, IconSearch } from "@tabler/icons-react";
import endent from "endent";
import Head from "next/head";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string>("");
  const [chunks, setChunks] = useState<ExpressEntryChunk[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [matchCount, setMatchCount] = useState<number>(5);
  const [apiKey, setApiKey] = useState<string>("");

  const handleSearch = async () => {
    if (!apiKey) {
      alert("Please enter an API key.");
      return;
    }

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
      body: JSON.stringify({ query, apiKey, matches: matchCount })
    });

    if (!searchResponse.ok) {
      setLoading(false);
      throw new Error(searchResponse.statusText);
    }

    const results: ExpressEntryChunk[] = await searchResponse.json();

    setChunks(results);

    setLoading(false);

    inputRef.current?.focus();

    return results;
  };

  const handleAnswer = async () => {
    if (!apiKey) {
      alert("Please enter an API key.");
      return;
    }

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
      body: JSON.stringify({ query, apiKey, matches: matchCount })
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
      body: JSON.stringify({ prompt, apiKey })
    });

    if (!answerResponse.ok) {
      setLoading(false);
      throw new Error(answerResponse.statusText);
    }

    const data = answerResponse.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setAnswer((prev) => prev + chunkValue);
    }

    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAnswer();
    }
  };

  const handleSave = () => {
    if (apiKey.length !== 51) {
      alert("Please enter a valid API key.");
      return;
    }

    localStorage.setItem("EE_KEY", apiKey);
    localStorage.setItem("EE_MATCH_COUNT", matchCount.toString());

    setShowSettings(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    localStorage.removeItem("EE_KEY");
    localStorage.removeItem("EE_MATCH_COUNT");

    setApiKey("");
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
    const EE_KEY = localStorage.getItem("EE_KEY");
    const EE_MATCH_COUNT = localStorage.getItem("EE_MATCH_COUNT");

    if (EE_KEY) {
      setApiKey(EE_KEY);
    }

    if (EE_MATCH_COUNT) {
      setMatchCount(parseInt(EE_MATCH_COUNT));
    }

    inputRef.current?.focus();
  }, []);

  return (
    <>
      <Head>
        <title>Express Entry Chatbot</title>
        <meta
          name="description"
          content={`AI-powered chatbot for Express Entry immigration to Canada.`}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-grow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-8">Express Entry Chatbot</h1>
            <div className="mb-8">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowSettings(!showSettings)}
              >
                {showSettings ? "Hide" : "Show"} Settings
              </button>

              {showSettings && (
                <div className="mt-4 max-w-md">
                  <div className="mb-4">
                    <label htmlFor="matchCount" className="block text-gray-700 font-bold mb-2">
                      Passage Count
                    </label>
                    <input
                      type="number"
                      id="matchCount"
                      min={1}
                      max={10}
                      value={matchCount}
                      onChange={(e) => setMatchCount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="apiKey" className="block text-gray-700 font-bold mb-2">
                      OpenAI API Key
                    </label>
                    <input
                      type="password"
                      id="apiKey"
                      placeholder="OpenAI API Key"
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);

                        if (e.target.value.length !== 51) {
                          setShowSettings(true);
                        }
                      }}
                      className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                      onClick={handleClear}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            {apiKey.length === 51 ? (
              <div className="mb-8">
                <div className="relative">
                  <IconSearch className="absolute top-3 left-3 h-6 w-6 text-gray-400" />
                  <input
                    ref={inputRef}
                    className="w-full pl-12 pr-4 py-3 text-lg text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Ask a question about Express Entry..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    className="absolute right-2 top-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    onClick={handleAnswer}
                  >
                    <IconArrowRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xl text-red-500 mb-8">
                Please enter your{" "}
                <a
                  href="https://platform.openai.com/account/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  OpenAI API key
                </a>{" "}
                in the settings.
              </div>
            )}

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
                        <IconExternalLink className="inline-block ml-1 h-4 w-4" />
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
                        <IconExternalLink className="inline-block ml-1 h-4 w-4" />
                      </a>
                    </div>
                    <p>{chunk.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xl text-gray-600">
                Enter a question about Express Entry immigration to Canada and get AI-powered answers!
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}