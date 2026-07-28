import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  usage: string;
  os: string;
  lines: string[];
}

const tools: Tool[] = [
  {
    id: "nmap",
    name: "nmap",
    category: "Reconnaissance",
    description: "Network discovery and security scanning",
    usage: "Port scanning, service detection, OS fingerprinting",
    os: "cross-platform",
    lines: [
      "nmap -sV -sC -p- target.com",
      "# Comprehensive scan",
    ],
  },
  {
    id: "wireshark",
    name: "Wireshark",
    category: "Network Analysis",
    description: "Network protocol analyzer for traffic inspection",
    usage: "Packet capture, protocol analysis, forensics",
    os: "cross-platform",
    lines: [
      "# Display filter for HTTP",
      "http.request",
      "# Follow TCP stream",
      "Right-click → Follow → TCP Stream",
    ],
  },
  {
    id: "burp",
    name: "Burp Suite",
    category: "Web Testing",
    description: "Web application security testing platform",
    usage: "Intercepting proxy, scanner, repeater, intruder",
    os: "cross-platform",
    lines: [
      "# Proxy setup",
      "127.0.0.1:8080",
      "# Decode Base64",
      "Select → Send to Decoder",
    ],
  },
  {
    id: "metasploit",
    name: "Metasploit",
    category: "Exploitation",
    description: "Penetration testing framework",
    usage: "Exploit development, payload generation, post-exploitation",
    os: "cross-platform",
    lines: [
      "msf6 > use exploit/multi/handler",
      "msf6 > set payload windows/x64/meterpreter/reverse_tcp",
      "msf6 > set LHOST 10.0.0.1",
      "msf6 > exploit",
    ],
  },
  {
    id: "volatility",
    name: "Volatility",
    category: "Memory Forensics",
    description: "Advanced memory forensics framework",
    usage: "RAM dump analysis, process enumeration, registry extraction",
    os: "cross-platform",
    lines: [
      "volatility -f memory.dump imageinfo",
      "volatility -f memory.dump --profile=Win10x64 pslist",
      "volatility -f memory.dump --profile=Win10x64 netscan",
      "volatility -f memory.dump --profile=Win10x64 cmdline",
    ],
  },
  {
    id: "autopsy",
    name: "Autopsy",
    category: "Disk Forensics",
    description: "Digital forensics platform for disk analysis",
    usage: "File recovery, timeline analysis, keyword search",
    os: "cross-platform",
    lines: [
      "# New case → Select data source",
      "# Ingest modules: Hash lookup, File type identification",
      "# Keyword search: regex mode",
      "# Timeline: Analyze file system activity",
    ],
  },
  {
    id: "python",
    name: "Python (Security)",
    category: "Scripting",
    description: "Security automation and tool development",
    usage: "Exploit dev, log parsing, API integration",
    os: "cross-platform",
    lines: [
      "import socket",
      "s = socket.socket()",
      "s.connect(('target', 443))",
      "s.send(b'GET / HTTP/1.1\\r\\n\\r\\n')",
      "print(s.recv(4096))",
    ],
  },
  {
    id: "splunk",
    name: "Splunk",
    category: "SIEM",
    description: "Security information and event management",
    usage: "Log aggregation, search, alerting, dashboarding",
    os: "cross-platform",
    lines: [
      "index=* sourcetype=WinEventLog:Security",
      "| stats count by EventCode",
      "| where count > 100",
      "| sort - count",
    ],
  },
  {
    id: "john",
    name: "John the Ripper",
    category: "Password Cracking",
    description: "Password hash cracking tool",
    usage: "Hash identification, brute force, wordlist attacks",
    os: "cross-platform",
    lines: [
      "john --wordlist=rockyou.txt hash.txt",
      "john --show hash.txt",
      "john --incremental hash.txt",
    ],
  },
];

const categories = ["all", ...new Set(tools.map((t) => t.category))];

export default function ToolsSection() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const { play } = useSounds();

  const filtered = filter === "all" ? tools : tools.filter((t) => t.category === filter);
  const current = tools.find((t) => t.id === selected);

  return (
    <div>
      <div className="text-xs text-muted-foreground font-mono mb-4">$ cat ./tools/ — security toolkit</div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { play("click"); setFilter(cat); setSelected(null); }}
            className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors ${
              filter === cat
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat === "all" ? "[*]" : `[${cat}]`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
        {filtered.map((tool, i) => (
          <motion.button
            key={tool.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => { play("click"); setSelected(selected === tool.id ? null : tool.id); }}
            className={`border rounded-lg bg-card p-2.5 text-left transition-all ${
              selected === tool.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <div className="text-[10px] font-mono text-foreground font-semibold">{tool.name}</div>
            <div className="text-[8px] font-mono text-muted-foreground mt-0.5">{tool.description}</div>
            <div className="text-[7px] font-mono text-primary/50 mt-1">[{tool.category}]</div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && current && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-primary/30 rounded-lg bg-card mt-3 p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[11px] font-mono text-foreground font-semibold">{current.name}</span>
                <span className="text-[9px] font-mono text-muted-foreground ml-2">({current.os})</span>
              </div>
              <span className="text-[8px] font-mono text-primary/70 border border-primary/20 rounded px-1.5 py-0.5">{current.category}</span>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground mb-1">{current.description}</p>
            <p className="text-[9px] font-mono text-accent/80 mb-2">Usage: {current.usage}</p>
            <div className="border border-border/50 rounded p-2 bg-background/50">
              <pre className="text-[9px] font-mono leading-5 text-muted-foreground">
                {current.lines.map((l, i) => (
                  <span key={i} className={`block ${l.startsWith("#") ? "text-muted-foreground/40" : ""}`}>
                    {l.startsWith("#") ? l : `$ ${l}`}
                  </span>
                ))}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
