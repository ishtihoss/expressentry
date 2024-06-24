import React, { useState, KeyboardEvent } from "react";
import { IconSearch } from "@tabler/icons-react";
import styles from "./searchbar.module.css";

interface SearchBarProps {
  onSearch: (searchQuery: string) => void;
  value: string;
  onChange: (value: string) => void;
}

const commonQuestions = [
  "What is Express Entry?",
  "How do I qualify for Express Entry?",
  "What are the requirements for FSWP?",
  "How long does the Express Entry process take?",
  "What is the CRS score?",
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, value, onChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() === "") return;

    setIsLoading(true);
    await onSearch(value);
    setIsLoading(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const filteredSuggestions = commonQuestions.filter(question =>
    question.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <input
        id="search-input"
        className={styles.searchInput}
        type="text"
        placeholder="E.g., What are the requirements for Express Entry?"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      <button type="submit" className={styles.searchButton} disabled={isLoading}>
        {isLoading ? (
          <div className={styles.loadingSpinner}></div>
        ) : (
          <IconSearch className={styles.searchIcon} />
        )}
      </button>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => {
                onChange(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};