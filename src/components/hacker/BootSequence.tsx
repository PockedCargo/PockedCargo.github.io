import { useEffect, useState, useRef } from "react";

interface BootSequenceProps {
  onBootComplete: () => void;
}

/* Fast boot — same hacker flavor, ~1/6 the wait.
   Lines appear whole with micro-stagger (no char-by-char typing),
   progress bar fills, then auto-completes. Press any key / click
   to skip instantly. Skipped once per browser session. */
const bootSteps = [
  { msg: "BIOS: POST passed — 8GB RAM · SSD 256GB", color: "text-accent/80" },
  { msg: "EFI: loading /boot/vmlinuz-linux...", color: "text-accent/80" },
  { msg: "[  OK  ] kernel: Linux 6.8.0-arch1-1", color: "text-primary" },
  { msg: "[  OK  ] kernel: root fs mounted (ext4 rw)", color: "text-primary" },
  { msg: "[  OK  ] security: AppArmor · SELinux loaded", color: "text-primary" },
  { msg: "[  OK  ] network: eth0 192.168.1.100/24 online", color: "text-primary" },
  { msg: "[  OK  ] sshd · fail2ban · snort · tor started", color: "text-primary" },
  { msg: "Arch Linux 6.8.0-arch1-1 (tty1)", color: "text-muted-foreground" },
  { msg: "jimnah@portfolio login: _", color: "text-primary" },
];

const SKIP_KEY = "portfolio_boot_skipped";

export default function BootSequence({ onBootComplete }: BootSequenceProps) {
  // Skip entirely if the visitor saw the boot this session
  const [skippedSession] = useState(() => {
    try {
      return sessionStorage.getItem(SKIP_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [displayed, setDisplayed] = useState<number>(skippedSession ? bootSteps.length : 0);
  const [done, setDone] = useState(false);
  const completedRef = useRef(false);

  const finish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    try {
      sessionStorage.setItem(SKIP_KEY, "1");
    } catch {
      /* private mode — ignore */
    }
    setDone(true);
    setTimeout(onBootComplete, 180);
  };

  // Rapid line reveal (~1.9s total) — whole lines, micro-staggered
  useEffect(() => {
    if (skippedSession || done) return;
    if (displayed >= bootSteps.length) {
      const t = setTimeout(finish, 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDisplayed((d) => d + 1), 160 + Math.random() * 60);
    return () => clearTimeout(t);
  }, [displayed, skippedSession, done]);

  // Skip on any key / click / touch
  useEffect(() => {
    if (skippedSession || done) return;
    const skip = () => setDisplayed(bootSteps.length);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [skippedSession, done]);

  // Failsafe: never trap the visitor behind the boot screen
  useEffect(() => {
    if (skippedSession) {
      onBootComplete();
      return;
    }
    const failsafe = setTimeout(finish, 4000);
    return () => clearTimeout(failsafe);
  }, [skippedSession]);

  if (skippedSession) return null;

  const progress = Math.min(displayed / bootSteps.length, 1);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0a0a0f] flex items-center justify-center transition-opacity duration-200 ${
        done ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-xl mx-auto px-4">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)",
          }}
        />
        <pre className="relative text-xs md:text-sm font-mono leading-6 whitespace-pre-wrap">
          {bootSteps.slice(0, displayed).map((step, i) => (
            <span key={i} className={`block ${step.color}`}>
              {step.msg}
            </span>
          ))}
        </pre>

        <div className="mt-5 flex items-center gap-2">
          <div className="flex-1 h-px bg-border/60 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary/70 transition-all duration-150"
              style={{ width: `${progress * 100}%`, boxShadow: "0 0 8px rgba(0,255,65,0.5)" }}
            />
          </div>
          <span className="text-[8px] font-mono text-primary/60 w-8 text-right">
            {Math.round(progress * 100)}%
          </span>
        </div>
        <div className="mt-2 text-[8px] font-mono text-muted-foreground/40 tracking-widest uppercase">
          press any key to skip
        </div>
      </div>
    </div>
  );
}