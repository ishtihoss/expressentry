// components/SearchContainer.tsx
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";
import { ExpressEntryChunk } from "@/types";

interface SearchContainerProps {
  onSearch: (searchQuery: string) => void;
  chunks: ExpressEntryChunk[];
  answer: string;
  loading: boolean;
}

export const SearchContainer: React.FC<SearchContainerProps> = ({
  onSearch,
  chunks,
  answer,
  loading,
}) => {
  return (
    <div>
      <div className="mb-8">
        <SearchBar onSearch={onSearch} />
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
    </div>
  );
};