// hooks/useSettings.ts
import { useState, useEffect } from "react";
import { useSearch } from "./useSearch";

export const useSettings = () => {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const { matchCount, setMatchCount } = useSearch();

  const toggleSettings = () => setShowSettings(!showSettings);

  const handleMatchCountChange = (count: number) => {
    if (count > 10) {
      setMatchCount(10);
    } else if (count < 1) {
      setMatchCount(1);
    } else {
      setMatchCount(count);
    }
  };

  const handleSave = () => {
    localStorage.setItem("EE_MATCH_COUNT", matchCount.toString());
    setShowSettings(false);
  };

  const handleClear = () => {
    localStorage.removeItem("EE_MATCH_COUNT");
    setMatchCount(5);
  };

  useEffect(() => {
    const EE_MATCH_COUNT = localStorage.getItem("EE_MATCH_COUNT");

    if (EE_MATCH_COUNT) {
      setMatchCount(parseInt(EE_MATCH_COUNT));
    }
  }, []);

  return { showSettings, matchCount, toggleSettings, handleMatchCountChange, handleSave, handleClear };
};