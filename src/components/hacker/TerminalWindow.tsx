import { useState, useEffect, useRef, useCallback } from "react";

export interface TerminalLine {
  text: string;
  type?: "command" | "output" | "info" | "success" | "error" | "dim" | "warning";
  indent?: number;
}

interface TerminalWindowProps {
  title?: string;
  lines: TerminalLine[];
  typingSpeed?: number;
  startDelay?: number;
  className?: string;
  height?: string;
}

function TypewriterLines({ lines, typingSpeed, startDelay }: {
  lines: TerminalLine[];
  typingSpeed: number;
  startDelay: number;
}) {
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([]);
  const [typingLine, setTypingLine] = useState(0);
  const [typingChar, setTypingChar] = useState(0);
  const [finished, setFinished] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const startedRef = useRef(false);

  // Show all lines instantly
  const skipAll = useCallback(() => {
    setSkipped(true);
    setVisibleLines(lines.map(l => ({ ...l })));
    setTypingLine(lines.length);
    setTypingChar(0);
    setFinished(true);
  }, [lines]);

  useEffect(() => {
    if (lines.length === 0) return;
    const startT = setTimeout(() => {
      startedRef.current = true;
    }, startDelay);
    return () => clearTimeout(startT);
  }, [lines, startDelay]);

  useEffect(() => {
    if (skipped) return;
    if (!startedRef.current || typingLine >= lines.length) {
      if (typingLine >= lines.length && lines.length > 0) setFinished(true);
      return;
    }

    const line = lines[typingLine];
    if (!line || line.text === "") {
      setVisibleLines((prev) => [...prev, line]);
      setTypingLine((i) => i + 1);
      setTypingChar(0);
      return;
    }

    if (typingChar < line.text.length) {
      // Very fast typing: 2-6ms per char means a 80-char line types in ~300ms
      const t = setTimeout(() => setTypingChar((c) => c + 1), typingSpeed * 0.3 + Math.random() * typingSpeed * 0.7);
      return () => clearTimeout(t);
    }

    // Short delay between lines (commands get a bit more pause for readability)
    const delay = line.type === "command" ? 60 : line.type === "success" ? 30 : 15;
    const t = setTimeout(() => {
      setVisibleLines((prev) => [...prev, { ...line }]);
      setTypingLine((i) => i + 1);
      setTypingChar(0);
    }, delay);
    return () => clearTimeout(t);
  }, [typingLine, typingChar, lines, typingSpeed, skipped, startDelay]);

  const currentLine = typingLine < lines.length && lines[typingLine] && lines[typingLine].text !== "" && !skipped
    ? lines[typingLine].text.slice(0, typingChar)
    : null;

  return (
    <>
      {/* Skip button — appears during animation */}
      {!finished && !skipped && (
        <div className="flex justify-end mb-1">
          <button onClick={skipAll} className="text-[8px] font-mono text-muted-foreground/30 hover:text-accent transition-colors px-1">
            [skip to end]
          </button>
        </div>
      )}

      {visibleLines.map((line, i) => {
        if (!line || line.text === "") return <div key={i} className="h-2" />;
        const typeColor =
          line.type === "command" ? "text-primary" :
          line.type === "output" ? "text-muted-foreground/80" :
          line.type === "info" ? "text-accent" :
          line.type === "success" ? "text-primary" :
          line.type === "error" ? "text-destructive" :
          line.type === "dim" ? "text-muted-foreground/40" :
          line.type === "warning" ? "text-yellow-400/80" :
          "text-muted-foreground/60";
        return (
          <div key={i} className={`${typeColor} leading-6 whitespace-pre-wrap`} style={{ paddingLeft: (line.indent || 0) * 12 }}>
            {line.type === "command" && <span className="text-primary mr-1">$</span>}
            {line.text}
          </div>
        );
      })}
      {currentLine !== null && (
        <div className="leading-6">
          {(lines[typingLine]?.type === "command") && <span className="text-primary mr-1">$</span>}
          <span className={
            lines[typingLine]?.type === "command" ? "text-primary" :
            lines[typingLine]?.type === "success" ? "text-primary" :
            lines[typingLine]?.type === "output" ? "text-muted-foreground/80" :
            lines[typingLine]?.type === "info" ? "text-accent" :
            lines[typingLine]?.type === "warning" ? "text-yellow-400/80" :
            "text-muted-foreground"
          }>
            {currentLine}
            <span className="text-primary animate-cursor">█</span>
          </span>
        </div>
      )}
      {!finished && !currentLine && visibleLines.length === 0 && (
        <div className="text-muted-foreground/30 leading-6">
          <span className="text-primary animate-pulse">█</span>
        </div>
      )}
    </>
  );
}

export default function TerminalWindow({
  title = "terminal",
  lines,
  typingSpeed = 15,
  startDelay = 200,
  className = "",
  height = "auto",
}: TerminalWindowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`${className}`}>
      {/* Terminal window with glossy glass effect */}
      <div className="relative overflow-hidden rounded-lg border border-border/60 shadow-lg shadow-primary/5">
        {/* Glass reflection overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.03] to-transparent z-10" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/[0.02] to-transparent z-10" />

        {/* Title bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#1a1a2e] border-b border-border/60">
          <div className="flex items-center gap-1.5">
            <button onClick={() => setExpanded(!expanded)} className="w-3 h-3 rounded-full bg-destructive/20 border border-destructive/50 hover:bg-destructive/40 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-terminal-amber/20 border border-terminal-amber/50" />
            <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary/50" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-muted-foreground/40">{title}</span>
            {lines.length > 15 && (
              <button onClick={() => setExpanded(!expanded)} className="text-[8px] font-mono text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors">
                {expanded ? "[-]" : "[+]"}
              </button>
            )}
          </div>
        </div>

        {/* Terminal content */}
        <div
          className="bg-[#0d0d1a]/95 backdrop-blur-sm p-3 font-mono text-[11px] leading-6 overflow-x-auto"
          style={{ maxHeight: expanded ? "none" : height, overflowY: "auto" }}
        >
          <TypewriterLines
            lines={lines}
            typingSpeed={typingSpeed}
            startDelay={startDelay}
          />
        </div>

        {/* Bottom glare */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
