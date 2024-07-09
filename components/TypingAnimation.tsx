import React, { useState, useEffect, useCallback } from "react";

interface TypingAnimationProps {
  lines: string[];
  typingSpeed?: number;
  lineDelay?: number;
  loop?: boolean;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  lines,
  typingSpeed = 50,
  lineDelay = 1000,
  loop = false,
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const typeNextChar = useCallback(() => {
    const currentLine = lines[currentLineIndex];
    if (displayedText.length < currentLine.length) {
      setDisplayedText(currentLine.slice(0, displayedText.length + 1));
    } else {
      setIsTyping(false);
      setTimeout(() => {
        if (currentLineIndex < lines.length - 1) {
          setCurrentLineIndex((prev) => prev + 1);
          setDisplayedText("");
          setIsTyping(true);
        } else if (loop) {
          setCurrentLineIndex(0);
          setDisplayedText("");
          setIsTyping(true);
        }
      }, lineDelay);
    }
  }, [currentLineIndex, displayedText, lines, lineDelay, loop]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTyping) {
      timer = setTimeout(typeNextChar, typingSpeed);
    }
    return () => clearTimeout(timer);
  }, [isTyping, typeNextChar, typingSpeed]);

  return (
    <div className="typing-animation">
      {lines.map((line, index) => (
        <div
          key={index}
          className={`text-sm ${
            index === currentLineIndex ? "text-gray-900" : "text-gray-500"
          } my-2`}
        >
          {index < currentLineIndex
            ? line
            : index === currentLineIndex
            ? displayedText
            : ""}
        </div>
      ))}
    </div>
  );
};

export default TypingAnimation;