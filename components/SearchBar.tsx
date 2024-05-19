// components/SearchBar.tsx
import { IconSearch } from "@tabler/icons-react";
import { KeyboardEvent, useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/save-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      onSearch(query);
    } catch (error) {
      console.error("Error saving query:", error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        className="w-full pl-12 pr-20 py-3 text-lg text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        placeholder="Ask a question about Express Entry..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="submit"
        className="absolute right-2 top-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        <IconSearch className="h-6 w-6" />
      </button>
    </form>
  );
};