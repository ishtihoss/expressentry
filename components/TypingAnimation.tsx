import { useState, useEffect } from "react";

const TypingAnimation = ({
  lines,
  typingSpeed = 50,
  lineDelay = 1000,
}: {
  lines: string[];
  typingSpeed?: number;
  lineDelay?: number;
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (currentLineIndex < lines.length) {
      const line = lines[currentLineIndex];
      let charIndex = 0;

      const typeNextChar = () => {
        if (charIndex < line.length) {
          setDisplayedText((prev) => prev + line[charIndex]);
          charIndex++;
          setTimeout(typeNextChar, typingSpeed);
        } else {
          setTimeout(() => {
            setDisplayedText("");
            setCurrentLineIndex((prev) => prev + 1);
          }, lineDelay);
        }
      };

      typeNextChar();
    }
  }, [currentLineIndex, lines, typingSpeed, lineDelay]);

  return (
    <div>
      {lines.map((line, index) => (
        <div key={index} className="text-sm text-gray-500 my-5">
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
