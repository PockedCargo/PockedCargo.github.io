import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";

interface Question {
  question: string;
  keywords: string[];     // if user's answer contains ANY of these → correct
  hint: string;
  context: string;
}

const questions: Question[] = [
  {
    question: "What does chmod 777 do to a file?",
    keywords: ["permission", "rwx", "full access", "everyone", "all access", "777", "read write execute"],
    hint: "7 = read(4) + write(2) + execute(1)",
    context: "chmod 777 = rwxrwxrwx (full read/write/execute for everyone)",
  },
  {
    question: "What command shows your current working directory?",
    keywords: ["pwd", "print working directory", "present working"],
    hint: "three letters, starts with 'p'",
    context: "pwd = print working directory",
  },
  {
    question: "What does sudo allow you to do?",
    keywords: ["superuser", "root", "elevated", "super user", "admin"],
    hint: "think 'super' powers...",
    context: "sudo = superuser do — elevated privileges",
  },
  {
    question: "What port does SSH typically use?",
    keywords: ["22", "port 22", "tcp 22"],
    hint: "low number between 20-25",
    context: "SSH default port is 22/TCP",
  },
  {
    question: "What does the 'ls -la' command show?",
    keywords: ["all files", "list all", "detailed", "hidden", "long listing", "with details", "permissions"],
    hint: "'l' = long, 'a' = all",
    context: "ls -la lists all files including hidden ones with permissions and details",
  },
  {
    question: "In Linux, what does the '#' at the end of a prompt mean?",
    keywords: ["root", "superuser", "admin", "super user", "administrator"],
    hint: "higher privilege level",
    context: "$ = regular user, # = root/superuser",
  },
];

export default function ChallengeQuestion() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [showHint, setShowHint] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [solved, setSolved] = useState(0);
  const { play } = useSounds();

  const currentQ = questions[currentIndex % questions.length];

  const checkAnswer = useCallback((userInput: string): boolean => {
    const cleaned = userInput.toLowerCase().trim();
    return currentQ.keywords.some((kw) => cleaned.includes(kw.toLowerCase()));
  }, [currentQ]);

  const handleSubmit = useCallback(() => {
    const isCorrect = checkAnswer(input);
    if (isCorrect) {
      play("success");
      setStatus("correct");
      setSolved((s) => s + 1);
      setTimeout(() => {
        setStatus("idle");
        setInput("");
        setShowHint(false);
        setCurrentIndex((i) => i + 1);
      }, 2000);
    } else {
      play("error");
      setStatus("wrong");
      setTimeout(() => setStatus("idle"), 800);
    }
  }, [input, checkAnswer, play]);

  if (!isOpen) {
    return (
      <button
        onClick={() => { play("notification"); setIsOpen(true); }}
        className="fixed bottom-24 right-4 z-30 w-10 h-10 rounded-full border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center group"
        title="Take the challenge!"
      >
        <span className="text-sm font-mono text-primary">?</span>
        {solved > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[8px] font-mono text-background flex items-center justify-center">
            {solved}
          </span>
        )}
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-24 right-4 z-30 w-72 border border-border rounded-lg bg-card shadow-lg"
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-primary">security_challenge.sh</span>
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
        </div>

        <AnimatePresence mode="wait">
          {status === "correct" ? (
            <motion.div key="correct" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-2">
              <p className="text-primary text-xs font-mono">✓ Correct! +1 skill point</p>
              <p className="text-[10px] text-muted-foreground font-mono mt-1">{currentQ.context}</p>
            </motion.div>
          ) : (
            <motion.div key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-[11px] font-mono text-foreground mb-2">#{currentIndex + 1}: {currentQ.question}</p>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-primary text-[10px] font-mono">$</span>
                <input
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setStatus("idle"); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                  placeholder="answer..."
                  className="flex-1 bg-transparent border-b border-border px-1 py-0.5 text-[10px] font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              {status === "wrong" && (
                <div className="mt-1">
                  <p className="text-destructive text-[10px] font-mono">✗ not quite — try a different phrasing</p>
                </div>
              )}
              <div className="flex justify-between items-center mt-2">
                <button onClick={() => setShowHint((h) => !h)} className="text-[9px] font-mono text-muted-foreground hover:text-terminal-amber transition-colors">
                  {showHint ? currentQ.hint : "[hint]"}
                </button>
                <span className="text-[9px] font-mono text-muted-foreground">
                  {solved}/{questions.length} solved
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
