---
layout: page
icon: fas fa-toolbox
order: 5
title: ./tools
---

```
$ ls -la /usr/local/toolkit
```

The actual toolkit in active use — not an aspirational list. Updated as things get added to (or removed from) the lab.

## Offensive Security

| Tool | Purpose |
|---|---|
| **Nmap** | Port scanning, service/version detection |
| **Burp Suite** (Community) | Web application testing, request interception |
| **LinPEAS** ([PEASS-ng](https://github.com/carlospolop/PEASS-ng)) | Linux privilege escalation enumeration |
| **Sherlock** / **Maigret** | OSINT — username enumeration across platforms |
| **Metasploit** | Exploitation framework |
| **Hydra** | Login brute-forcing |

## Digital Forensics & Incident Response

| Tool | Purpose |
|---|---|
| **python-evtx** | Parsing Windows Event Log (EVTX) files into readable XML |
| **grep / sed / awk** | Fast pattern-matching and extraction across logs and dumps |
| **Sleuth Kit (mactime)** | Building timelines from bodyfile data |
| **UAC** (Unix-like Artifacts Collector) | Linux triage acquisition |

## Environment & Scripting

| Tool | Purpose |
|---|---|
| **Kali Linux** (VirtualBox VM) | Primary pentesting/DFIR lab environment |
| **WSL** (Windows Subsystem for Linux) | Linux tooling directly on the host machine |
| **Python 3** (venv) | Scripting, custom parsers, automation |
| **Git / GitHub** | Version control, this site, project hosting |
| **VS Code** | Primary editor |

## Reporting

| Tool | Purpose |
|---|---|
| **ReportLab** (Python) | Generating PDF study guides and reports |
| **Jekyll + Chirpy** | This site |

```
$ echo "if it's not on this list, I haven't trusted it with root yet"
```
