import React, { useEffect, useState } from 'react';
import styles from './answer.module.css';

interface AnswerProps {
  text: string;
}

export const Answer: React.FC<AnswerProps> = ({ text }) => {
  const [answer, setAnswer] = useState<string>('');

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