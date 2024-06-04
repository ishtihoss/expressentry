import { IconSearch } from "@tabler/icons-react";
import { KeyboardEvent, useState } from "react";
import styles from "./searchbar.module.css";

declare global {
  function gtag_report_conversion(url?: string): void;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetch("/api/save-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      onSearch(query);
      // Call the gtag_report_conversion function when the search button is clicked
      gtag_report_conversion();
    } catch (error) {
      console.error("Error saving query:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <input
        id="search-input"
        className={styles.searchInput}
        type="text"
        placeholder="Ask a question about Express Entry..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" className={styles.searchButton}>
        <IconSearch className={styles.searchIcon} />
      </button>
      {isLoading && (
        <div className={styles.equalizerContainer}>
          <div className={styles.equalizer}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </form>
  );
};