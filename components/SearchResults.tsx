// components/SearchResults.tsx
import React from 'react';
import { ExpressEntryChunk } from "@/types";
import { Answer } from "@/components/Answer/Answer";

interface SearchResultsProps {
  chunks: ExpressEntryChunk[];
  answer: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ chunks, answer }) => {
  // Explicitly log the chunks to ensure they're being passed correctly
  React.useEffect(() => {
    console.log("Chunks received in SearchResults:", chunks);
  }, [chunks]); // Log whenever chunks change

  return (
    <div className="mb-8">
      {/* Display the answer if available */}
      {answer && (
        <>
          <h2 className="text-2xl font-bold mb-4">Answer</h2>
          <Answer text={answer} />
        </>
      )}

      {/* Check and display chunks if available */}
      {chunks && chunks.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-8 mb-4">Relevant Passages</h2>
          {chunks.map((chunk) => (
            <div key={chunk.id} className="mb-4 p-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md shadow-md text-white">
              <h3 className="mb-2">
                <a href={chunk.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-200 transition duration-300">
                  {chunk.title}
                </a>
              </h3>
              <p>{chunk.content}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};