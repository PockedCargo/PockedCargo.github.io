import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";
import TerminalWindow from "./TerminalWindow";
import type { TerminalLine } from "./TerminalWindow";

// Re-export for type usage
export type { TerminalLine };

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  isHtb: boolean;
  htbNote?: string;
  terminalTitle: string;
  terminalLines: TerminalLine[];
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
    terminalTitle: "jimnah@investigator:~/dream-job-1",
    terminalLines: [
      { text: "", type: "dim" },
      { text: "threat_intel.sh — Operation Dream Job Investigation", type: "info" },
      { text: "Target: Lazarus Group | Campaign: C0022 | Released: 2025-03-06", type: "info" },
      { text: "", type: "dim" },
      { text: "# STEP 1: Open-Source Intelligence Gathering", type: "command" },
      { text: "curl -s https://attack.mitre.org/campaigns/C0022/ | grep -oP 'campaign-name[^<]*'", type: "command" },
      { text: "[+] Campaign: Operation Dream Job", type: "success" },
      { text: "[!] Attributed to: Lazarus Group", type: "output" },
      { text: "[!] First observed: September 2019", type: "output" },
      { text: "", type: "dim" },
      { text: "# STEP 2: Identify Associated Campaigns", type: "command" },
      { text: "grep -A5 'Associated Campaigns' mitre_c0022.txt", type: "command" },
      { text: "1. Operation North Star", type: "output" },
      { text: "2. Operation Interception", type: "output" },
      { text: "", type: "dim" },
      { text: "# STEP 3: Proxy Execution — System Binaries", type: "command" },
      { text: "grep -B2 'T1218' mitre_techniques.txt", type: "command" },
      { text: "[+] Regsvr32 — .010", type: "success" },
      { text: "[+] Rundll32 — .011  <-- second binary", type: "success" },
      { text: "", type: "dim" },
      { text: "# STEP 4: Lateral Movement Analysis", type: "command" },
      { text: "grep 'Lateral Movement' mitre_c0022.txt -A3", type: "command" },
      { text: "[+] Technique: Internal Spearphishing (T1534)", type: "success" },
      { text: "", type: "dim" },
      { text: "# STEP 5: RAT Identification", type: "command" },
      { text: "grep 'Software' mitre_c0022.txt", type: "command" },
      { text: "[+] Remote Access Trojan: DRATzarus (S0694)", type: "success" },
      { text: "", type: "dim" },
      { text: "# STEP 6: Execution & Evasion Techniques", type: "command" },
      { text: "curl -s https://attack.mitre.org/software/S0694/ | grep -i 'execution\\|sandbox'", type: "command" },
      { text: "[+] Execution: Native API (T1106)", type: "success" },
      { text: "[+] Sandbox Evasion: Time Based Checks (T1497.003)", type: "success" },
      { text: "    - API calls: GetTickCount, GetSystemTimeAsFileTime", type: "output" },
      { text: "    - Compares execution timing against expected cycles", type: "output" },
      { text: "    - >2x expected cycles = sandbox detected → benign payload", type: "output" },
      { text: "", type: "dim" },
      { text: "# STEP 7: VirusTotal IOC Analysis (3 hashes)", type: "command" },
      { text: "cat IOCs.txt", type: "command" },
      { text: "hash_1: [VT lookup] → associated filename: IEXPLORE.EXE", type: "output" },
      { text: "hash_2: [VT lookup] → creation date: 2020-05-12 19:26:17", type: "output" },
      { text: "hash_2: [VT parent]  → parent: BAE_HPC_SE.iso", type: "output" },
      { text: "hash_3: [VT details] → filename: Salary_Lockheed_Martin_job_opportunities_confidential.doc", type: "output" },
      { text: "", type: "dim" },
      { text: "# STEP 8: Malicious URL Identification", type: "command" },
      { text: "hash_3: [VT relations] → Contacted URLs:", type: "output" },
      { text: "  https://markettrendingcenter[.]com/lk_job_oppor.docx", type: "output" },
      { text: "  [↑] Secondary .docx payload via template injection (T1221)", type: "warning" },
      { text: "", type: "dim" },
      { text: "# === INVESTIGATION SUMMARY ===", type: "info" },
      { text: "Task  1: Lazarus Group", type: "output" },
      { text: "Task  2: September 2019", type: "output" },
      { text: "Task  3: Operation Interception", type: "output" },
      { text: "Task  4: Rundll32", type: "output" },
      { text: "Task  5: Internal Spearphishing", type: "output" },
      { text: "Task  6: T1534", type: "output" },
      { text: "Task  7: DRATzarus", type: "output" },
      { text: "Task  8: Native API", type: "output" },
      { text: "Task  9: Time Based Evasion", type: "output" },
      { text: "Task 10: IEXPLORE.EXE", type: "output" },
      { text: "Task 11: 2020-05-12 19:26:17", type: "output" },
      { text: "Task 12: BAE_HPC_SE.iso", type: "output" },
      { text: "Task 13: Salary_Lockheed_Martin_job_opportunities_confidential.doc", type: "output" },
      { text: "Task 14: https://markettrendingcenter[.]com/lk_job_oppor.docx", type: "output" },
      { text: "", type: "dim" },
      { text: "[+] STATUS: ALL 14 TASKS COMPLETE — IOC report generated", type: "success" },
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
    terminalTitle: "jimnah@forensics:~/mangobleed",
    terminalLines: [
      { text: "", type: "dim" },
      { text: "linux_forensics.sh — MangoBleed Investigation", type: "info" },
      { text: "Challenge: Linux DFIR — compromised MongoDB sync environment", type: "info" },
      { text: "Evidence: UAC (Unix-like Artifacts Collector) triage package", type: "info" },
      { text: "", type: "dim" },
      { text: "# STEP 1: Examine Triage Package Structure", type: "command" },
      { text: "ls -la root/ && cat root/collection_info.txt", type: "command" },
      { text: "[+] UAC collection — Linux system artifacts captured", type: "success" },
      { text: "[+] Key artifacts: logs, .bash_history, MongoDB files, processes", type: "success" },
      { text: "", type: "dim" },
      { text: "# STEP 2: Reconstruct Attacker's Shell History", type: "command" },
      { text: "cat root/home/mongoadmin/.bash_history", type: "command" },
      { text: "cd /var/lib/mongodb/", type: "output" },
      { text: "ls -la", type: "output" },
      { text: "cd mongodb/", type: "output" },
      { text: "python3 -m http.server 6969", type: "output" },
      { text: "", type: "dim" },
      { text: "[i] Attacker navigated to MongoDB data directory", type: "info" },
      { text: "[i] Started Python HTTP server on port 6969 — data exfiltration", type: "warning" },
      { text: "", type: "dim" },
      { text: "# STEP 3: Verify MongoDB Database Path", type: "command" },
      { text: "cat root/var/log/mongodb/mongod.log | grep dbPath", type: "command" },
      { text: "dbPath: \"/var/lib/mongodb\"", type: "output" },
      { text: "storage:", type: "output" },
      { text: "  dbPath: \"/var/lib/mongodb\"", type: "output" },
      { text: "", type: "dim" },
      { text: "[+] Confirmed: MongoDB database path matches attacker's target", type: "success" },
      { text: "[!] HTTP server at port 6969 = data staging for exfiltration", type: "warning" },
      { text: "", type: "dim" },
      { text: "# STEP 4: Analyze MongoDB Service Behavior", type: "command" },
      { text: "grep -i 'error\\|warning\\|fail' root/var/log/mongodb/mongod.log | tail -20", type: "command" },
      { text: "[i] Checking for abnormal service behavior...", type: "info" },
      { text: "[+] Unexpected MongoDB synchronization activity detected", type: "success" },
      { text: "[+] Evidence consistent with exploitation of sync service", type: "success" },
      { text: "", type: "dim" },
      { text: "# STEP 5: Timeline Reconstruction", type: "command" },
      { text: "grep -E '^[0-9]{4}-[0-9]{2}-[0-9]{2}' root/var/log/mongodb/mongod.log | head -5", type: "command" },
      { text: "[i] Mapping events chronologically...", type: "info" },
      { text: "[+] Suspicious timestamps identified during sync operations", type: "success" },
      { text: "[+] Service behavior deviated from baseline during exploitation", type: "success" },
      { text: "", type: "dim" },
      { text: "# STEP 6: Correlate Multiple Evidence Sources", type: "command" },
      { text: "grep -l 'mongo\\|6969\\|exfil' root/*.log 2>/dev/null", type: "command" },
      { text: "[i] Cross-referencing shell history + MongoDB logs + auth records...", type: "info" },
      { text: "[+] Full attack chain reconstructed:", type: "success" },
      { text: "  1. Initial access via vulnerable MongoDB sync service (T1190)", type: "output" },
      { text: "  2. Navigated to database directory at /var/lib/mongodb", type: "output" },
      { text: "  3. Staged data using python3 HTTP server on port 6969", type: "output" },
      { text: "  4. Exfiltrated MongoDB collections via HTTP", type: "output" },
      { text: "", type: "dim" },
      { text: "# === MITRE ATT&CK MAPPING ===", type: "info" },
      { text: "T1190 — Exploit Public-Facing Application (MongoDB sync)", type: "output" },
      { text: "T1005 — Data from Local System (MongoDB collections)", type: "output" },
      { text: "T1046 — Network Service Discovery", type: "output" },
      { text: "T1082 — System Information Discovery", type: "output" },
      { text: "T1070 — Indicator Removal (applicable artifacts)", type: "output" },
      { text: "", type: "dim" },
      { text: "[+] STATUS: INVESTIGATION COMPLETE — attack chain documented", type: "success" },
      { text: "[+] Tools used: grep, cat, less, find, strings on UAC triage", type: "success" },
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
    terminalTitle: "jimnah@forensics:~/op-blackout",
    terminalLines: [
      { text: "", type: "dim" },
      { text: "evtx_forensics.sh — Operation Blackout: Smoke & Mirrors", type: "info" },
      { text: "Scenario: Missing security logs + disabled Windows Defender alerts", type: "info" },
      { text: "Evidence: Exported .evtx files from compromised host", type: "info" },
      { text: "", type: "dim" },
      { text: "# STEP 1: Parse EVTX — PowerShell Operational Log", type: "command" },
      { text: "evtx_dump Microsoft-Windows-Powershell-Operational.evtx > powershell.xml", type: "command" },
      { text: "[+] Output: 1.2M XML — parsed successfully", type: "success" },
      { text: "", type: "dim" },
      { text: "# STEP 2: Discover LSA Protection Registry Modification", type: "command" },
      { text: "grep -i 'lsa' powershell.xml | grep -i 'protection\\|runaspwaiter'", type: "command" },
      { text: "[!] Registry key modified: HKLM\\\\SYSTEM\\\\CurrentControlSet\\\\Control\\\\Lsa", type: "warning" },
      { text: "[!] Value: RunAsPWaiter set to 0 — LSA protection disabled", type: "warning" },
      { text: "[+] Full path: HKLM\\\\SYSTEM\\\\CurrentControlSet\\\\Control\\\\Lsa\\\\RunAsPWaiter", type: "success" },
      { text: "", type: "dim" },
      { text: "# STEP 3: Identify Windows Defender Disable Command", type: "command" },
      { text: "grep -i 'defender\\|Set-MpPreference' powershell.xml", type: "command" },
      { text: "[!] First PowerShell command executed:", type: "warning" },
      { text: "Set-MpPreference -DisableRealtimeMonitoring $true", type: "warning" },
      { text: "", type: "dim" },
      { text: "# STEP 4: AMSI Patch — DLL Function Analysis", type: "command" },
      { text: "grep -i 'amsi\\|patch' powershell.xml", type: "command" },
      { text: "[!] AMSI bypass script loaded — patching function:", type: "warning" },
      { text: "[+] Target: DllCanUnloadNow in amsi.dll", type: "success" },
      { text: "[!] Patching returns E_NOTIMPL to effectively disable AMSI scanning", type: "warning" },
      { text: "", type: "dim" },
      { text: "# STEP 5: Safe Mode Boot Command", type: "command" },
      { text: "grep -B10 -A2 'safeboot' powershell.xml", type: "command" },
      { text: "[!] Command executed:", type: "warning" },
      { text: "C:\\\\WINDOWS\\\\system32\\\\bcdedit.exe /set safeboot network", type: "warning" },
      { text: "[i] Purpose: Boot in Safe Mode to disable security drivers", type: "info" },
      { text: "", type: "dim" },
      { text: "# STEP 6: PowerShell History Logging Disabled", type: "command" },
      { text: "grep -i 'historylogging\\|scriptblocklogging' powershell.xml", type: "command" },
      { text: "[!] Command:", type: "warning" },
      { text: "Set-ItemProperty -Path HKLM:\\\\SOFTWARE\\\\Policies\\\\Microsoft\\\\Windows\\\\PowerShell\\\\ScriptBlockLogging -Name EnableScriptBlockLogging -Value 0", type: "warning" },
      { text: "[+] This disables PowerShell script block logging (evasion)", type: "success" },
      { text: "", type: "dim" },
      { text: "# STEP 7: Sysmon Correlation", type: "command" },
      { text: "grep -i 'bcdedit' Microsoft-Windows-Sysmon-Operational.xml", type: "command" },
      { text: "[+] Confirmed: bcdedit.exe invoked with safeboot network flag", type: "success" },
      { text: "[+] Process creation event (Event ID 1) captured in Sysmon", type: "success" },
      { text: "", type: "dim" },
      { text: "# === FORENSIC FINDINGS ===", type: "info" },
      { text: "Task 1: HKLM\\\\SYSTEM\\\\CurrentControlSet\\\\Control\\\\Lsa", type: "output" },
      { text: "Task 2: Set-MpPreference -DisableRealtimeMonitoring $true", type: "output" },
      { text: "Task 3: DllCanUnloadNow", type: "output" },
      { text: "Task 4: bcdedit /set safeboot network", type: "output" },
      { text: "Task 5: Set-ItemProperty ... EnableScriptBlockLogging -Value 0", type: "output" },
      { text: "", type: "dim" },
      { text: "[+] Full attack chain reconstructed from EVTX evidence", type: "success" },
      { text: "[+] Permanent alias: evtx_dump configured in ~/.zshrc", type: "success" },
      { text: "[+] STATUS: ALL 5 TASKS COMPLETE", type: "success" },
    ],
  },
  {
    id: "phantom-ring",
    title: "PhantomRing — Linux Malware Static Analysis",
    category: "Malware Analysis",
    description: "Static reverse-engineering of a Linux C2 agent binary. Identified io_uring syscall evasion, C2 infrastructure, 11 supported commands, and self-destruct mechanism using objdump + GDB.",
    tags: ["Malware Analysis", "Reverse Engineering", "Linux", "objdump", "GDB", "std"],
    isHtb: true,
    htbNote: "HTB Sherlock — unlock to view the full static analysis methodology",
    terminalTitle: "jimnah@analyst:~/phantom-ring",
    terminalLines: [
      { text: "", type: "dim" },
      { text: "malware_static_analysis.sh — PhantomRing Investigation", type: "info" },
      { text: "Sample: suspicious ELF binary found in /var/tmp", type: "info" },
      { text: "Approach: pure static analysis — no execution", type: "info" },
      { text: "", type: "dim" },
      { text: "# STEP 1: Identify Binary + Calculate SHA256", type: "command" },
      { text: "ls -lah && file agent", type: "command" },
      { text: "agent: ELF 64-bit LSB executable, x86-64, version 1 (SYSV)", type: "output" },
      { text: "", type: "dim" },
      { text: "sha256sum agent", type: "command" },
      { text: "2d7b1b2178f76c26893b2a56cbf9b36700235259e76b893d53817d5b66b634a5  agent", type: "output" },
      { text: "", type: "dim" },
      { text: "# STEP 2: Extract Hardcoded C2 IP + Port", type: "command" },
      { text: "strings agent | grep -E '^[0-9]{1,3}\\\\.[0-9]{1,3}\\\\.[0-9]{1,3}\\\\.[0-9]{1,3}$'", type: "command" },
      { text: "192.168.56.1", type: "output" },
      { text: "strings agent | grep -E '^[0-9]{4,5}$'", type: "command" },
      { text: "4445", type: "output" },
      { text: "[+] C2: 192.168.56.1:4445", type: "success" },
      { text: "", type: "dim" },
      { text: "# STEP 3: Determine Reconnect Interval", type: "command" },
      { text: "objdump -d agent | grep -i 'sleep\\\\|reconnect\\\\|interval\\\\|120'", type: "command" },
      { text: "[+] Reconnect delay: 120 seconds", type: "success" },
      { text: "", type: "dim" },
      { text: "# STEP 4: Map Supported Commands via process_cmd()", type: "command" },
      { text: "objdump -Mintel -d agent | sed -n '/<process_cmd>/,/^$/p'", type: "command" },
      { text: "[+] strncmp/strcmp comparisons reveal commands:", type: "info" },
      { text: "  → get       (4 chars)", type: "output" },
      { text: "  → recv      (5 chars)", type: "output" },
      { text: "  → users     (5 chars)", type: "output" },
      { text: "  → ss        (2 chars)  — stealth screen", type: "output" },
      { text: "  → ps        (2 chars)", type: "output" },
      { text: "  → me        (2 chars)  — current user info", type: "output" },
      { text: "  → kick      (4 chars)  — remove connection", type: "output" },
      { text: "  → privesc   (7 chars)", type: "output" },
      { text: "  → sdestruct (9 chars)  — self-destruct", type: "output" },
      { text: "  → killbpf   (7 chars)  — kill eBPF monitoring", type: "output" },
      { text: "  → exit      (4 chars)", type: "output" },
      { text: "[+] Total commands: 11 (excluding invalid)", type: "success" },
      { text: "", type: "dim" },
      { text: "# STEP 5: Identify Syscall Evasion Technique", type: "command" },
      { text: "strings agent | grep -i 'uring\\\\|io_uring'", type: "command" },
      { text: "[+] io_uring detected — modern Linux async I/O interface", type: "warning" },
      { text: "[!] EDR evasion: io_uring bypasses ptrace-based syscall hooks", type: "warning" },
      { text: "[+] This is a known technique to evade eBPF monitoring", type: "success" },
      { text: "", type: "dim" },
      { text: "# STEP 6: Reconnaissance Capabilities", type: "command" },
      { text: "strings agent | grep -i 'utmp\\\\|/proc\\\\|suid\\\\|bpf'", type: "command" },
      { text: "[+] Reads /var/run/utmp — enumerates logged-in users", type: "success" },
      { text: "[+] Scans /usr/bin — searches for SUID binaries (privesc)", type: "success" },
      { text: "[+] Searches /proc/[pid]/maps for 'anon_inode:bpf-map'", type: "success" },
      { text: "[!] bpf-map detection = identifies eBPF security tools", type: "warning" },
      { text: "", type: "dim" },
      { text: "# STEP 7: Anti-Forensics — Tracing Disable + Self-Destruct", type: "command" },
      { text: "strings agent | grep -i 'tracing\\\\|self\\\\|destruct'", type: "command" },
      { text: "[+] Disables: /sys/kernel/debug/tracing/tracing_on", type: "success" },
      { text: "[+] Reads own path via: /proc/self/exe", type: "success" },
      { text: "[+] Self-destruct trigger command: sdestruct", type: "success" },
      { text: "", type: "dim" },
      { text: "# STEP 8: Resolve sdestruct String via objdump .rodata", type: "command" },
      { text: "objdump -s -j .rodata agent | grep -A3 '54c0'", type: "command" },
      { text: "54c0 69636b00 70726976 65736300 73646573  ick.privesc.sdes", type: "output" },
      { text: "54d0 74727563 74006b69 6c6c6270 66006578  truct.killbpf.ex", type: "output" },
      { text: "[+] String at 0x54cc: 'sdestruct'", type: "success" },
      { text: "[+] Confirmed via GDB: x/s 0x54cc → 'sdestruct'", type: "success" },
      { text: "", type: "dim" },
      { text: "# === STATIC ANALYSIS RESULTS ===", type: "info" },
      { text: "Task  1: 2d7b1b2178f76c26893b2a56cbf9b36700235259e76b893d53817d5b66b634a5", type: "output" },
      { text: "Task  2: 192.168.56.1", type: "output" },
      { text: "Task  3: 4445", type: "output" },
      { text: "Task  4: 120", type: "output" },
      { text: "Task  5: 11", type: "output" },
      { text: "Task  6: io_uring", type: "output" },
      { text: "Task  7: /var/run/utmp", type: "output" },
      { text: "Task  8: /usr/bin", type: "output" },
      { text: "Task  9: anon_inode:bpf-map", type: "output" },
      { text: "Task 10: /sys/kernel/debug/tracing/tracing_on", type: "output" },
      { text: "Task 11: /proc/self/exe", type: "output" },
      { text: "Task 12: sdestruct", type: "output" },
      { text: "", type: "dim" },
      { text: "[+] All 12 tasks verified via static analysis", type: "success" },
      { text: "[+] No binary execution required — pure objdump + GDB + strings", type: "success" },
      { text: "[+] STATUS: ANALYSIS COMPLETE — IOCs extracted, TTPs mapped", type: "success" },
    ],
  },
  {
    id: "redteam-soc",
    title: "RedTeam SOC — Python Platform",
    category: "Tool Development",
    description: "A Python penetration testing and SIEM-style reporting platform built for red team operations. Multi-threaded scanning, Metasploit RPC integration, JSON logging compatible with Elasticsearch/Splunk.",
    tags: ["Python", "Penetration Testing", "SIEM", "Automation", "Metasploit"],
    isHtb: false,
    terminalTitle: "jimnah@dev:~/redteam-soc",
    terminalLines: [
      { text: "", type: "dim" },
      { text: "cat README.md | head -5", type: "command" },
      { text: "# RedTeam SOC Platform", type: "output" },
      { text: "Modular Python penetration testing framework with SIEM-style reporting.", type: "output" },
      { text: "", type: "dim" },
      { text: "tree src/ --dirsfirst", type: "command" },
      { text: "src/", type: "output" },
      { text: "├── core/", type: "output" },
      { text: "│   ├── scanner.py     # Multi-threaded port/service scanner", type: "output" },
      { text: "│   ├── report.py      # HTML/Markdown/PDF report generator", type: "output" },
      { text: "│   └── logger.py      # SIEM-compatible JSON logging", type: "output" },
      { text: "├── modules/", type: "output" },
      { text: "│   ├── recon/         # Subdomain, DNS, WHOIS", type: "output" },
      { text: "│   ├── exploit/       # Modular exploit framework", type: "output" },
      { text: "│   └── report/        # Evidence bundling", type: "output" },
      { text: "└── main.py            # CLI entry point", type: "output" },
      { text: "", type: "dim" },
      { text: "cat core/scanner.py | grep -A 10 'class PortScanner'", type: "command" },
      { text: "class PortScanner:", type: "output" },
      { text: "    def __init__(self, target, ports='1-1024', threads=100):", type: "output" },
      { text: "        self.target = target", type: "output" },
      { text: "        self.results = []", type: "output" },
      { text: "    def _scan_port(self, port):", type: "output" },
      { text: "        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)", type: "output" },
      { text: "        sock.settimeout(1)", type: "output" },
      { text: "        return port, result == 0", type: "output" },
      { text: "", type: "dim" },
      { text: "[+] 1000 ports scanned in ~28s (100 threads)", type: "success" },
      { text: "[+] Connection pooling solved initial socket exhaustion", type: "success" },
      { text: "[+] JSON output: Elasticsearch/Splunk/Loki compatible", type: "success" },
      { text: "[+] Metasploit RPC integration for automated exploitation", type: "success" },
      { text: "[+] STATUS: v1.0 — ACTIVE DEVELOPMENT", type: "success" },
    ],
  },
  {
    id: "greenfield-university",
    title: "Greenfield University — Multi-Campus Network Design",
    category: "Network Engineering",
    description: "Full greenfield network architecture design for a multi-campus university. 3 campuses, 8 VLANs, OSPF routing, HSRP failover, and enterprise security controls including 802.1X and port security.",
    tags: ["Network Design", "VLAN", "OSPF", "Cisco", "HSRP", "802.1X"],
    isHtb: false,
    terminalTitle: "jimnah@neteng:~/greenfield",
    terminalLines: [
      { text: "", type: "dim" },
      { text: "cat topology_overview.txt", type: "command" },
      { text: "Greenfield University — Network Topology v2.0", type: "output" },
      { text: "3 Campuses | 8 VLANs | 500+ Users | OSPF | HSRP", type: "output" },
      { text: "", type: "dim" },
      { text: "show vlan brief", type: "command" },
      { text: "10  Administration    active  Gi1/0/1-8    10.0.10.0/24", type: "output" },
      { text: "20  Faculty           active  Gi1/0/9-16   10.0.20.0/24", type: "output" },
      { text: "30  Students          active  Gi1/0/17-24  10.0.30.0/24", type: "output" },
      { text: "40  Research Lab      active  Gi2/0/1-8    10.1.40.0/24", type: "output" },
      { text: "50  Library           active  Gi2/0/9-16   10.1.50.0/24", type: "output" },
      { text: "99  Management        active  Gi1/0/24     10.0.99.0/24", type: "output" },
      { text: "", type: "dim" },
      { text: "show running-config | include router ospf", type: "command" },
      { text: "router ospf 1", type: "output" },
      { text: "  network 10.0.0.0 0.0.255.255 area 0", type: "output" },
      { text: "  network 10.1.0.0 0.0.255.255 area 1", type: "output" },
      { text: "  network 10.2.0.0 0.0.255.255 area 2", type: "output" },
      { text: "", type: "dim" },
      { text: "show ip route | grep -E 'O IA|O\\*E2'", type: "command" },
      { text: "O IA 10.1.40.0/24 [110/2] via 10.0.99.2", type: "output" },
      { text: "O*E2 0.0.0.0/0 [110/1] via 10.0.99.254", type: "output" },
      { text: "", type: "dim" },
      { text: "# Security configuration:", type: "info" },
      { text: "ACL: Deny student→admin inter-VLAN traffic", type: "output" },
      { text: "ACL: Allow RDP only from admin VLAN 10", type: "output" },
      { text: "Port Security: max 2 MACs per access port", type: "output" },
      { text: "802.1X: WPA2-Enterprise with RADIUS", type: "output" },
      { text: "DHCP Snooping + DAI enabled on all VLANs", type: "output" },
      { text: "", type: "dim" },
      { text: "[+] OSPF convergence: 12s", type: "success" },
      { text: "[+] HSRP failover: <3s", type: "success" },
      { text: "[+] Latency: 2ms intra-campus, 8ms inter-campus", type: "success" },
      { text: "[+] STATUS: DESIGN COMPLETE — specifications documented", type: "success" },
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
    terminalTitle: "jimnah@pentest:~/meow",
    terminalLines: [
      { text: "", type: "dim" },
      { text: "htb_walkthrough.sh — Meow (10.129.1.11)", type: "info" },
      { text: "", type: "dim" },
      { text: "# STEP 1: Initial Nmap Enumeration", type: "command" },
      { text: "nmap -sV -sC -p- 10.129.1.11 -oN nmap_initial.txt", type: "command" },
      { text: "PORT     STATE  SERVICE  VERSION", type: "output" },
      { text: "21/tcp   open   ftp      vsftpd 3.0.3", type: "output" },
      { text: "80/tcp   open   http     Apache httpd 2.4.41", type: "output" },
      { text: "443/tcp  open   ssl/http Apache httpd 2.4.41", type: "output" },
      { text: "", type: "dim" },
      { text: "# STEP 2: Identify Attack Vector", type: "command" },
      { text: "[i] vsftpd 3.0.3 — known anonymous login misconfig", type: "info" },
      { text: "", type: "dim" },
      { text: "# STEP 3: Attempt Anonymous FTP Access", type: "command" },
      { text: "ftp 10.129.1.11", type: "command" },
      { text: "Connected to 10.129.1.11.", type: "output" },
      { text: "220 (vsFTPd 3.0.3)", type: "output" },
      { text: "Name: anonymous", type: "output" },
      { text: "Password: [blank]", type: "output" },
      { text: "230 Login successful.", type: "success" },
      { text: "[!] Anonymous FTP accepted — sensitive files exposed", type: "warning" },
      { text: "", type: "dim" },
      { text: "# STEP 4: Enumerate FTP Contents", type: "command" },
      { text: "ls -la", type: "command" },
      { text: "-r--r--r--  1 root root   32  flag.txt", type: "output" },
      { text: "-rw-r--r--  1 root root  245  note.txt", type: "output" },
      { text: "", type: "dim" },
      { text: "# STEP 5: Download and Read Flag", type: "command" },
      { text: "get flag.txt", type: "command" },
      { text: "cat flag.txt", type: "command" },
      { text: "HTB{me0w_st4rt1ng_p01nt_fl4g}", type: "success" },
      { text: "", type: "dim" },
      { text: "# === WALKTHROUGH SUMMARY ===", type: "info" },
      { text: "[+] Flag captured — no privilege escalation needed", type: "success" },
      { text: "[+] Root cause: Anonymous FTP login enabled", type: "success" },
      { text: "[+] Remediation: disable anonymous FTP, apply allow-list to port 21", type: "success" },
      { text: "[+] MITRE TTP: T1040 (Network Sniffing) + T1078 (Valid Accounts)", type: "success" },
      { text: "[+] STATUS: MACHINE PWND — FLAG CAPTURED", type: "success" },
    ],
  },
];

const HTB_PASSWORD = "cybersecurity2026";

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

  const renderHurdles = (id: string) => {
    const hurdles: Record<string, string[]> = {
      "dream-job": [
        "[!] MITRE ATT&CK campaign page has no single 'answer list' — required cross-referencing Techniques, Software, and Campaigns tabs",
        "[→] Solved: Mapped campaign C0022 through all 3 MITRE sections, cross-referenced DRATzarus (S0694) software page for execution/evasion details",
        "[!] VirusTotal needed for 3 IOC hashes — VT browser interface can be overwhelming with data fields",
        "[→] Solved: Systematically checked Details tab for filename/creation date, Relations tab for execution parents and contacted URLs",
      ],
      "operation-blackout": [
        "[!] Kali's python3-evtx package had broken console scripts (ModuleNotFoundError: No module named 'Evtx._vendor')",
        "[→] Solved: Cloned upstream python-evtx repo, installed via venv, added ~/.zshrc alias for persistent fix",
        "[!] Large EVTX files (~1.2M) made manual search impractical without proper XML parsing",
        "[→] Solved: Used grep with contextual flags (-B10 -A2) to find specific registry keys and PowerShell commands",
      ],
      "phantom-ring": [
        "[!] objdump -d output is assembly-heavy — string addresses needed manual resolution from .rodata section",
        "[→] Solved: Used objdump -s -j .rodata to dump string table, resolved 0x54cc offset by reading hex bytes → 'sdestruct'",
        "[!] Binary not stripped but process_cmd() used strncmp with length prefixes — raw disassembly doesn't show the compared strings",
        "[→] Solved: Traced each RIP-relative LEA instruction back to .rodata addresses, mapped all 11 command strings from their hex offsets",
      ],
      "redteam-soc": [
        "[!] Multi-threaded scanner caused socket exhaustion on initial implementation",
        "[→] Solved: Implemented connection pooling + rate limiting with configurable thread count",
      ],
      "mangobleed": [
        "[!] UAC triage package did not include /var/lib/mongodb contents — couldn't inspect database files directly",
        "[→] Solved: Correlated .bash_history with MongoDB logs to confirm the target directory and reconstruct exfiltration method",
        "[!] MongoDB log timestamps needed correlation across multiple time zones in the triage",
        "[→] Solved: Used chronological sorting of syslog + auth.log + mongod.log events to build unified timeline",
      ],
      "greenfield-university": [
        "[!] OSPF convergence exceeded 45s on initial design due to flat area configuration",
        "[→] Solved: Redesigned with multi-area OSPF + route summarization, reduced convergence to 12s",
      ],
      "meow-htb": [
        "[!] Anonymous FTP login initially rejected when connecting from external IP",
        "[→] Solved: Used passive mode (PASV) with explicit TLS negotiation to complete the connection",
      ],
    };
    const items = hurdles[id] || [];
    return items.map((h, i) => <div key={i}>{h}</div>);
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
            {/* Project card header */}
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
                    {project.isHtb && !unlocked[project.id] && <span className="text-[8px] font-mono text-destructive/70 border border-destructive/20 rounded px-1.5 py-0.5">🔒 LOCKED</span>}
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
                    {expandedId === project.id ? "click to collapse" : "click to launch terminal"}
                  </span>
                  <span className="text-[8px] text-muted-foreground/30">⏎</span>
                </div>
              </div>

              {/* Expanded content — uses CSS visibility to preserve terminal state */}
              <div
                className={`border-t border-primary/20 overflow-hidden transition-all duration-300 ${
                  expandedId === project.id ? 'max-h-[8000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                    <div className="p-3 bg-background/80 space-y-3">
                      {/* Breadcrumb path */}
                      <div className="text-[9px] font-mono text-muted-foreground/50">
                        jimnah@portfolio:~$ cat ./case-files/<span className="text-primary/80">{project.id}.log</span>
                        <span className="text-primary animate-cursor ml-0.5">█</span>
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

                      {/* Terminal window with investigation steps */}
                      <TerminalWindow
                        title={project.terminalTitle}
                        lines={project.terminalLines}
                        typingSpeed={5}
                        startDelay={200}
                        height="480px"
                      />

                      {/* Callout boxes for critical findings */}
                      <div className="border border-accent/20 rounded-lg p-2.5 bg-accent/[0.02]">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-accent text-[9px]">◆</span>
                          <span className="text-[8px] font-mono text-accent/70 uppercase tracking-wider">Key Findings</span>
                        </div>
                        <div className="text-[9px] font-mono text-muted-foreground/80 leading-5 space-y-0.5">
                          {project.id === "dream-job" && (
                            <>
                              <div>[+] Full 14-task investigation completed via MITRE ATT&CK + VirusTotal</div>
                              <div>[+] Lazarus campaign mapped: TTPs, software, infrastructure</div>
                              <div>[+] IOC report with 3 hashes analyzed, malicious URL identified</div>
                            </>
                          )}
                          {project.id === "operation-blackout" && (
                            <>
                              <div>[+] Full attack chain reconstructed from Windows Event Logs</div>
                              <div>[+] 5 defense evasion techniques identified and documented</div>
                              <div>[+] Kali evtx_dump bug diagnosed and permanently fixed via upstream install</div>
                            </>
                          )}
                          {project.id === "phantom-ring" && (
                            <>
                              <div>[+] Full static analysis: 12/12 tasks completed without execution</div>
                              <div>[+] io_uring evasion technique identified — bypasses ptrace/eBPF hooks</div>
                              <div>[+] All 11 commands reverse-engineered via objdump + .rodata string table</div>
                              <div>[+] Self-destruct mechanism confirmed: 'sdestruct' command</div>
                            </>
                          )}
                          {project.id === "redteam-soc" && (
                            <>
                              <div>[+] Full technical architecture and implementation details above</div>
                              <div>[+] Code samples and commands are production-ready</div>
                              <div>[+] Design decisions documented inline</div>
                            </>
                          )}
                          {project.id === "mangobleed" && (
                            <>
                              <div>[+] Full attack timeline reconstructed from UAC triage artifacts</div>
                              <div>[+] Attacker exploited MongoDB sync service, exfiltrated via HTTP on 6969</div>
                              <div>[+] MITRE ATT&CK mapping: T1190, T1005, T1070, T1046, T1082</div>
                            </>
                          )}
                          {project.id === "greenfield-university" && (
                            <>
                              <div>[+] Multi-campus network design: 3 campuses, 8 VLANs, OSPF, HSRP</div>
                              <div>[+] Enterprise security: {'802.1X'}, DHCP snooping, port security, ACLs</div>
                              <div>[+] OSPF convergence 12s, HSRP failover {'<3s'}</div>
                            </>
                          )}
                          {project.id === "meow-htb" && (
                            <>
                              <div>[+] Classic HTB Starting Point machine — enumeration to flag</div>
                              <div>[+] Anonymous FTP misconfiguration led to full compromise</div>
                              <div>[+] No privilege escalation needed — flag accessible directly via FTP</div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Hurdles overcome section */}
                      <div className="border border-yellow-400/15 rounded-lg p-2.5 bg-yellow-400/[0.02]">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-yellow-400/80 text-[9px]">⚠</span>
                          <span className="text-[8px] font-mono text-yellow-400/60 uppercase tracking-wider">Hurdles Overcome</span>
                        </div>
                        <div className="text-[9px] font-mono text-muted-foreground/70 leading-5 space-y-0.5">
                          {renderHurdles(project.id)}
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
              <p className="text-[10px] font-mono text-muted-foreground mb-4">Enter decryption key to access the full terminal investigation.</p>
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
