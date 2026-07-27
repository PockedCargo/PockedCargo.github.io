---
title: "Operation Blackout 2025: Smoke & Mirrors — Uncovering Defense Evasion in Windows Event Logs"
date: 2026-07-25 09:00:00 +0300
categories: [DFIR, HackTheBox Sherlock]
tags: [dfir, windows, powershell, sysmon, defense-evasion, amsi]
layout: locked-post
toc: true
---

## Scenario

Byte Doctor Reyes is investigating a stealthy post-breach attack where several expected security logs and Windows Defender alerts appear to be missing. The working theory: the attacker employed defense evasion techniques to disable or manipulate security controls, significantly complicating detection. Using the exported event logs, the objective is to reconstruct exactly how the attacker dismantled the system's defenses to remain undetected.

## Challenge overview

| Field | Value |
|---|---|
| Platform | HackTheBox Sherlock |
| Difficulty | Very Easy |
| Evidence | Microsoft-Windows-Powershell.evtx, Microsoft-Windows-Powershell-Operational.evtx, Microsoft-Windows-Sysmon-Operational.evtx |
| Objective | Reconstruct how the attacker disabled security controls to evade detection |

## Phase 1: Tooling

Same EVTX-to-XML conversion workflow as prior Windows-based investigations:

```bash
python3 -m venv venv
source venv/bin/activate
pip install python-evtx
python parse_evtx.py Microsoft-Windows-Powershell-Operational.evtx > powershell-operational.xml
python parse_evtx.py Microsoft-Windows-Powershell.evtx > powershell.xml
python parse_evtx.py Microsoft-Windows-Sysmon-Operational.evtx > sysmon-operational.xml
```

## Phase 2: Disabling LSA protection

```bash
grep -io "HKLM[^<\"]*Lsa[^<\"]*" powershell-operational.xml sysmon-operational.xml | sort -u
```

**Finding:** the attacker modified `HKLM\SYSTEM\CurrentControlSet\Control\LSA`, setting the `RunAsPPL` value to `0` — disabling LSA (Local Security Authority) protection, which normally runs `lsass.exe` as a protected process to prevent credential-dumping tools from reading its memory.

## Phase 3: Disabling Windows Defender

```bash
grep -n "Set-MpPreference -Disable\|Add-MpPreference" powershell-operational.xml
```

Two Defender-disabling commands were found. Cross-referencing actual `TimeCreated` timestamps (not just line order) confirmed the true sequence:

```
2025-04-10 06:31:32 UTC
Set-MpPreference -DisableIOAVProtection $true -DisableEmailScanning $true -DisableBlockAtFirstSeen $true
```

```
2025-04-10 06:31:45 UTC (13 seconds later)
Set-MpPreference -DisableRealtimeMonitoring $true
```

**Finding:** the first command executed disabled IO/AV protection, email scanning, and "block at first seen" — a broader initial sweep before the more commonly-cited real-time monitoring toggle came seconds later.

## Phase 4: The AMSI bypass — obfuscated to dodge string search

A plain `grep -i "amsi"` across all three logs returned **zero hits** — initially suggesting no AMSI tampering occurred. That was wrong.

```bash
grep -io "VirtualProtect" powershell-operational.xml powershell.xml
```

This surfaced a `VirtualProtect`-based memory patch function. Examining the surrounding script revealed why the direct search failed: the target strings were built via character-by-character concatenation —

```
"a" + "m" + "s" + "i" + ".dll"
"A" + "m" + "s" + "i" + "S" + "c" + "a" + "n" + "B" + "u" + "f" + "f" + "e" + "r"
```

**Finding:** the script patches **`AmsiScanBuffer`** in **`amsi.dll`** — flipping memory permissions via `VirtualProtect` and overwriting the function's first bytes with `0x31, 0xC0, 0xC3` (`xor eax, eax; ret`), forcing every AMSI scan to report "clean" regardless of the actual content being evaluated. Building the strings character-by-character was a deliberate move to defeat exactly the kind of naive log search used in Phase 4's first attempt.

## Phase 5: Safe Mode reboot

```bash
grep -io "bcdedit[^<\"]*\|safeboot[^<\"]*" powershell-operational.xml sysmon-operational.xml
```

```
bcdedit /set safeboot network
```

**Finding:** configured the system to boot into Safe Mode with Networking — an environment where many third-party security agents and services don't load, giving the attacker a much quieter window to operate in on the next restart.

## Phase 6: Erasing the command trail

```bash
grep -io "Set-PSReadlineOption[^<\"]*\|HistorySaveStyle[^<\"]*" powershell-operational.xml
```

```
Set-PSReadlineOption -HistorySaveStyle SaveNothing
```

**Finding:** disabled PSReadLine's history persistence entirely, so no subsequent commands would be written to `ConsoleHost_history.txt` for later forensic recovery.

## Attack chain summary

1. **Credential protection disabled** — `RunAsPPL` cleared, exposing `lsass.exe` to memory-dumping tools
2. **Windows Defender neutralized** — IO/AV protection, email scanning, and real-time monitoring disabled in two sequential commands
3. **AMSI bypassed** — `AmsiScanBuffer` patched in-memory, with string obfuscation specifically to defeat naive detection/search
4. **Safe Mode staged** — `bcdedit` configured for a Safe Mode reboot, dropping many security agents from the next boot
5. **Forensic trail erased** — PowerShell history logging disabled going forward

## Key takeaway

Every single control disabled here is a *legitimate, documented* administrative capability — `Set-MpPreference`, `bcdedit`, `Set-PSReadlineOption` are all standard tools, not exploits. The entire attack is defense evasion through abuse of normal administration, which is exactly why PowerShell Script Block Logging (Event ID 4104) matters so much: without it, this entire chain would have been invisible, since none of these actions trip a traditional malware signature.
