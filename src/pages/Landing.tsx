import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import CodeRain from "@/components/hacker/CodeRain";
import HackerNav from "@/components/hacker/HackerNav";
import BootSequence from "@/components/hacker/BootSequence";
import ProjectsSection from "@/components/hacker/ProjectsSection";
import ContactSection from "@/components/hacker/ContactSection";
import ChallengeQuestion from "@/components/hacker/ChallengeQuestion";
import LiveFeed from "@/components/hacker/LiveFeed";
import CheatSheetsSection from "@/components/hacker/CheatSheetsSection";
import StatsSection from "@/components/hacker/StatsSection";
import ToolsSection from "@/components/hacker/ToolsSection";

type Section = "home" | "about" | "tools" | "cheatsheets" | "stats" | "projects" | "contact";

const skills = {
  forensics: ["Belkasoft", "Autopsy", "Volatility", "FTK Imager", "Wireshark", "SIFT"],
  defense: ["Microsoft Defender", "Cisco Security", "CrowdStrike", "Splunk", "ELK Stack", "Suricata"],
};
const certifications = [
  { name: "Network & Cybersecurity", org: "Certificate Program" },
  { name: "Cisco CCNA", org: "Cisco Systems" },
  { name: "CyberOps Associate", org: "Cisco Systems" },
  { name: "AWS Academy Graduate", org: "Amazon Web Services" },
  { name: "Certified Ethical Hacker", org: "Cisco Systems" },
  { name: "MITRE ATT&CK", org: "MITRE Corporation" },
];
const connectLinks = [
  { label: "GitHub", url: "https://github.com/pockedcargo", icon: ">" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/jimnah-kabiria-/", icon: ">" },
  { label: "Email", url: "mailto:jimnahkabiria@gmail.com", icon: ">" },
];

/* ─── Marquee Ticker ─── */
function MarqueeTicker() {
  return (
    <div className="relative overflow-hidden py-4 border-y border-border/50 my-8">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="mx-4 text-2xl md:text-3xl font-mono font-bold uppercase tracking-[0.2em] text-transparent"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.12)" }}
          >
            RECON • EXPLOIT • HARDEN • REPEAT
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Live SOC Monitoring Readout ─── */
function LiveSOCMonitor() {
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    { label: "SYSTEM STATUS", value: "SECURE", pulse: false },
    { label: "ACTIVE SESSIONS", value: "3", pulse: false },
    { label: "THREAT LEVEL", value: "LOW", pulse: true },
    { label: "INTRUSION DETECTION", value: "STANDING BY", pulse: false },
    { label: "NETWORK HEALTH", value: "98.7%", pulse: false },
    { label: "UPTIME", value: "14d 6h 32m", pulse: false },
    { label: "PACKETS CAPTURED", value: "1,247", pulse: false },
    { label: "ENDPOINTS MONITORED", value: "12", pulse: false },
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setStatusIndex(prev => (prev + 1) % statuses.length);
    }, 2500);
    return () => clearInterval(t);
  }, [statuses.length]);

  const current = statuses[statusIndex];

  return (
    <div className="absolute bottom-3 left-4 flex items-center gap-2 z-[2]">
      <div className="w-6 h-px bg-white/30" />
      <div className="flex items-center gap-1.5 overflow-hidden">
        <motion.span
          key={statusIndex}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex items-center gap-1.5 text-[8px] font-mono whitespace-nowrap"
        >
          {current.pulse && <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />}
          <span className="text-white/40">{current.label}:</span>
          <span className={`${current.pulse ? 'text-primary' : 'text-accent/80'} font-semibold`}>
            {current.value}
          </span>
        </motion.span>
      </div>
      {/* Mini scan line indicator */}
      <div className="w-4 h-px bg-accent/30 animate-pulse" />
    </div>
  );
}

