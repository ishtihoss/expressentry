import { useState, useEffect } from 'react';

export const useQueryCount = () => {
  const [queryCount, setQueryCount] = useState(0);

  useEffect(() => {
    const storedCount = localStorage.getItem('queryCount');
    if (storedCount) {
      setQueryCount(parseInt(storedCount, 10));
    }
  }, []);

  const incrementQueryCount = () => {
    const newCount = queryCount + 1;
    setQueryCount(newCount);
    localStorage.setItem('queryCount', newCount.toString());
  };

  const resetQueryCount = () => {
    setQueryCount(0);
    localStorage.removeItem('queryCount');
  };

  return { queryCount, incrementQueryCount, resetQueryCount };
};