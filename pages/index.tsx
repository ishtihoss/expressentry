// pages/index.tsx
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SettingsModal } from "@/components/SettingsModal";
import ExpressEntryChecklist from "@/components/ExpressEntryChecklist";
import { SearchContainer } from "@/components/SearchContainer";
import { ExpressEntryChunk } from "@/types";
import endent from "endent";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

const LogoContainer = () => {
  return (
    <div className="relative inline-block">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg transform rotate-3 shadow-lg"></div>
      <div className="relative bg-white p-6 rounded-lg shadow-md">
        <Image
          src="/logo.png"
          alt="Express Entry Search Engine Logo"
          width={150}
          height={150}
          className="mx-auto"
        />
      </div>
    </div>
  );
};

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [chunks, setChunks] = useState<ExpressEntryChunk[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [matchCount, setMatchCount] = useState<number>(5);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    await handleAnswer(searchQuery);
  };

  const handleAnswer = async (searchQuery: string) => {
    if (!searchQuery) {
      alert("Please enter a query.");
      return;
    }

    setAnswer("");
    setChunks([]);

    setLoading(true);

    try {
      const searchResponse = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: searchQuery, matches: matchCount })
      });

      if (!searchResponse.ok) {
        throw new Error(searchResponse.statusText);
      }

      const results: ExpressEntryChunk[] = await searchResponse.json();
      console.log("Search API Response:", results);

      setChunks(results);

      const prompt = endent`
      Using the following passages, provide an enhanced answer to the question below. Integrate the information from the passages to support and enrich your response, but ensure the answer is not built around the passages. The passages should serve as supplementary material: "${searchQuery}"

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
        console.log("Chunk value:", chunkValue);
        setAnswer((prev) => {
          const updatedAnswer = prev + chunkValue.replace("Answer:", "").trim();
          console.log("Updated answer:", updatedAnswer);
          return updatedAnswer;
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An error occurred while fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
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

  console.log('Chunks data:', chunks);
  console.log('Answer data:', answer);

  return (
    <>
      <Head>
        <meta
          name="description"
          content={`AI-powered search engine for Express Entry immigration to Canada.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-grow p-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
              <LogoContainer />
            </div>
            <SearchContainer
              onSearch={handleSearch}
              chunks={chunks}
              answer={answer}
              loading={loading}
            />
            <ExpressEntryChecklist />
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
        className="fixed bottom-4 left-4 btn btn-primary"
        onClick={() => setShowSettings(!showSettings)}
      >
        {showSettings ? "Hide" : "Show"} Settings
      </button>
    </>
  );
}