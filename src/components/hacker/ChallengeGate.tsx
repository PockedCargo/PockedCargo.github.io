import { useState, useRef, useEffect } from "react";

interface ChallengeGateProps {
  onAccessGranted: () => void;
}

const CHALLENGE_PASS = "cybersecurity2026";

export default function ChallengeGate({ onAccessGranted }: ChallengeGateProps) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "denied" | "granted">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (input.toLowerCase() === CHALLENGE_PASS) {
      setStatus("granted");
      setTimeout(onAccessGranted, 1200);
    } else {
      setStatus("denied");
      setTimeout(() => setStatus("idle"), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-primary text-xl font-mono">🔐</span>
        </div>

        {status === "granted" ? (
          <div className="text-center">
            <p className="text-primary text-sm font-mono">access granted</p>
            <div className="mt-4 flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-primary rounded-full"
                  style={{ animation: `load 0.6s ${i * 0.15}s ease-in-out infinite` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-foreground/60 text-xs font-mono mb-4">
              This site is protected. Enter the passphrase to continue.
            </p>
            <div className="flex items-center gap-2 justify-center">
              <span className="text-primary text-sm font-mono">$</span>
              <input
                ref={inputRef}
                type="password"
                value={input}
                onChange={(e) => { setInput(e.target.value); setStatus("idle"); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                placeholder="passphrase"
                className="bg-transparent border-b border-border px-2 py-1 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors w-48 text-center"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            {status === "denied" && (
              <p className="text-destructive text-xs font-mono mt-3">invalid</p>
            )}
          </div>
        )}

        <style>{`
          @keyframes load {
            0%, 80%, 100% { transform: scale(0.3); opacity: 0.3; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
