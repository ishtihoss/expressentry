import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";
import { ExpressEntryChunk } from "@/types";

interface SearchContainerProps {
  onSearch: (searchQuery: string) => void;
  chunks: ExpressEntryChunk[];
  answer: string;
  loading: boolean;
  error: string | null;
  remainingQueries?: number;
  showSignInPrompt: boolean;
}

export const SearchContainer: React.FC<SearchContainerProps> = ({
  onSearch,
  chunks,
  answer,
  loading,
  error,
  remainingQueries,
  showSignInPrompt
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const popularTopics = ["FSWP", "FSTP", "CEC", "PNP"];

  const handleTopicClick = (topic: string) => {
    setSearchQuery(`Tell me about the ${topic} program`);
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">How it works</h2>
      <ul className="list-disc list-inside text-gray-700 mb-6">
        <li>Ask any question about Express Entry</li>
        <li>Get instant answers from our AI-powered search engine</li>
        <li>Access official information and guidelines</li>
        <li>Stay updated with the latest Express Entry changes</li>
      </ul>

      <SearchBar onSearch={onSearch} value={searchQuery} onChange={setSearchQuery} />

      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {popularTopics.map((topic) => (
          <button
            key={topic}
            onClick={() => handleTopicClick(topic)}
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-200"
          >
            {topic}
          </button>
        ))}
      </div>

      {remainingQueries !== undefined && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            {remainingQueries} free {remainingQueries === 1 ? 'query' : 'queries'} remaining
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(remainingQueries / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {showSignInPrompt && (
        <div className="mt-4 p-4 bg-yellow-100 rounded-md">
          <p className="text-sm text-yellow-700">
            You have reached the limit of free queries. Please sign in to continue using the app.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
          <button
            onClick={() => onSearch(searchQuery)}
            className="ml-2 underline hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse mt-4">
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
        </div>
      ) : (
        chunks.length > 0 || answer ? (
          <SearchResults chunks={chunks} answer={answer} />
        ) : null
      )}
    </div>
  );
};