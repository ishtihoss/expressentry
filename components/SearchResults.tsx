// components/SearchResults.tsx
import { ExpressEntryChunk } from "@/types";
import { Answer } from "@/components/Answer/Answer";

interface SearchResultsProps {
  chunks: ExpressEntryChunk[];
  answer: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ chunks, answer }) => {
  if (answer) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Answer</h2>
        <Answer text={answer} />

        <h2 className="text-2xl font-bold mt-8 mb-4">Relevant Passages</h2>
        {chunks.map((chunk, index) => (
          <div key={index} className="mb-4 p-4 bg-white rounded-md shadow">
            <div className="mb-2">
              <a href={chunk.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {chunk.title}
              </a>
            </div>
            <p>{chunk.content}</p>
          </div>
        ))}
      </div>
    );
  }

  if (chunks.length > 0) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Relevant Passages</h2>
        {chunks.map((chunk, index) => (
          <div key={index} className="mb-4 p-4 bg-white rounded-md shadow">
            <div className="mb-2">
              <a href={chunk.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {chunk.title}
              </a>
            </div>
            <p>{chunk.content}</p>
          </div>
        ))}
      </div>
    );
  }

  return null;
};