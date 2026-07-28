import { useEffect, useState, useRef } from "react";

interface FeedEntry {
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "network" | "auth" | "system";
}

const templates: { message: string; type: FeedEntry["type"] }[] = [
  { message: "heartbeat OK — all services nominal", type: "success" },
  { message: "eth0 — packet from 10.0.0.1:443 (4.2 KB)", type: "network" },
  { message: "SSH session opened for jimnah@10.0.0.47", type: "auth" },
  { message: "DROP — incoming SYN from 203.0.113.0/24", type: "warning" },
  { message: "DNS — github.com → 140.82.121.3 (12ms)", type: "network" },
  { message: "file integrity — /etc/passwd — OK", type: "success" },
  { message: "mem: 4.2G/32G (13%)", type: "info" },
  { message: "ALLOW — established to 185.199.108.153:443", type: "success" },
  { message: "GPG key 0xDEADBEEF — verified", type: "auth" },
  { message: "ICMP from 8.8.8.8 — seq=42 ttl=117 14.2ms", type: "network" },
  { message: "TLS 1.3 handshake with github.com — AES-256-GCM", type: "success" },
  { message: "jimnah — sudo: /usr/bin/git push", type: "auth" },
  { message: "247 procs — load: 0.42", type: "info" },
  { message: "port 22 rate limit — 12 conn/min", type: "warning" },
  { message: "security scan — 0 vulns found", type: "success" },
  { message: "cert *.jimnah.dev expires in 14d", type: "warning" },
];

export default function LiveFeed() {
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const init: FeedEntry[] = [];
    for (let i = 0; i < 3; i++) {
      const t = templates[Math.floor(Math.random() * templates.length)];
      const d = new Date(); d.setSeconds(d.getSeconds() - (3 - i) * 3);
      init.push({ timestamp: d.toISOString().slice(11, 19), message: t.message, type: t.type });
    }
    setEntries(init);

    const interval = setInterval(() => {
      const t = templates[Math.floor(Math.random() * templates.length)];
      const d = new Date();
      setEntries((prev) => [...prev, { timestamp: d.toISOString().slice(11, 19), message: t.message, type: t.type }].slice(-6));
    }, 3000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  const colors: Record<string, string> = {
    info: "text-accent", success: "text-primary", warning: "text-terminal-amber",
    error: "text-destructive", network: "text-accent", auth: "text-terminal-amber", system: "text-muted-foreground",
  };
  const prefix: Record<string, string> = {
    info: "[*]", success: "[+]", warning: "[!]", error: "[-]", network: "[>]", auth: "[@]", system: "[#]",
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
      <div className="h-6 bg-gradient-to-t from-background to-transparent" />
      <div className="bg-background/90 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 py-1.5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[8px] font-mono text-muted-foreground tracking-wider">LIVE</span>
            <span className="text-[8px] font-mono text-muted-foreground/40">|</span>
            <span className="text-[8px] font-mono text-muted-foreground">{entries.length} events</span>
          </div>
          <div ref={ref} className="overflow-hidden" style={{ maxHeight: "52px" }}>
            {entries.map((e, i) => (
              <div key={i} className="flex gap-1.5 text-[9px] font-mono leading-5" style={{ animation: "feed-in 0.3s ease-out" }}>
                <span className="text-muted-foreground/40 shrink-0 w-12">{e.timestamp}</span>
                <span className={`${colors[e.type]} shrink-0 w-5`}>{prefix[e.type]}</span>
                <span className="text-muted-foreground truncate">{e.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes feed-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
