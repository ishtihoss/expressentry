import { IconSearch } from "@tabler/icons-react";
import { KeyboardEvent, useState, useEffect } from "react";
import { useUser } from '@supabase/auth-helpers-react';
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
  const [queryCount, setQueryCount] = useState(0);
  const user = useUser();

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/user-stats?userId=${user.id}`);
      const data = await response.json();
      setQueryCount(data.queryCount);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/save-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, userId: user.id }),
      });
      const data = await response.json();
      setQueryCount(data.queryCount);
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
      {user && (
        <div className={styles.queryCount}>
          Total queries: {queryCount}
        </div>
      )}
    </form>
  );
};