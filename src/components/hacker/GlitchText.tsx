import { useEffect, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

const glitchChars = "!<>-_\\/[]{}—=+*^?#";

export default function GlitchText({
  text,
  className = "",
  as: Tag = "h1",
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      let iterations = 0;
      const maxIterations = 8;
      const glitch = () => {
        iterations++;
        if (iterations >= maxIterations) {
          setDisplayText(text);
          setIsGlitching(false);
          return;
        }
        setDisplayText(
          text
            .split("")
            .map((char) => (char === " " ? " " : Math.random() < 0.4 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char))
            .join("")
        );
        requestAnimationFrame(glitch);
      };
      requestAnimationFrame(glitch);
    }, 5000);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <Tag className={className}>
      <span className="relative">
        {displayText}
        {isGlitching && (
          <span
            className="absolute inset-0 text-accent/70 pointer-events-none"
            style={{ clipPath: "inset(20% 0 60% 0)", transform: "translate(-1px, 0)" }}
          >
            {displayText}
          </span>
        )}
      </span>
    </Tag>
  );
}
