import React, { useEffect, useState } from 'react';
import styles from './answer.module.css';

export const Answer = ({ text }) => {
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    setAnswer(text);
  }, [text]);

  return (
    <div className={styles['answer-container']}>
      <h2 className={styles['answer-heading']}>Answer:</h2>
      <p className={styles['answer-text']}>{answer}</p>
    </div>
  );
};