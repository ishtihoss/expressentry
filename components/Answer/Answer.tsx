import React, { useEffect, useRef } from "react";
import styles from "./answer.module.css";

interface AnswerProps {
  text: string;
}

export const Answer: React.FC<AnswerProps> = ({ text }) => {
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.textContent = text;
    }
  }, [text]);

  return <div ref={answerRef} className={styles.answer} />;
};