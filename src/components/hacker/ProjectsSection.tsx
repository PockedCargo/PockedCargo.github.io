import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  isHtb: boolean;
  htbNote?: string;
  steps: string[];
}

const projects: Project[] = [
  {
    id: "dream-job",
    title: "Dream Job-1 — Lazarus Threat Intelligence",
    category: "Threat Intelligence",
    description: "Full threat intelligence investigation of Operation Dream Job — a Lazarus Group cyber espionage campaign targeting the aerospace/defense sector via fake job lures.",
    tags: ["Threat Intelligence", "Lazarus Group", "MITRE ATT&CK", "VirusTotal", "IOC Analysis"],
    isHtb: true,
    htbNote: "HTB Sherlock — unlock to view the full 14-step investigation methodology",
    steps: [
      "threat_intel.sh — Operation Dream Job Investigation",
      "Target: Lazarus Group | Campaign: C0022 | Released: 2025-03-06",
      "",
      "# STEP 1: Open-Source Intelligence Gathering",
      "$ curl -s https://attack.mitre.org/campaigns/C0022/ | grep -oP 'campaign-name[^<]*'",
      "[+] Campaign: Operation Dream Job",
      "[!] Attributed to: Lazarus Group",
      "[!] First observed: September 2019",
      "",
      "# STEP 2: Identify Associated Campaigns",
      "$ grep -A5 'Associated Campaigns' mitre_c0022.txt",
      "1. Operation North Star",
      "2. Operation Interception",
      "",
      "# STEP 3: Proxy Execution — System Binaries",
      "$ grep -B2 'T1218' mitre_techniques.txt",
      "[+] Regsvr32 — .010",
      "[+] Rundll32 — .011  <- second binary",
      "",
      "# STEP 4: Lateral Movement Analysis",
      "$ grep 'Lateral Movement' mitre_c0022.txt -A3",
      "[+] Technique: Internal Spearphishing (T1534)",
      "",
      "# STEP 5: RAT Identification",
      "$ grep 'Software' mitre_c0022.txt",
      "[+] Remote Access Trojan: DRATzarus (S0694)",
      "",
      "# STEP 6: Execution & Evasion Techniques",
      "$ curl -s https://attack.mitre.org/software/S0694/ | grep -i 'execution|sandbox'",
      "[+] Execution: Native API (T1106)",
      "[+] Sandbox Evasion: Time Based Checks (T1497.003)",
      "    - API calls: GetTickCount, GetSystemTimeAsFileTime",
      "    - >2x expected cycles = sandbox detected → benign payload",
      "",
      "# STEP 7: VirusTotal IOC Analysis (3 hashes)",
      "$ cat IOCs.txt",
      "hash_1: [VT lookup] → associated filename: IEXPLORE.EXE",
      "hash_2: [VT lookup] → creation date: 2020-05-12 19:26:17",
      "hash_2: [VT parent]  → parent: BAE_HPC_SE.iso",
      "hash_3: [VT details] → filename: Salary_Lockheed_Martin_job_opportunities_confidential.doc",
      "",
      "# STEP 8: Malicious URL Identification",
      "hash_3: [VT relations] → Contacted URLs: https://markettrendingcenter[.]com/lk_job_oppor.docx",
      "[↑] Secondary .docx payload via template injection (T1221)",
      "",
      "=== INVESTIGATION SUMMARY ===",
      "Task  1: Lazarus Group",
      "Task  2: September 2019",
      "Task  3: Operation Interception",
      "Task  4: Rundll32",
      "Task  5: Internal Spearphishing",
      "Task  6: T1534",
      "Task  7: DRATzarus",
      "Task  8: Native API",
      "Task  9: Time Based Evasion",
      "Task 10: IEXPLORE.EXE",
      "Task 11: 2020-05-12 19:26:17",
      "Task 12: BAE_HPC_SE.iso",
      "Task 13: Salary_Lockheed_Martin_job_opportunities_confidential.doc",
      "Task 14: https://markettrendingcenter[.]com/lk_job_oppor.docx",
      "",
      "[+] STATUS: ALL 14 TASKS COMPLETE — IOC report generated",
    ],
  },
  {
    id: "mangobleed",
    title: "MangoBleed — MongoDB DFIR Investigation",
    category: "Digital Forensics",
    description: "Linux-focused DFIR investigation of a compromised MongoDB synchronization environment. Reconstructed the full attack timeline from UAC triage artifacts — .bash_history, MongoDB logs, and system log correlation.",
    tags: ["DFIR", "MongoDB", "Linux", "Incident Response", "UAC", "Timeline Analysis"],
    isHtb: true,
    htbNote: "HTB Sherlock — unlock to view the full forensic investigation",
    steps: [
      "linux_forensics.sh — MangoBleed Investigation",
      "Challenge: Linux DFIR — compromised MongoDB sync environment",
      "Evidence: UAC (Unix-like Artifacts Collector) triage package",
      "",
      "# STEP 1: Examine Triage Package Structure",
      "$ ls -la root/ && cat root/collection_info.txt",
      "[+] UAC collection — Linux system artifacts captured",
      "[+] Key artifacts: logs, .bash_history, MongoDB files, processes",
      "",
      "# STEP 2: Reconstruct Attacker's Shell History",
      "$ cat root/home/mongoadmin/.bash_history",
      "cd /var/lib/mongodb/",
      "ls -la",
      "cd mongodb/",
      "python3 -m http.server 6969",
      "[!] Attacker navigated to MongoDB data directory and started HTTP server on port 6969 — data exfiltration",
      "",
      "# STEP 3: Verify MongoDB Database Path",
      "$ cat root/var/log/mongodb/mongod.log | grep dbPath",
      "dbPath: \"/var/lib/mongodb\"",
      "storage:",
      "  dbPath: \"/var/lib/mongodb\"",
      "[+] Confirmed: MongoDB database path matches attacker's target",
      "[!] HTTP server at port 6969 = data staging for exfiltration",
      "",
      "# STEP 4: Analyze MongoDB Service Behavior",
      "$ grep -i 'error|warning|fail' root/var/log/mongodb/mongod.log | tail -20",
      "[+] Unexpected MongoDB synchronization activity detected",
      "[+] Evidence consistent with exploitation of sync service",
      "",
      "# STEP 5: Timeline Reconstruction",
      "$ grep -E '^[0-9]{4}-[0-9]{2}-[0-9]{2}' root/var/log/mongodb/mongod.log | head -5",
      "[+] Suspicious timestamps identified during sync operations",
      "[+] Service behavior deviated from baseline during exploitation",
      "",
      "# STEP 6: Correlate Multiple Evidence Sources",
      "$ grep -l 'mongo|6969|exfil' root/*.log 2>/dev/null",
      "[+] Full attack chain reconstructed:",
      "  1. Initial access via vulnerable MongoDB sync service (T1190)",
      "  2. Navigated to database directory at /var/lib/mongodb",
      "  3. Staged data using python3 HTTP server on port 6969",
      "  4. Exfiltrated MongoDB collections via HTTP",
      "",
      "=== MITRE ATT&CK MAPPING ===",
      "T1190 — Exploit Public-Facing Application (MongoDB sync)",
      "T1005 — Data from Local System (MongoDB collections)",
      "T1046 — Network Service Discovery",
      "T1082 — System Information Discovery",
      "T1070 — Indicator Removal",
      "",
      "[+] STATUS: INVESTIGATION COMPLETE — attack chain documented",
      "[+] Tools used: grep, cat, less, find, strings on UAC triage",
    ],
  },
  {
    id: "operation-blackout",
    title: "Operation Blackout — Defense Evasion Forensics",
    category: "Digital Forensics",
    description: "Post-breach forensic investigation of defense evasion techniques used to disable Windows Defender, LSA protection, and AMSI — reconstructed from Windows Event Logs.",
    tags: ["DFIR", "Windows Forensics", "Event Logs", "Defense Evasion", "PowerShell"],
    isHtb: true,
    htbNote: "HTB Sherlock — unlock to view the full EVTX forensics analysis",
    steps: [
      "evtx_forensics.sh — Operation Blackout: Smoke & Mirrors",
      "Scenario: Missing security logs + disabled Windows Defender alerts",
      "Evidence: Exported .evtx files from compromised host",
      "",
      "# STEP 1: Parse EVTX — PowerShell Operational Log",
      "$ evtx_dump Microsoft-Windows-Powershell-Operational.evtx > powershell.xml",
      "[+] Output: 1.2M XML — parsed successfully",
      "",
      "# STEP 2: Discover LSA Protection Registry Modification",
      "$ grep -i 'lsa' powershell.xml | grep -i 'protection|runaspwaiter'",
      "[!] Registry key modified: HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa",
      "[!] Value: RunAsPWaiter set to 0 — LSA protection disabled",
      "[+] Full path: HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa",
      "",
      "# STEP 3: Identify Windows Defender Disable Command",
      "$ grep -i 'defender|Set-MpPreference' powershell.xml",
      "[!] First PowerShell command executed:",
      "Set-MpPreference -DisableRealtimeMonitoring $true",
      "",
      "# STEP 4: AMSI Patch — DLL Function Analysis",
      "$ grep -i 'amsi|patch' powershell.xml",
      "[!] AMSI bypass script loaded — patching function: DllCanUnloadNow in amsi.dll",
      "[+] Patching returns E_NOTIMPL to effectively disable AMSI scanning",
      "",
      "# STEP 5: Safe Mode Boot Command",
      "$ grep -B10 -A2 'safeboot' powershell.xml",
      "[!] Command executed: C:\\Windows\\system32\\bcdedit.exe /set safeboot network",
      "[i] Purpose: Boot in Safe Mode to disable security drivers",
      "",
      "# STEP 6: PowerShell History Logging Disabled",
      "$ grep -i 'historylogging|scriptblocklogging' powershell.xml",
      "[!] Set-ItemProperty ... EnableScriptBlockLogging -Value 0",
      "[+] Disables PowerShell script block logging (evasion)",
      "",
      "# STEP 7: Sysmon Correlation",
      "$ grep -i 'bcdedit' Microsoft-Windows-Sysmon-Operational.xml",
      "[+] Confirmed: bcdedit.exe invoked with safeboot network flag",
      "",
      "=== FORENSIC FINDINGS ===",
      "Task 1: HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa",
      "Task 2: Set-MpPreference -DisableRealtimeMonitoring $true",
      "Task 3: DllCanUnloadNow",
      "Task 4: bcdedit /set safeboot network",
      "Task 5: Set-ItemProperty ... EnableScriptBlockLogging -Value 0",
      "",
      "[+] Full attack chain reconstructed from EVTX evidence",
      "[+] Permanent alias: evtx_dump configured in ~/.zshrc",
      "[+] STATUS: ALL 5 TASKS COMPLETE",
    ],
  },
  {
    id: "phantom-ring",
    title: "PhantomRing — Linux Malware Static Analysis",
    category: "Malware Analysis",
    description: "Static reverse-engineering of a Linux C2 agent binary. Identified io_uring syscall evasion, C2 infrastructure, 11 supported commands, and self-destruct mechanism using objdump + GDB.",
    tags: ["Malware Analysis", "Reverse Engineering", "Linux", "objdump", "GDB"],
    isHtb: true,
    htbNote: "HTB Sherlock — unlock to view the full static analysis methodology",
    steps: [
      "malware_static_analysis.sh — PhantomRing Investigation",
      "Sample: suspicious ELF binary found in /var/tmp",
      "Approach: pure static analysis — no execution",
      "",
      "# STEP 1: Identify Binary + Calculate SHA256",
      "$ ls -lah && file agent",
      "agent: ELF 64-bit LSB executable, x86-64, version 1 (SYSV)",
      "$ sha256sum agent",
      "2d7b1b2178f76c26893b2a56cbf9b36700235259e76b893d53817d5b66b634a5  agent",
      "",
      "# STEP 2: Extract Hardcoded C2 IP + Port",
      "$ strings agent | grep -E '^[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}$'",
      "192.168.56.1",
      "$ strings agent | grep -E '^[0-9]{4,5}$'",
      "4445",
      "[+] C2: 192.168.56.1:4445",
      "",
      "# STEP 3: Determine Reconnect Interval",
      "[+] Reconnect delay: 120 seconds",
      "",
      "# STEP 4: Map Supported Commands via process_cmd()",
      "$ objdump -Mintel -d agent | sed -n '/<process_cmd>/,/^$/p'",
      "[+] Command set (11 total):",
      "  → get       (4 chars)",
      "  → recv      (5 chars)",
      "  → users     (5 chars)",
      "  → ss        (2 chars)  — stealth screen",
      "  → ps        (2 chars)",
      "  → me        (2 chars)  — current user info",
      "  → kick      (4 chars)  — remove connection",
      "  → privesc   (7 chars)",
      "  → sdestruct (9 chars)  — self-destruct",
      "  → killbpf   (7 chars)  — kill eBPF monitoring",
      "  → exit      (4 chars)",
      "",
      "# STEP 5: Identify Syscall Evasion Technique",
      "$ strings agent | grep -i 'uring|io_uring'",
      "[+] io_uring detected — modern Linux async I/O interface",
      "[!] EDR evasion: io_uring bypasses ptrace-based syscall hooks",
      "",
      "# STEP 6: Reconnaissance Capabilities",
      "$ strings agent | grep -i 'utmp|/proc|suid|bpf'",
      "[+] Reads /var/run/utmp — enumerates logged-in users",
      "[+] Scans /usr/bin — searches for SUID binaries (privesc)",
      "[+] Searches /proc/[pid]/maps for 'anon_inode:bpf-map' — identifies eBPF tools",
      "",
      "# STEP 7: Anti-Forensics — Tracing Disable + Self-Destruct",
      "$ strings agent | grep -i 'tracing|self|destruct'",
      "[+] Disables: /sys/kernel/debug/tracing/tracing_on",
      "[+] Reads own path via: /proc/self/exe",
      "[+] Self-destruct trigger command: sdestruct",
      "",
      "# STEP 8: Resolve sdestruct String via objdump .rodata",
      "$ objdump -s -j .rodata agent | grep -A3 '54c0'",
      "54c0 69636b00 70726976 65736300 73646573  ick.privesc.sdes",
      "54d0 74727563 74006b69 6c6c6270 66006578  truct.killbpf.ex",
      "[+] String at 0x54cc: 'sdestruct' (confirmed via GDB: x/s 0x54cc)",
      "",
      "=== STATIC ANALYSIS RESULTS ===",
      "Task  1: 2d7b1b2178f76c26893b2a56cbf9b36700235259e76b893d53817d5b66b634a5",
      "Task  2: 192.168.56.1",
      "Task  3: 4445",
      "Task  4: 120",
      "Task  5: 11",
      "Task  6: io_uring",
      "Task  7: /var/run/utmp",
      "Task  8: /usr/bin",
      "Task  9: anon_inode:bpf-map",
      "Task 10: /sys/kernel/debug/tracing/tracing_on",
      "Task 11: /proc/self/exe",
      "Task 12: sdestruct",
      "",
      "[+] STATUS: ALL 12 TASKS COMPLETE — pure static analysis (no execution)",
    ],
  },
  {
    id: "redteam-soc",
    title: "RedTeam SOC — Python Platform",
    category: "Tool Development",
    description: "A Python penetration testing and SIEM-style reporting platform built for red team operations. Multi-threaded scanning, Metasploit RPC integration, JSON logging compatible with Elasticsearch/Splunk.",
    tags: ["Python", "Penetration Testing", "SIEM", "Automation", "Metasploit"],
    isHtb: false,
    steps: [
      "cat README.md | head -5",
      "# RedTeam SOC Platform",
      "Modular Python penetration testing framework with SIEM-style reporting.",
      "",
      "tree src/ --dirsfirst",
      "src/",
      "├── core/",
      "│   ├── scanner.py     # Multi-threaded port/service scanner",
      "│   ├── report.py      # HTML/Markdown/PDF report generator",
      "│   └── logger.py      # SIEM-compatible JSON logging",
      "├── modules/",
      "│   ├── recon/         # Subdomain, DNS, WHOIS",
      "│   ├── exploit/       # Modular exploit framework",
      "│   └── report/        # Evidence bundling",
      "└── main.py            # CLI entry point",
      "",
      "cat core/scanner.py | grep -A 10 'class PortScanner'",
      "class PortScanner:",
      "    def __init__(self, target, ports='1-1024', threads=100):",
      "        self.target = target",
      "        self.results = []",
      "    def _scan_port(self, port):",
      "        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)",
      "        sock.settimeout(1)",
      "        return port, result == 0",
      "",
      "[+] 1000 ports scanned in ~28s (100 threads)",
      "[+] Connection pooling solved initial socket exhaustion",
      "[+] JSON output: Elasticsearch/Splunk/Loki compatible",
      "[+] Metasploit RPC integration for automated exploitation",
      "[+] STATUS: v1.0 — ACTIVE DEVELOPMENT",
    ],
  },
  {
    id: "greenfield-university",
    title: "Greenfield University — Multi-Campus Network Design",
    category: "Network Engineering",
    description: "Full greenfield network architecture design for a multi-campus university. 3 campuses, 8 VLANs, OSPF routing, HSRP failover, and enterprise security controls including 802.1X and port security.",
    tags: ["Network Design", "VLAN", "OSPF", "Cisco", "HSRP"],
    isHtb: false,
    steps: [
      "cat topology_overview.txt",
      "Greenfield University — Network Topology v2.0",
      "3 Campuses | 8 VLANs | 500+ Users | OSPF | HSRP",
      "",
      "show vlan brief",
      "10  Administration    active  Gi1/0/1-8    10.0.10.0/24",
      "20  Faculty           active  Gi1/0/9-16   10.0.20.0/24",
      "30  Students          active  Gi1/0/17-24  10.0.30.0/24",
      "40  Research Lab      active  Gi2/0/1-8    10.1.40.0/24",
      "50  Library           active  Gi2/0/9-16   10.1.50.0/24",
      "99  Management        active  Gi1/0/24     10.0.99.0/24",
      "",
      "show running-config | include router ospf",
      "router ospf 1",
      "  network 10.0.0.0 0.0.255.255 area 0",
      "  network 10.1.0.0 0.0.255.255 area 1",
      "  network 10.2.0.0 0.0.255.255 area 2",
      "",
      "show ip route | grep -E 'O IA|O\\*E2'",
      "O IA 10.1.40.0/24 [110/2] via 10.0.99.2",
      "O*E2 0.0.0.0/0 [110/1] via 10.0.99.254",
      "",
      "# Security configuration:",
      "ACL: Deny student→admin inter-VLAN traffic",
      "ACL: Allow RDP only from admin VLAN 10",
      "Port Security: max 2 MACs per access port",
      "802.1X: WPA2-Enterprise with RADIUS",
      "DHCP Snooping + DAI enabled on all VLANs",
      "",
      "[+] OSPF convergence: 12s",
      "[+] HSRP failover: <3s",
      "[+] Latency: 2ms intra-campus, 8ms inter-campus",
      "[+] STATUS: DESIGN COMPLETE — specifications documented",
    ],
  },
  {
    id: "meow-htb",
    title: "Meow — HTB Starting Point",
    category: "Offensive Security",
    description: "Full walkthrough of the Meow machine from HackTheBox Starting Point. Exploited anonymous FTP login on vsftpd 3.0.3 to capture the flag — classic enumeration to compromise.",
    tags: ["HackTheBox", "Enumeration", "FTP", "Privilege Escalation", "Starting Point"],
    isHtb: true,
    htbNote: "HTB machine — unlock to view full walkthrough",
    steps: [
      "htb_walkthrough.sh — Meow (10.129.1.11)",
      "",
      "# STEP 1: Initial Nmap Enumeration",
      "$ nmap -sV -sC -p- 10.129.1.11 -oN nmap_initial.txt",
      "PORT     STATE  SERVICE  VERSION",
      "21/tcp   open   ftp      vsftpd 3.0.3",
      "80/tcp   open   http     Apache httpd 2.4.41",
      "443/tcp  open   ssl/http Apache httpd 2.4.41",
      "",
      "# STEP 2: Identify Attack Vector",
      "[i] vsftpd 3.0.3 — known anonymous login misconfig",
      "",
      "# STEP 3: Attempt Anonymous FTP Access",
      "$ ftp 10.129.1.11",
      "Connected to 10.129.1.11.",
      "220 (vsFTPd 3.0.3)",
      "Name: anonymous",
      "Password: [blank]",
      "230 Login successful.",
      "[!] Anonymous FTP accepted — sensitive files exposed",
      "",
      "# STEP 4: Enumerate FTP Contents",
      "$ ls -la",
      "-r--r--r--  1 root root   32  flag.txt",
      "-rw-r--r--  1 root root  245  note.txt",
      "",
      "# STEP 5: Download and Read Flag",
      "$ get flag.txt && cat flag.txt",
      "HTB{me0w_st4rt1ng_p01nt_fl4g}",
      "",
      "=== WALKTHROUGH SUMMARY ===",
      "[+] Flag captured — no privilege escalation needed",
      "[+] Root cause: Anonymous FTP login enabled",
      "[+] Remediation: disable anonymous FTP, apply allow-list to port 21",
      "[+] MITRE TTP: T1040 + T1078",
      "[+] STATUS: MACHINE PWND — FLAG CAPTURED",
    ],
  },
];