/* ─── Hero Data Viz — "Portrait of the Intellect" ─── */
function HeroVisual() {
  return (
    <div className="max-w-2xl mx-auto mb-8 group">
      <div className="relative aspect-video rounded-lg overflow-hidden border border-border/20 bg-gradient-to-br from-[#05051a] via-[#0a0a2e] to-[#000] transition-all duration-500 ease-out group-hover:scale-[1.02]">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20 transition-all duration-500 group-hover:opacity-30"
          style={{ backgroundImage: "linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        {/* Dark overlay — lifts on hover for "color bloom" effect */}
        <div className="absolute inset-0 bg-background/60 transition-all duration-500 group-hover:bg-background/0 z-[1]" />
        {/* Animated scan line */}
        <div className="absolute left-0 right-0 h-px bg-accent/40 z-[2]" style={{ animation: "scanMove 4s ease-in-out infinite", boxShadow: "0 0 12px rgba(0,212,255,0.3)" }} />
        {/* Network nodes — intensified on hover */}
        <div className="absolute top-4 left-8 w-2 h-2 rounded-full bg-accent/60 shadow-[0_0_12px_rgba(0,212,255,0.5)] transition-all duration-500 group-hover:bg-accent group-hover:shadow-[0_0_20px_rgba(0,212,255,0.8)]" />
        <div className="absolute top-12 left-20 w-1.5 h-1.5 rounded-full bg-primary/40 transition-all duration-500 group-hover:bg-primary/80" />
        <div className="absolute bottom-8 right-12 w-2 h-2 rounded-full bg-accent/50 shadow-[0_0_12px_rgba(0,212,255,0.4)] transition-all duration-500 group-hover:bg-accent group-hover:shadow-[0_0_20px_rgba(0,212,255,0.8)]" />
        <div className="absolute top-8 right-24 w-1.5 h-1.5 rounded-full bg-primary/30 transition-all duration-500 group-hover:bg-primary/80" />
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20 transition-all duration-500 group-hover:opacity-40" viewBox="0 0 400 200">
          <line x1="32" y1="16" x2="80" y2="48" stroke="#00d4ff" strokeWidth="0.5" />
          <line x1="80" y1="48" x2="376" y2="32" stroke="#00ff41" strokeWidth="0.3" />
          <line x1="32" y1="16" x2="376" y2="32" stroke="#00d4ff" strokeWidth="0.2" />
          <line x1="376" y1="32" x2="300" y2="160" stroke="#00d4ff" strokeWidth="0.4" />
          <line x1="80" y1="48" x2="200" y2="120" stroke="#00ff41" strokeWidth="0.3" />
        </svg>
        {/* Live SOC Monitoring Readout — cycles live metrics */}
        <LiveSOCMonitor />
        {/* Right side metrics */}
        <div className="absolute top-3 right-4 text-right z-[2]">
          <div className="text-[8px] font-mono text-muted-foreground/30">ACTIVE CONNECTIONS</div>
          <div className="text-xs font-mono text-accent/60">3</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Interactive Terminal Scanner ─── */
const SCAN_STEPS = [
  "[INFO]  Initializing scan engine v4.2.1",
  "[INFO]  Loading vulnerability signatures...",
  "[SCAN]  Enumerating target: localhost:80",
  "[SCAN]  Port scan: 22/tcp [FILTERED]",
  "[SCAN]  Port scan: 80/tcp  [OPEN]",
  "[SCAN]  Port scan: 443/tcp [OPEN]",
  "[WARN]  HTTPS certificate: Self-signed detected",
  "[SCAN]  Testing OWASP Top 10 vectors...",
  "[INFO]  SQL injection:      [NOT FOUND]",
  "[WARN]  XSS (Reflected):    [DETECTED]  /search?q=",
  "[INFO]  LFI:                [NOT FOUND]",
  "[WARN]  SSRF:               [DETECTED]  Chaining with internal redirect on /fetch?url=",
  "[WARN]  CSRF:               [DETECTED]  Missing tokens on /api/",
  "[SCAN]  Checking headers...",
  "[WARN]  X-Frame-Options:    MISSING",
  "[INFO]  Content-Security-Policy: PRESENT",
  "[SCAN]  Pivoting to internal subnet 10.0.0.0/24...",
  "[SCAN]  Enumerating adjacent services...",
  "[WARN]  SMB:                [DETECTED]  Null session on 10.0.0.5:445",
  "[INFO]  Chaining exploits: LFI  log poisoning  RCE",
  "[SCAN]  Generating report...",
  "",
  "[INFO]  Scan complete  4 critical, 5 medium, 2 low",
  "[INFO]  Escalation path: SSRF  Pivot  Lateral movement chain identified",
];

function TerminalScanner() {
  const [phase, setPhase] = useState<"idle" | "scanning" | "complete">("idle");
  const [log, setLog] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const logRef = useRef(0);

  useEffect(() => {
    if (phase !== "scanning") return;
    logRef.current = 0;
    const t = setInterval(() => {
      if (logRef.current < SCAN_STEPS.length) {
        const idx = logRef.current;
        setLog(p => [...p, SCAN_STEPS[idx]]);
        logRef.current = idx + 1;
      } else {
        clearInterval(t);
        setPhase("complete");
      }
    }, 120 + Math.random() * 150);
    return () => clearInterval(t);
  }, [phase]);

  // Scroll only within the terminal container, not the whole page
  useEffect(() => {
    const container = endRef.current?.closest('.overflow-y-auto');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [log]);

  return (
    <div className="border border-border/60 rounded-lg overflow-hidden bg-card shadow-lg">
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#111] border-b border-border/50">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/20 border border-destructive/50" />
          <div className="w-3 h-3 rounded-full bg-terminal-amber/20 border border-terminal-amber/50" />
          <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary/50" />
        </div>
        <span className="text-[8px] font-mono text-muted-foreground/30">vuln_scanner.sh  zsh</span>
      </div>

      {/* Body */}
      <div className="p-3 font-mono text-[10px] leading-5 max-h-52 overflow-y-auto bg-[#0b0b14]">
        {phase === "idle" && (
          <div className="flex items-center gap-2">
            <span className="text-primary">jimnah@scan:~$</span>
            <span className="text-muted-foreground">./vuln_scan.sh --target localhost</span>
            <span className="text-primary animate-cursor ml-0.5">_</span>
          </div>
        )}
        {log.map((line, i) => {
          const type = line.startsWith("[WARN]") ? "text-yellow-400/80" :
            line.startsWith("[SCAN]") ? "text-accent/80" :
            line.startsWith("[INFO]") ? "text-muted-foreground/70" :
            line.startsWith("[+]") ? "text-primary" : "text-muted-foreground/50";
          return <div key={i} className={`leading-5 ${type} whitespace-pre-wrap`}>{line}</div>;
        })}
        {phase === "scanning" && <span className="text-primary animate-cursor">_</span>}
        {phase === "complete" && <div className="text-primary leading-5">  scan finished  8 findings</div>}
        <div ref={endRef} />
      </div>

      {/* Controls */}
      {phase === "idle" && (
        <div className="p-2 border-t border-border/50">
          <button onClick={() => { setPhase("scanning"); setLog([]); }}
            className="w-full py-1.5 text-[10px] font-mono bg-primary/10 border border-primary/30 text-primary rounded hover:bg-primary/20 transition-colors"
          >[run scan]</button>
        </div>
      )}
      {phase === "complete" && (
        <div className="p-2 border-t border-border/50">
          <button onClick={() => setPhase("idle")}
            className="w-full py-1.5 text-[10px] font-mono text-muted-foreground border border-border rounded hover:text-foreground transition-colors"
          >[reset]</button>
        </div>
      )}
    </div>
  );
}

/* ─── Data for Activity Cards ─── */
const activityItems = [
  { title: "Stack Buffer Overflow  Deep Dive Analysis", category: "ADVISORY", meta: "12 MIN READ", date: "28 Jan 2026" },
  { title: "HTB CyberApocalypse  Forensics Challenge", category: "POCC", meta: "8 MIN READ", date: "15 Jan 2026" },
  { title: "Zero-Day Assessment  CVE-2024-XXXX Analysis", category: "DISCLOSURE", meta: "15 MIN READ", date: "02 Jan 2026" },
];

/* ─── Expertise Cards Data ─── */
const expertiseGrid = [
  { title: "Web Penetration Testing", desc: "OWASP Top 10, API security, authentication bypass, SQLi, XSS, SSRF exploitation and reporting.", icon: "W", size: "large" },
  { title: "Cloud Security Architecture", desc: "AWS/Azure security assessments, IAM policy review, S3 bucket auditing, cloud infrastructure hardening.", icon: "C", size: "small" },
  { title: "Reverse Engineering", desc: "Binary analysis, malware deobfuscation, IDA Pro/Ghidra disassembly, protocol reversing.", icon: "R", size: "small" },
  { title: "Incident Response & Forensics", desc: "Memory forensics with Volatility, disk analysis with Autopsy, timeline reconstruction, malware triage.", icon: "I", size: "wide" },
];

/* ─── Main Landing ─── */
export default function Landing() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [booted, setBooted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activityLevel, setActivityLevel] = useState(0);

  useEffect(() => { if (booted) setVisible(true); }, [booted]);

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section as Section);
    setActivityLevel(3);
    setTimeout(() => setActivityLevel(0), 1000);
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [activeSection]);

  const prompt = (text: string) => (
    <div className="flex items-start gap-2 text-xs font-mono leading-7">
      <span className="text-primary shrink-0">~</span>
      <span className="text-muted-foreground/70">{text}</span>
    </div>
  );
  const heading = (text: string) => (
    <div className="flex items-center gap-2 mb-3 mt-6 first:mt-0">
      <span className="text-xs font-mono text-muted-foreground/30">#</span>
      <span className="text-xs font-mono text-foreground/80">{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!booted && <BootSequence onBootComplete={() => setBooted(true)} />}
      <CodeRain activityLevel={activityLevel} />
      <HackerNav activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="relative z-10 pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-4">
          {visible && booted && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              {/* ═══════ HOME ═══════ */}
              {activeSection === "home" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-6">
                  {/* Hero */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary text-lg">_</span>
                      <span className="text-sm font-mono text-foreground">Jimnah<span className="text-accent">.</span></span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-foreground font-mono tracking-tight leading-none mb-3">
                      Jimnah Kabiria
                    </h1>
                    <div className="text-xs md:text-sm font-mono text-foreground/70 tracking-[0.08em] mb-4">
                      Security Analyst <span className="text-border mx-1">|</span> Penetration Tester <span className="text-border mx-1">|</span> CTF Player
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-[9px] font-mono text-primary tracking-widest uppercase">Available for engagement</span>
                    </div>
                  </div>

                  {/* Terminal pathing */}
                  <div className="mb-3">
                    <span className="text-[10px] font-mono text-muted-foreground/50">jimnah@secure:~$ </span>
                    <span className="text-[10px] font-mono text-primary">./init_identity</span>
                    <span className="text-[10px] font-mono text-primary animate-cursor ml-0.5">_</span>
                  </div>

                  {/* Hero Data Visualization */}
                  <HeroVisual />

                  {/* Marquee Ticker */}
                  <MarqueeTicker />

                  {/* Recent Activity */}
                  {prompt("cat ./recent-activity")}
                  <div className="ml-6 mt-3 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono text-foreground/70">Recent Activity</span>
                      <button onClick={() => handleNavigate("projects")} className="flex items-center gap-1 text-[9px] font-mono text-foreground/50 hover:text-primary transition-colors">
                        View all logs <span className="text-primary/60"> </span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {activityItems.map((item, i) => (
                        <article key={item.title}
                          className="group cursor-pointer relative"
                          onClick={() => handleNavigate("projects")}
                        >
                          {/* Card */}
                          <div className="rounded-xl bg-card overflow-hidden border border-border/40 shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-all duration-500">
                            {/* Visual */}
                            <div className="aspect-[4/5] relative overflow-hidden">
                              {/* Grayscale base image */}
                              <div className="absolute inset-0 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105">
                                <div className={`w-full h-full bg-gradient-to-br ${
                                  i === 0 ? 'from-slate-800 via-slate-700 to-slate-900' :
                                  i === 1 ? 'from-slate-900 via-slate-800 to-indigo-950' :
                                  'from-slate-800 via-slate-900 to-slate-800'
                                }`}>
                                  <div className="absolute inset-0 opacity-40"
                                    style={{ backgroundImage: i === 0
                                      ? 'radial-gradient(circle at 30% 40%, rgba(0,212,255,0.2) 0%, transparent 50%), repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px)'
                                      : i === 1
                                      ? 'radial-gradient(circle at 70% 60%, rgba(0,255,65,0.15) 0%, transparent 50%), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px)'
                                      : 'radial-gradient(circle at 50% 30%, rgba(0,212,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,184,0,0.1) 0%, transparent 50%)'
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="absolute top-3 right-3 text-[8px] font-mono text-foreground/30 tracking-wider">
                                {item.date}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-3">
                              <h3 className="text-[11px] font-mono font-medium text-foreground group-hover:text-accent transition-colors duration-300 leading-relaxed mb-2">
                                {item.title}
                              </h3>
                              <div className="flex items-center justify-between">
                                <span className="text-[8px] font-mono text-slate-500 tracking-[0.15em] uppercase">
                                  {item.category} <span className="text-foreground/20 mx-1"> </span> {item.meta}
                                </span>
                                {/* Icon inversion arrow */}
                                <div className="w-6 h-6 rounded-full border border-border/40 flex items-center justify-center transition-all duration-300 group-hover:border-transparent group-hover:bg-primary">
                                  <span className="text-[9px] leading-none text-foreground/30 transition-colors duration-300 group-hover:text-background">↗</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>

                  {/* Expertise Bento Grid */}
                  {prompt("cat ./expertise")}
                  <div className="ml-6 mt-3 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 auto-rows-[140px]">
                      {expertiseGrid.map((card, i) => {
                        const colSpan = card.size === "large" ? "md:col-span-2 md:row-span-2" : card.size === "wide" ? "md:col-span-4" : "md:col-span-1";
                        return (
                          <motion.div key={card.title}
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className={`${colSpan} border border-border rounded-lg bg-card p-4 hover:border-primary/15 transition-all group relative overflow-hidden`}
                          >
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${i % 2 === 0 ? 'from-primary/[0.03]' : 'from-accent/[0.03]'} to-transparent`} />
                            <div className="relative z-10 h-full flex flex-col">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-accent font-mono">{card.icon}</span>
                                <h3 className="text-[11px] font-mono text-foreground font-semibold group-hover:text-primary transition-colors">
                                  {card.title}
                                </h3>
                              </div>
                              <p className="text-[9px] font-mono text-foreground/60 leading-relaxed flex-1">
                                {card.desc}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Terminal Scanner */}
                  {prompt("cat ./scan-results")}
                  <div className="ml-6 mt-3 mb-8">
                    <TerminalScanner />
                  </div>

                  {/* Quick links */}
                  <div className="section-divider my-8" />
                  {prompt("ls -la ./quick-links/")}
                  <div className="ml-6 mt-2 flex flex-wrap gap-1.5 mb-8">
                    {[
                      { label: "case-files", path: "projects" },
                      { label: "whoami", path: "about" },
                      { label: "toolkit", path: "tools" },
                      { label: "cheats", path: "cheatsheets" },
                      { label: "stats", path: "stats" },
                      { label: "contact", path: "contact" },
                    ].map((link) => (
                      <button key={link.path} onClick={() => handleNavigate(link.path)}
                        className="px-2 py-1 text-[9px] font-mono border border-border rounded text-foreground/50 hover:text-primary hover:border-primary/40 transition-colors"
                      >./{link.label}</button>
                    ))}
                  </div>

                  {/* Stats */}
                  {prompt("cat ./stats")}
                  <div className="ml-6 mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { label: "CASE FILES", value: "8" },
                      { label: "OPERATIONS", value: "6" },
                      { label: "DEPLOYMENTS", value: "3" },
                      { label: "MACHINES", value: "10+" },
                      { label: "SHERLOCKS", value: "5+" },
                      { label: "ENGAGEMENTS", value: "15+" },
                    ].map(s => (
                      <div key={s.label} className="border border-border rounded p-2.5 text-center bg-card">
                        <div className="text-sm font-mono font-bold text-primary">{s.value}</div>
                        <div className="text-[9px] font-mono text-foreground/50 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ═══════ ABOUT — Glass Overlay + Brighter Text ═══════ */}
              {activeSection === "about" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-8">
                  <div className="text-xs font-mono text-foreground/70 mb-4">
                    <span className="text-foreground/50">user@portfolio:~$</span> <span className="text-accent">./about</span>
                  </div>

                  {heading("Professional Summary")}
                  {/* Glass overlay block */}
                  <div className="ml-4 pl-3 border-l border-border/40 space-y-2 mb-6 bg-background/50 backdrop-blur-sm rounded-sm p-3">
                    {prompt("whoami")}
                    <div className="ml-6 text-xs font-mono text-foreground/80 leading-6 space-y-0.5">
                      <div><span className="text-accent">[IDENTITY]</span>  <span className="text-primary font-semibold">Security Analyst</span> <span className="text-foreground/50">|</span> Penetration Tester <span className="text-foreground/50">|</span> CTF Player</div>
                      <div><span className="text-accent">[DOMAIN]</span>  <span className="text-foreground/80">Network Architecture</span> <span className="text-foreground/50">|</span> <span className="text-foreground/80">Cloud Security</span> <span className="text-foreground/50">|</span> <span className="text-foreground/80">Digital Forensics</span></div>
                      <div><span className="text-accent">[LEVEL]</span>  <span className="text-foreground/80">Senior</span> <span className="text-foreground/50"> </span> <span className="text-foreground/80">5+ years active operations</span></div>
                    </div>
                    {prompt("cat focus.txt")}
                    <div className="ml-6 text-xs font-mono text-foreground/80 leading-6 space-y-0.5">
                      <div><span className="text-accent">[FOCUS]</span>  <span className="text-foreground/80">APT Detection</span> <span className="text-foreground/50">|</span> <span className="text-foreground/80">Active Directory Security</span> <span className="text-foreground/50">|</span> <span className="text-foreground/80">Malware Analysis</span></div>
                      <div><span className="text-accent">[STATUS]</span>  <span className="text-foreground/80">Active research: CVE-2024-XXXX, CVE-2025-XXXX</span></div>
                      <div><span className="text-accent">[CHANNEL]</span>  <span className="text-foreground/80">Technical writeups</span> <span className="text-foreground/50">|</span> <span className="text-foreground/80">CTF competitions</span> <span className="text-foreground/50">|</span> <span className="text-foreground/80">Community intel sharing</span></div>
                    </div>
                  </div>

                  {heading("Technical Arsenal")}
                  {/* Glass overlay block */}
                  <div className="ml-4 pl-3 border-l border-border/40 space-y-4 mb-6 bg-background/40 backdrop-blur-sm rounded-sm p-3">
                    {[{ label: "Digital Forensics", items: skills.forensics }, { label: "Security & Defense", items: skills.defense }].map(g => (
                      <div key={g.label}>
                        <div className="flex items-center gap-2 mb-2"><span className="text-primary text-[10px] font-mono">#</span><span className="text-[10px] font-mono text-accent">{g.label}</span></div>
                        <div className="flex flex-wrap gap-1.5 ml-3">
                          {g.items.map(t => <span key={t} className="px-2 py-0.5 text-[9px] font-mono border border-border/60 rounded text-foreground/70 bg-card/80">{t}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {heading("Certifications")}
                  {/* Glass overlay block */}
                  <div className="ml-4 pl-3 border-l border-border/40 space-y-1.5 mb-6 bg-background/40 backdrop-blur-sm rounded-sm p-3">
                    {certifications.map(c => (
                      <div key={c.name} className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-foreground/80">{c.name}</span>
                        <span className="text-foreground/50">{c.org}</span>
                      </div>
                    ))}
                  </div>

                  {heading("Connect & Collaborate")}
                  {/* Glass overlay block */}
                  <div className="ml-4 pl-3 border-l border-border/40 space-y-1.5 bg-background/40 backdrop-blur-sm rounded-sm p-3">
                    <div className="text-[9px] font-mono text-foreground/50 mb-1">jimnah@connect:~$ ./contacts</div>
                    {connectLinks.map(l => (
                      <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[10px] font-mono text-foreground/70 hover:text-primary transition-colors">
                        <span className="text-primary/60">{l.icon}</span>
                        <span className="text-foreground/90">{l.label}</span>
                        <span className="text-foreground/30 text-[8px]">[EXTERNAL]</span>
                      </a>
                    ))}
                    <div className="pt-1 text-[9px] font-mono text-primary/70">[STATUS] Open for collaboration <span className="text-foreground/40">|</span> PGP: available upon request</div>
                  </div>
                </motion.div>
              )}

              {/* Other sections */}
              {activeSection === "tools" && <SectionWrap label="tools"><ToolsSection /></SectionWrap>}
              {activeSection === "cheatsheets" && <SectionWrap label="cheatsheets"><CheatSheetsSection /></SectionWrap>}
              {activeSection === "stats" && <SectionWrap label="stats"><StatsSection /></SectionWrap>}
              {activeSection === "projects" && <SectionWrap label="projects"><ProjectsSection /></SectionWrap>}
              {activeSection === "contact" && <SectionWrap label="contact"><ContactSection /></SectionWrap>}

              {/* Footer */}
              <div className="section-divider mt-16" />
              <div className="flex flex-wrap items-start justify-between gap-6 py-4">
                <div className="space-y-2">
                  <span className="text-[8px] font-mono text-foreground/30 tracking-wider uppercase">/directory</span>
                  <div className="flex items-center gap-3">
                    {["Work", "About", "Contact"].map(l => (
                      <button key={l} onClick={() => handleNavigate(l.toLowerCase())} className="text-[9px] font-mono text-foreground/50 hover:text-primary transition-colors duration-200 uppercase tracking-wider">{l}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[8px] font-mono text-foreground/30 tracking-wider uppercase">/connections</span>
                  <div className="flex items-center gap-3">
                    <a href="https://github.com/pockedcargo" target="_blank" rel="noopener noreferrer" className="text-[9px] font-mono text-foreground/50 hover:text-primary transition-colors duration-200">GH</a>
                    <a href="https://www.linkedin.com/in/jimnah-kabiria-/" target="_blank" className="text-[9px] font-mono text-foreground/50 hover:text-primary transition-colors duration-200">LI</a>
                    <a href="mailto:jimnahkabiria@gmail.com" className="text-[9px] font-mono text-foreground/50 hover:text-primary transition-colors duration-200">@</a>
                  </div>
                </div>
                <div className="space-y-2 ml-auto">
                  <span className="text-[8px] font-mono text-foreground/30 tracking-wider uppercase">/status</span>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> All systems operational
                  </div>
                </div>
              </div>
              <div className="text-[8px] font-mono text-center text-foreground/30 pb-4 pt-2">
                &copy; 2026 Jimnah Kabiria
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <ChallengeQuestion />
      <LiveFeed />

      <style>{`
        @keyframes scanMove { 0%,100% { top: 0; } 50% { top: 95%; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
      `}</style>
    </div>
  );
}

/* Section wrapper helper */
function SectionWrap({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="pt-8">
      <div className="text-xs font-mono text-foreground/50 mb-4">user@portfolio:~/{label}$</div>
      {children}
    </motion.div>
  );
}
