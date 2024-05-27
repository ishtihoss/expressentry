import React, { useEffect, useState } from 'react';
import styles from './answer.module.css';

interface AnswerProps {
  text: string;
}

export const Answer: React.FC<AnswerProps> = ({ text }) => {
  const [answer, setAnswer] = useState<string>('');

  useEffect(() => {
    const sentences = text.match(/[^.!?]+[.!?]/g);
    if (sentences) {
      const completeAnswer = sentences.join(' ');
      setAnswer(completeAnswer);
    } else {
      setAnswer(text);
    }
  }, [text]);

  return (
    <div className={styles['answer-container']}>
      <p className={styles['answer-text']}>{answer}</p>
    </div>
  );
};