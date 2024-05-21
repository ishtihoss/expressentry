// pages/index.tsx
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { SearchResults } from "@/components/SearchResults";
import { SettingsModal } from "@/components/SettingsModal";
import { ExpressEntryChunk } from "@/types";
import endent from "endent";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ExpressEntryChecklist = () => {
  const [selectedStream, setSelectedStream] = useState('');

  const streams = ['FSWP', 'FSTP', 'CEC', 'PNP'];

  const checklists = {
    FSWP: [
      'Passport or travel document',
      'Language test results',
      'Educational Credential Assessment (ECA)',
      'Proof of Canadian education or foreign credentials',
      'Proof of funds',
      'Proof of work experience',
      'Provincial nomination (if applicable)',
      'Written job offer from a Canadian employer (if applicable)',
      'Police certificates',
      'Medical exams',
      'Birth certificates (for dependent children, if applicable)',
      'Marriage or divorce certificates (if applicable)',
      'Adoption certificate (if applicable)',
      'Common-law union form (if applicable)',
    ],
    FSTP: [
      'Passport or travel document',
      'Language test results',
      'Proof of Canadian education or foreign credentials',
      'Proof of funds',
      'Proof of work experience',
      'Certificate of qualification in a skilled trade issued by a Canadian province or territory',
      'Provincial nomination (if applicable)',
      'Written job offer from a Canadian employer (if applicable)',
      'Police certificates',
      'Medical exams',
      'Birth certificates (for dependent children, if applicable)',
      'Marriage or divorce certificates (if applicable)',
      'Adoption certificate (if applicable)',
      'Common-law union form (if applicable)',
    ],
    CEC: [
      'Passport or travel document',
      'Language test results',
      'Proof of Canadian education or foreign credentials (if applicable)',
      'Proof of Canadian work experience',
      'Provincial nomination (if applicable)',
      'Written job offer from a Canadian employer (if applicable)',
      'Police certificates',
      'Medical exams',
      'Birth certificates (for dependent children, if applicable)',
      'Marriage or divorce certificates (if applicable)',
      'Adoption certificate (if applicable)',
      'Common-law union form (if applicable)',
    ],
    PNP: [
      'Passport or travel document',
      'Language test results',
      'Educational Credential Assessment (ECA) (if applicable)',
      'Proof of Canadian education or foreign credentials',
      'Proof of funds',
      'Proof of work experience',
      'Provincial nomination certificate',
      'Written job offer from a Canadian employer (if applicable)',
      'Police certificates',
      'Medical exams',
      'Birth certificates (for dependent children, if applicable)',
      'Marriage or divorce certificates (if applicable)',
      'Adoption certificate (if applicable)',
      'Common-law union form (if applicable)',
    ],
  };

  const handleStreamClick = (stream: string) => {
    setSelectedStream(stream);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const checklistVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  return (
    <motion.div
      className="container mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl font-bold mb-4 text-primary">Express Entry Checklist</h1>
      <div className="flex justify-center mb-8">
        {streams.map((stream) => (
          <motion.button
            key={stream}
            className={`px-4 py-2 rounded-md ${
              selectedStream === stream ? 'bg-primary text-white' : 'bg-background'
            }`}
            onClick={() => handleStreamClick(stream)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {stream}
          </motion.button>
        ))}
      </div>
      {selectedStream && (
        <motion.div variants={checklistVariants} initial="hidden" animate="visible">
          <h2 className="text-xl font-bold mb-2 text-primary-dark">{selectedStream} Checklist</h2>
          <ul className="space-y-2">
            {checklists[selectedStream].map((item, index) => (
              <li key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`item-${index}`}
                  className="mr-2"
                />
                <label htmlFor={`item-${index}`} className="text-gray-700">{item}</label>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
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

    const searchResponse = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: searchQuery, matches: matchCount })
    });

    if (!searchResponse.ok) {
      setLoading(false);
      throw new Error(searchResponse.statusText);
    }

    const results: ExpressEntryChunk[] = await searchResponse.json();

    setChunks(results);

    const prompt = endent`
    Use the following passages to provide an answer to the query: "${searchQuery}"

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
        const updatedAnswer = prev + chunkValue.replace("Answer:", "").trim();
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
              <Image
                src="/logo.png"
                alt="Express Entry Search Engine Logo"
                width={150}
                height={150}
                className="mx-auto"
              />
            </div>
            <div className="mb-8">
              <SearchBar onSearch={handleSearch} />
            </div>

            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
              </div>
            ) : (
              <SearchResults chunks={chunks} answer={answer} />
            )}

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