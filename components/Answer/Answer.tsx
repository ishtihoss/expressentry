import React, { useEffect, useRef } from "react";
import styles from "./answer.module.css";

interface AnswerProps {
  text: string;
}

export const Answer: React.FC<AnswerProps> = ({ text }) => {
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.innerHTML = "";
      const words = text.split(" ");
      words.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        span.style.animationDelay = `${index * 0.02}s`;
        answerRef.current?.appendChild(span);
      });
    }
  }, [text]);

  return <div ref={answerRef} className={styles.answer} />;
};