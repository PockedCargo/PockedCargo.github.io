import { useEffect, useState } from "react";

interface BootSequenceProps {
  onBootComplete: () => void;
}

const bootSteps = [
  { msg: "BIOS: initializing hardware...", delay: 200 },
  { msg: "BIOS: CPU @ 2.40GHz — 4 cores detected", delay: 150 },
  { msg: "BIOS: 8GB RAM — POST passed", delay: 150 },
  { msg: "BIOS: boot device detected — SSD 256GB", delay: 150 },
  { msg: "", delay: 80 },
  { msg: "EFI: loading /boot/vmlinuz-linux...", delay: 200 },
  { msg: "EFI: loading initramfs...", delay: 150 },
  { msg: "", delay: 80 },
  { msg: "[  OK  ] kernel: Linux 6.8.0-arch1-1 #1 SMP PREEMPT_DYNAMIC", delay: 250 },
  { msg: "[  OK  ] kernel: Mounted root filesystem (/ ext4 rw, errors=remount-ro)", delay: 200 },
  { msg: "[  OK  ] kernel: Security modules loaded — AppArmor, SELinux", delay: 200 },
  { msg: "[  OK  ] systemd: Starting Network Manager...", delay: 250 },
  { msg: "[  OK  ] systemd: Network is online — eth0: 192.168.1.100/24", delay: 200 },
  { msg: "[  OK  ] systemd: Started sshd.service — OpenSSH daemon", delay: 200 },
  { msg: "[  OK  ] systemd: Started fail2ban.service — intrusion prevention", delay: 200 },
  { msg: "[  OK  ] systemd: Started snort.service — IDS active", delay: 200 },
  { msg: "[  OK  ] systemd: Started tor.service — anonymity network", delay: 200 },
  { msg: "", delay: 100 },
  { msg: "Arch Linux 6.8.0-arch1-1 (tty1)", delay: 300 },
  { msg: "jimnah@portfolio login: _", delay: 400 },
];

export default function BootSequence({ onBootComplete }: BootSequenceProps) {
  const [visible, setVisible] = useState(false);
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [charPos, setCharPos] = useState(0);
  const [currentLine, setCurrentLine] = useState("");

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    if (idx >= bootSteps.length) {
      const t = setTimeout(onBootComplete, 1000);
      return () => clearTimeout(t);
    }
    const step = bootSteps[idx];
    if (step.msg === "") {
      setDisplayed((prev) => [...prev, ""]);
      setIdx((i) => i + 1);
      return;
    }
    if (charPos < step.msg.length) {
      const t = setTimeout(() => {
        setCurrentLine((prev) => prev + step.msg[charPos]);
        setCharPos((p) => p + 1);
      }, 8 + Math.random() * 15);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setDisplayed((prev) => [...prev, step.msg]);
      setCurrentLine("");
      setCharPos(0);
      setIdx((i) => i + 1);
    }, step.delay);
    return () => clearTimeout(t);
  }, [idx, charPos, onBootComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto px-4">
        <pre className="text-xs md:text-sm font-mono leading-6 text-muted-foreground whitespace-pre-wrap">
          {displayed.map((line, i) => (
            <span key={i} className={`block ${
              line.startsWith("[  OK  ]") ? "text-primary" :
              line.startsWith("BIOS:") || line.startsWith("EFI:") ? "text-accent/80" :
              line.includes("login: _") ? "text-primary" :
              line === "" ? "h-3" : ""
            }`}>{line}</span>
          ))}
          {currentLine && (
            <span className="text-muted-foreground">
              {currentLine}
              <span className="text-primary animate-cursor">█</span>
            </span>
          )}
        </pre>
      </div>
    </div>
  );
}
