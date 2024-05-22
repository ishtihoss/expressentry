// components/SearchResults.tsx
import React from 'react';
import { ExpressEntryChunk } from "@/types";
import { Answer } from "@/components/Answer/Answer";

interface SearchResultsProps {
  chunks: ExpressEntryChunk[];
  answer: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ chunks, answer }) => {
  // Debugging: Log the chunks to ensure they're being passed correctly
  console.log('Chunks:', chunks);

  return (
    <div className="mb-8">
      {answer && (
        <>
          <h2 className="text-2xl font-bold mb-4">Answer</h2>
          <Answer text={answer} />
        </>
      )}

      {chunks.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-8 mb-4">Relevant Passages</h2>
          {chunks.map((chunk) => (
            <div key={chunk.id} className="mb-4 p-4 bg-white rounded-md shadow"> {/* Use chunk.id for a unique key */}
              <div className="mb-2">
                <a href={chunk.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {chunk.title}
                </a>
              </div>
              <p>{chunk.content}</p>
            </div>
          ))}
        </>
      )}

      {/* Optionally, render a message or component if there are no chunks */}
      {!answer && chunks.length === 0 && (
        <p>No relevant passages found.</p>
      )}
    </div>
  );
};