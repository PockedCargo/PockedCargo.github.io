import { useState, useRef, useEffect } from "react";

interface ProjectGateProps {
  onUnlock: () => void;
}

const PROJECT_PASS = "cybersecurity2026";

export default function ProjectGate({ onUnlock }: ProjectGateProps) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "denied" | "granted">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (input.toLowerCase() === PROJECT_PASS) {
      setStatus("granted");
      setTimeout(onUnlock, 800);
    } else {
      setStatus("denied");
      setTimeout(() => setStatus("idle"), 600);
    }
  };

  return (
    <div>
      {status === "granted" ? (
        <p className="text-primary text-xs font-mono">decrypting...</p>
      ) : (
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground font-mono mb-3">
            These case files are encrypted. Enter decryption key to access.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-primary text-xs font-mono">$</span>
            <input
              ref={inputRef}
              type="password"
              value={input}
              onChange={(e) => { setInput(e.target.value); setStatus("idle"); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder="decryption key"
              className="flex-1 bg-transparent border-b border-border px-2 py-1 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          {status === "denied" && (
            <p className="text-destructive text-[10px] font-mono mt-2">invalid key</p>
          )}
        </div>
      )}
    </div>
  );
}
