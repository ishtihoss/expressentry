// components/SearchBar.tsx
import { IconSearch } from "@tabler/icons-react";
import { KeyboardEvent } from "react";

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  onSearch,
  onKeyDown,
}) => {
  return (
    <div className="relative">
      <input
        className="w-full pl-12 pr-20 py-3 text-lg text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        placeholder="Ask a question about Express Entry..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button
        className="absolute right-2 top-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={onSearch}
      >
        <IconSearch className="h-6 w-6" />
      </button>
    </div>
  );
};