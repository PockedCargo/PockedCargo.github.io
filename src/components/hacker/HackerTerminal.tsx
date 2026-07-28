import { useEffect, useState, useRef } from "react";

interface TerminalLine {
  text: string;
  type?: "default" | "success" | "error" | "info" | "warning" | "command" | "output";
  delay?: number;
  speed?: number;
}

interface HackerTerminalProps {
  lines: TerminalLine[];
  className?: string;
  onComplete?: () => void;
  prompt?: string;
  showCursor?: boolean;
}

const typeColors: Record<string, string> = {
  default: "text-foreground/80",
  success: "text-primary",
  error: "text-destructive",
  info: "text-accent",
  warning: "text-terminal-amber",
  command: "text-accent",
  output: "text-foreground/60",
};

export default function HackerTerminal({
  lines,
  className = "",
  onComplete,
  prompt = "jimnah@portfolio:~$",
  showCursor = true,
}: HackerTerminalProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [currentChar, setCurrentChar] = useState<number>(0);

  useEffect(() => {
    setVisibleLines(0);
    setCurrentChar(0);
  }, [lines]);

  useEffect(() => {
    if (visibleLines >= lines.length) {
      onComplete?.();
      return;
    }

    const currentLine = lines[visibleLines];
    const delay = currentLine.delay ?? 0;
    const speed = currentLine.speed ?? 30;

    const startTimeout = setTimeout(() => {
      const typeInterval = setInterval(() => {
        setCurrentChar((prev) => {
          if (prev >= currentLine.text.length) {
            clearInterval(typeInterval);
            setVisibleLines((v) => v + 1);
            setCurrentChar(0);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [visibleLines, lines, onComplete]);

  return (
    <div className={`font-mono text-sm leading-relaxed ${className}`}>
      {lines.slice(0, visibleLines).map((line, i) => (
        <div key={i} className="mb-0.5">
          {line.type === "command" && (
            <span className="text-primary">{prompt} </span>
          )}
          <span className={typeColors[line.type ?? "default"]}>{line.text}</span>
        </div>
      ))}
      {visibleLines < lines.length && (
        <div className="mb-0.5">
          {lines[visibleLines]?.type === "command" && (
            <span className="text-primary">{prompt} </span>
          )}
          <span className={typeColors[lines[visibleLines]?.type ?? "default"]}>
            {lines[visibleLines]?.text.slice(0, currentChar)}
          </span>
          <span className="text-primary animate-pulse">▊</span>
        </div>
      )}
      {visibleLines >= lines.length && showCursor && (
        <div className="mt-0.5">
          <span className="text-primary">{prompt} </span>
          <span className="animate-cursor" />
        </div>
      )}
    </div>
  );
}
