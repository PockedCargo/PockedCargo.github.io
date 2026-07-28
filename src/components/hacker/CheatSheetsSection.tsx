import { useState } from "react";
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";

interface Cheat {
  id: string;
  title: string;
  description: string;
  lines: string[];
  badge: string;
}

const cheats: Cheat[] = [
  {
    id: "nmap",
    title: "nmap — Network Mapper",
    description: "Essential nmap scans for reconnaissance",
    badge: "recon",
    lines: [
      "# Quick scan",
      "nmap -sV -sC -p- target.com",
      "",
      "# Stealth SYN scan",
      "nmap -sS -p 1-65535 -T4 target.com",
      "",
      "# Vulnerability scan",
      "nmap --script vuln target.com",
      "",
      "# Service/version detection",
      "nmap -sV -p 80,443 target.com",
      "",
      "# OS detection",
      "nmap -O target.com",
      "",
      "# Output to all formats",
      "nmap -oA scan_result target.com",
    ],
  },
  {
    id: "linux",
    title: "Linux — File & Permissions",
    description: "Core Linux commands for file operations",
    badge: "linux",
    lines: [
      "# File permissions",
      "chmod 755 file    # rwxr-xr-x",
      "chmod 644 file    # rw-r--r--",
      "chown user:group file",
      "",
      "# Find files",
      "find / -name \"*.log\" -type f",
      "find . -perm 777 -type f",
      "",
      "# Grep patterns",
      "grep -r \"pattern\" /var/log/",
      "grep -i \"error\" syslog | wc -l",
      "",
      "# Process management",
      "ps aux | grep apache",
      "kill -9 PID       # force kill",
      "htop              # interactive",
    ],
  },
  {
    id: "windows-forensics",
    title: "Windows Forensics",
    description: "Key Windows forensic artifacts and commands",
    badge: "DFIR",
    lines: [
      "# Event Logs (PowerShell)",
      "Get-WinEvent -LogName Security",
      "wevtutil qe Security /f:text",
      "",
      "# Registry artifacts",
      "reg query HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
      "reg query HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
      "",
      "# Prefetch analysis",
      "dir C:\\Windows\\Prefetch\\*.pf",
      "",
      "# Network connections",
      "netstat -anob",
      "Get-NetTCPConnection",
      "",
      "# Process listing",
      "tasklist /v",
      "Get-Process | Where-Object SessionId -ne 0",
    ],
  },
  {
    id: "wireshark",
    title: "Wireshark — Packet Analysis",
    description: "Common Wireshark display filters",
    badge: "network",
    lines: [
      "# HTTP traffic",
      "http.request",
      "http.response.code == 200",
      "",
      "# DNS queries",
      "dns.flags.response == 0",
      "",
      "# TLS handshakes",
      "tls.handshake.type == 1",
      "",
      "# Filter by IP",
      "ip.addr == 10.0.0.1",
      "ip.src == 192.168.1.0/24",
      "",
      "# Suspicious patterns",
      "http.request.uri contains \"cmd\"",
      "data.data contains \"flag\"",
      "tcp.port == 4444  # potential beacon",
    ],
  },
  {
    id: "sqlmap",
    title: "sqlmap — SQL Injection",
    description: "Quick sqlmap commands for SQLi testing",
    badge: "web",
    lines: [
      "# Basic injection test",
      "sqlmap -u \"http://target.com/page?id=1\"",
      "",
      "# Database enumeration",
      "sqlmap -u \"http://target.com/page?id=1\" --dbs",
      "",
      "# Table dump",
      "sqlmap -u \"http://target.com/page?id=1\" -D db --tables --dump",
      "",
      "# With cookie auth",
      "sqlmap -u \"URL\" --cookie=\"PHPSESSID=abc123\"",
      "",
      "# OS shell attempt",
      "sqlmap -u \"URL\" --os-shell",
      "",
      "# Batch mode (no prompts)",
      "sqlmap -u \"URL\" --batch --level 3",
    ],
  },
  {
    id: "hydra",
    title: "hydra — Password Attacks",
    description: "Common hydra brute-force patterns",
    badge: "crack",
    lines: [
      "# SSH brute force",
      "hydra -l admin -P rockyou.txt ssh://target",
      "",
      "# FTP brute force",
      "hydra -L users.txt -P passwords.txt ftp://target",
      "",
      "# HTTP POST form",
      "hydra -l admin -P pass.txt target.com http-post-form \"/login:user=^USER^&pass=^PASS^:F=incorrect\"",
      "",
      "# RDP brute force",
      "hydra -L users.txt -P rockyou.txt rdp://target",
      "",
      "# MySQL auth",
      "hydra -l root -P pass.txt mysql://target",
    ],
  },
];

export default function CheatSheetsSection() {
  const [activeCheat, setActiveCheat] = useState(cheats[0].id);
  const { play } = useSounds();
  const current = cheats.find((c) => c.id === activeCheat) || cheats[0];

  return (
    <div>
      <div className="text-xs text-muted-foreground font-mono mb-4">$ cat ./cheatsheets/ — quick reference</div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {cheats.map((c) => (
          <button
            key={c.id}
            onClick={() => { play("click"); setActiveCheat(c.id); }}
            className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors ${
              activeCheat === c.id
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            [{c.badge}]
          </button>
        ))}
      </div>

      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="border border-border rounded-lg bg-card overflow-hidden"
      >
        <div className="p-3 border-b border-border/50">
          <h3 className="text-[11px] font-mono text-foreground font-semibold">{current.title}</h3>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{current.description}</p>
        </div>
        <div className="p-3 bg-background/50">
          <pre className="text-[10px] font-mono leading-6 text-muted-foreground">
            {current.lines.map((line, i) => (
              <span key={i} className={`block ${line.startsWith("#") ? "text-muted-foreground/40" : line === "" ? "h-2" : ""}`}>
                {line.startsWith("#") ? line : `  ${line}`}
              </span>
            ))}
          </pre>
        </div>
      </motion.div>
    </div>
  );
}