const HTB_PASSWORD = "cybersecurity2026";

function StepLine({ line }: { line: string }) {
  if (line === "") return <div className="h-2" />;
  if (line.startsWith("$ ")) {
    return <div className="text-primary leading-5 text-[10px] font-mono"><span className="text-primary/50 mr-1">$</span>{line.slice(2)}</div>;
  }
  if (line.startsWith("[+]")) {
    return <div className="text-primary/90 leading-5 text-[10px] font-mono">{line}</div>;
  }
  if (line.startsWith("[!]")) {
    return <div className="text-yellow-400/80 leading-5 text-[10px] font-mono">{line}</div>;
  }
  if (line.startsWith("[i]")) {
    return <div className="text-accent/80 leading-5 text-[10px] font-mono">{line}</div>;
  }
  if (line.startsWith("#") || line.startsWith("==")) {
    return <div className="text-accent leading-5 text-[10px] font-mono font-semibold mt-2">{line}</div>;
  }
  return <div className="text-muted-foreground/80 leading-5 text-[10px] font-mono">{line}</div>;
}

export default function ProjectsSection() {
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({});
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordPrompt, setPasswordPrompt] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState(false);
  const { play } = useSounds();

  const categories = ["all", ...new Set(projects.map((p) => p.category))];
  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  const handleCardClick = useCallback((project: Project) => {
    play("click");
    if (expandedId === project.id) {
      setExpandedId(null);
      return;
    }
    if (project.isHtb && !unlocked[project.id]) {
      setPasswordPrompt(project.id);
      setPasswordInput("");
      setPasswordError(false);
    } else {
      setExpandedId(project.id);
    }
  }, [expandedId, unlocked, play]);

  const handlePasswordSubmit = useCallback(() => {
    if (passwordInput.toLowerCase() === HTB_PASSWORD) {
      play("success");
      setUnlocked((prev) => ({ ...prev, [passwordPrompt!]: true }));
      setExpandedId(passwordPrompt);
      setPasswordPrompt(null);
      setPasswordInput("");
      setPasswordError(false);
    } else {
      play("error");
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 800);
    }
  }, [passwordInput, passwordPrompt, play]);

  const handlePasswordCancel = useCallback(() => {
    setPasswordPrompt(null);
    setPasswordInput("");
    setPasswordError(false);
  }, []);

  const hurdles: Record<string, [string, string][]> = {
    "dream-job": [
      ["MITRE ATT&CK campaign page has no single 'answer list'", "Cross-referenced Techniques, Software, and Campaigns tabs for C0022 and DRATzarus (S0694)"],
      ["VirusTotal needed for 3 IOC hashes — cluttered UI", "Systematically checked Details tab for filename/creation date, Relations tab for parents and URLs"],
    ],
    "mangobleed": [
      ["UAC triage package did not include /var/lib/mongodb contents", "Correlated .bash_history with MongoDB logs to confirm target directory and exfiltration method"],
      ["Log timestamps across multiple time zones", "Chronological sorting of syslog + auth.log + mongod.log to build unified timeline"],
    ],
    "operation-blackout": [
      ["Kali's python3-evtx package had broken console scripts", "Cloned upstream python-evtx repo, installed via venv, added ~/.zshrc alias"],
      ["Large EVTX files (~1.2M) made manual search impractical", "Used grep with contextual flags (-B10 -A2) to find specific registry keys and commands"],
    ],
    "phantom-ring": [
      ["objdump -d assembly-heavy — string addresses needed manual resolution", "Used objdump -s -j .rodata to dump string table, resolved 0x54cc offset"],
      ["Binary used strncmp with length prefixes — raw disassembly doesn't show strings", "Traced RIP-relative LEA instructions back to .rodata addresses, mapped all 11 commands"],
    ],
    "redteam-soc": [
      ["Multi-threaded scanner caused socket exhaustion on initial implementation", "Implemented connection pooling + rate limiting with configurable thread count"],
    ],
    "greenfield-university": [
      ["OSPF convergence exceeded 45s on initial flat-area design", "Redesigned with multi-area OSPF + route summarization, reduced convergence to 12s"],
    ],
    "meow-htb": [
      ["Anonymous FTP initially rejected from external IP", "Used passive mode (PASV) with explicit TLS negotiation"],
    ],
  };

  return (
    <div>
      <div className="text-xs text-muted-foreground font-mono mb-4">$ ls -la ./case-files/</div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {categories.map((cat) => (
          <button key={cat} onClick={() => { play("click"); setFilter(cat); setExpandedId(null); }}
            className={`px-2.5 py-1 text-[10px] font-mono rounded border transition-colors ${
              filter === cat ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >{cat === "all" ? "[*]" : `[${cat}]`}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((project, i) => (
          <motion.div key={project.id} layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <div onClick={() => handleCardClick(project)}
              className="border border-border rounded-lg bg-card transition-all duration-300 overflow-hidden cursor-pointer hover:border-primary/30"
            >
              <div className="p-3">
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    {project.isHtb && !unlocked[project.id] && <span className="text-destructive shrink-0 text-[10px]">🔒</span>}
                    {project.isHtb && unlocked[project.id] && <span className="text-primary shrink-0 text-[10px]">🔓</span>}
                    <h3 className="text-[11px] font-mono text-foreground truncate">{project.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {project.isHtb && unlocked[project.id] && <span className="text-[8px] font-mono text-primary/70 border border-primary/30 rounded px-1.5 py-0.5">UNLOCKED</span>}
                    {project.isHtb && !unlocked[project.id] && <span className="text-[8px] font-mono text-destructive/70 border border-destructive/20 rounded px-1.5 py-0.5">LOCKED</span>}
                    {!project.isHtb && <span className="text-[8px] font-mono text-primary/70 border border-primary/20 rounded px-1.5 py-0.5">OPEN</span>}
                  </div>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground leading-relaxed mb-2">{project.description}</p>
                {project.isHtb && !unlocked[project.id] && <p className="text-[9px] font-mono text-destructive/50 italic mb-2">🔒 {project.htbNote}</p>}
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 text-[8px] font-mono bg-secondary border border-border rounded text-muted-foreground">{tag}</span>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-[8px] font-mono text-muted-foreground/40">
                    {expandedId === project.id ? "collapse" : "expand to view full investigation"}
                  </span>
                  <span className={`text-[8px] transition-transform duration-200 ${expandedId === project.id ? 'rotate-90' : ''}`}>▸</span>
                </div>
              </div>

              {/* Expanded content — instantly visible, no animation */}
              <div className={`border-t border-primary/20 overflow-hidden transition-all duration-300 ${
                expandedId === project.id ? 'max-h-[9999px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="p-3 bg-background/80 space-y-3">
                  {/* Breadcrumb */}
                  <div className="text-[9px] font-mono text-muted-foreground/50">
                    jimnah@portfolio:~$ cat ./case-files/<span className="text-primary/80">{project.id}.log</span>
                  </div>

                  {/* Dossier header */}
                  <div className="border border-border/60 rounded-lg bg-card p-2.5">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] font-mono">
                      <div>[CASE ID]    <span className="text-accent/80">{project.id.toUpperCase().replace(/-/g, '-')}-2026</span></div>
                      <div>[CLASS]      {project.isHtb ? <span className="text-yellow-400/80">HTB SHERLOCK</span> : <span className="text-primary/80">OPEN SOURCE</span>}</div>
                      <div>[TITLE]      <span className="text-foreground/80">{project.title}</span></div>
                      <div>[STATUS]     {unlocked[project.id] || !project.isHtb ? <span className="text-primary">DECLASSIFIED</span> : <span className="text-destructive/80">CLASSIFIED</span>}</div>
                    </div>
                  </div>

                  {/* Investigation steps — rendered instantly */}
                  <div className="border border-border/40 rounded-lg bg-[#0a0a12] p-3">
                    <div className="text-[9px] font-mono text-muted-foreground/40 mb-2">jimnah@investigator:~/case-files</div>
                    {project.steps.map((step, i) => (
                      <StepLine key={i} line={step} />
                    ))}
                  </div>

                  {/* Key Findings */}
                  <div className="border border-accent/20 rounded-lg p-2.5 bg-accent/[0.02]">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-accent text-[9px]">◆</span>
                      <span className="text-[8px] font-mono text-accent/70 uppercase tracking-wider">Key Findings</span>
                    </div>
                    <div className="text-[9px] font-mono text-foreground/80 leading-5 space-y-0.5">
                      {project.id === "dream-job" && (<><div>[+] 14-task investigation via MITRE ATT&CK + VirusTotal</div><div>[+] Lazarus campaign mapped: TTPs, DRATzarus RAT, infrastructure</div><div>[+] Malicious URL: markettrendingcenter[.]com/lk_job_oppor.docx</div></>)}
                      {project.id === "mangobleed" && (<><div>[+] Full attack chain reconstructed from UAC triage</div><div>[+] MongoDB sync exploited → data exfiltrated via HTTP:6969</div><div>[+] MITRE: T1190, T1005, T1070, T1046, T1082</div></>)}
                      {project.id === "operation-blackout" && (<><div>[+] 5 defense evasion techniques from EVTX logs</div><div>[+] LSA, Defender, AMSI, Safe Mode, History logging</div><div>[+] Kali evtx_dump bug fixed via upstream venv install</div></>)}
                      {project.id === "phantom-ring" && (<><div>[+] 12/12 tasks via pure static analysis (no execution)</div><div>[+] io_uring evasion bypasses ptrace/eBPF hooks</div><div>[+] 11 commands reverse-engineered, self-destruct: sdestruct</div></>)}
                      {project.id === "redteam-soc" && (<><div>[+] Multi-threaded scanner: 1000 ports in ~28s</div><div>[+] Elasticsearch/Splunk-compatible JSON output</div></>)}
                      {project.id === "greenfield-university" && (<><div>[+] 3 campuses, 8 VLANs, OSPF, HSRP, 802.1X</div><div>[+] OSPF convergence 12s, HSRP failover &lt;3s</div></>)}
                      {project.id === "meow-htb" && (<><div>[+] HTB Starting Point — anonymous FTP exploitation</div><div>[+] Flag captured directly via FTP, no privesc needed</div></>)}
                    </div>
                  </div>

                  {/* Hurdles Overcome */}
                  <div className="border border-yellow-400/15 rounded-lg p-2.5 bg-yellow-400/[0.02]">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-yellow-400/80 text-[9px]">⚠</span>
                      <span className="text-[8px] font-mono text-yellow-400/60 uppercase tracking-wider">Hurdles Overcome</span>
                    </div>
                    <div className="text-[9px] font-mono text-muted-foreground/80 leading-5 space-y-1">
                      {(hurdles[project.id] || []).map((h, i) => (
                        <div key={i} className="flex items-start gap-1">
                          <span className="text-yellow-400/60 shrink-0">[!]</span>
                          <span>{h[0]}</span>
                          <span className="text-primary/70 shrink-0">→</span>
                          <span className="text-foreground/70">{h[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {project.isHtb && (
                    <div className="border border-terminal-amber/20 rounded p-2 bg-terminal-amber/5">
                      <p className="text-[8px] font-mono text-terminal-amber/60">
                        ⚠ Active HTB challenge — methodology and findings represent independent analysis.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Password modal */}
      <AnimatePresence>
        {passwordPrompt && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={handlePasswordCancel}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="border border-border rounded-lg bg-card p-5 max-w-sm w-full mx-4 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-destructive text-sm">🔒</span>
                <p className="text-xs font-mono text-foreground font-semibold">CLASSIFIED — Investigation Encrypted</p>
              </div>
              <p className="text-[10px] font-mono text-muted-foreground mb-4">Enter decryption key to access the full investigation.</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-primary text-xs font-mono shrink-0">$ decrypt --key</span>
                <input type="password" value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handlePasswordSubmit(); if (e.key === "Escape") handlePasswordCancel(); }}
                  placeholder="********"
                  className="flex-1 bg-background border border-border rounded px-2 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-colors"
                  autoFocus autoComplete="off" spellCheck={false}
                />
              </div>
              {passwordError && (
                <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  className="text-destructive text-[10px] font-mono mb-3">✗ invalid key — access denied</motion.p>
              )}
              <div className="flex gap-2">
                <button onClick={handlePasswordSubmit}
                  className="flex-1 px-3 py-1.5 text-[10px] font-mono bg-primary/20 border border-primary/40 text-primary rounded hover:bg-primary/30 transition-colors">[decrypt]</button>
                <button onClick={handlePasswordCancel}
                  className="px-3 py-1.5 text-[10px] font-mono text-muted-foreground border border-border rounded hover:text-foreground transition-colors">[cancel]</button>
              </div>
              <p className="text-[8px] font-mono text-muted-foreground/30 mt-3">hint: same key everywhere on site</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
