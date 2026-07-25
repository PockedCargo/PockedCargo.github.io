---
title: "PhantomCheck — Reconstructing an Attacker's Anti-VM Detection Logic"
categories: [DFIR, HackTheBox Sherlock]
tags: [dfir, windows, powershell, evtx, malware-analysis]
toc: true
---

> **Status:** unpublished draft. This file lives in `_drafts/` so it does not appear on the live site.
> To publish, move it to `_posts/` and rename it with a date prefix, e.g. `2026-07-24-phantomcheck.md`.
{: .prompt-warning }

## Scenario

This Sherlock investigates **Windows PowerShell Operational logs** to determine how an attacker performed anti-virtualization (VM detection) checks before executing malware — a common evasion technique used to avoid running inside sandboxes or analyst VMs. The goal was to recover the exact artifacts and reconstruct the attacker's detection script from raw event log evidence.

## Challenge overview

| Field | Value |
|---|---|
| Platform | HackTheBox Sherlock |
| Evidence | Microsoft-Windows-Powershell.evtx, Windows-Powershell-Operational.evtx |
| Environment | Kali Linux (VirtualBox), Windows 11 host |
| Objective | Recover how the attacker detected a virtualized environment prior to executing malware |
| Techniques identified | WMI queries, registry enumeration, running-process enumeration, hardware inspection |

## Phase 1: Tooling — converting EVTX to readable XML

EVTX is a binary Windows Event Log format and can't be searched directly with Linux tools like `grep`. Kali's packaged `python3-evtx` was broken:

```
ModuleNotFoundError: No module named 'Evtx._vendor'
```

**Fix:** rather than modifying the system Python install, a virtual environment was used instead.

```bash
python3 -m venv venv
source venv/bin/activate
pip install python-evtx
```

A minimal parser converted the binary log into readable XML:

```python
from Evtx.Evtx import Evtx
import sys

with Evtx(sys.argv[1]) as log:
    for record in log.records():
        print(record.xml())
```

```bash
python parse_evtx.py logs/Windows-Powershell-Operational.evtx > operational.xml
```

## Phase 2: Locating the WMI-based VM checks

```bash
grep -i "Win32_" operational.xml
```

```
Get-WmiObject -Class Win32_ComputerSystem
```

**Finding:** the attacker queried `Win32_ComputerSystem` to retrieve Manufacturer and Model — the standard way malware fingerprints VMware, VirtualBox, and Hyper-V hosts.

## Phase 3: Thermal sensor check

```bash
grep -i Thermal operational.xml
```

```
Get-WmiObject -Query "SELECT * FROM MSAcpi_ThermalZoneTemperature"
```

**Finding:** virtual machines typically lack real thermal sensors or return invalid/unrealistic values — a classic and reliable VM-detection signal malware relies on.

## Phase 4: Recovering the attacker's detection script

Searching broadly for "function" returned thousands of legitimate Windows functions. A more targeted approach — searching for the script's own output strings — worked instead:

```bash
grep -i "This is a" operational.xml
```

```
This is a Hyper-V machine.
This is a VMWare machine.
```

Using `grep -n` to find the line number, then `sed -n` to pull the surrounding XML, exposed the complete PowerShell function:

```
function Check-VM
{
    ...
}
```

**Finding:** the recovered function is the **Nishang** PowerShell module's `Check-VM` — embedded comments referenced Nishang, "Lab of a Penetration Tester," and Rapid7 Metasploit, confirming publicly available offensive tooling.

## Phase 5: VM detection logic, by platform

| Platform | Checks performed |
|---|---|
| Hyper-V | Registry: `HKLM:\SYSTEM\ControlSet001\Services` — vmicheartbeat, vmicvss, vmicshutdown, vmiexchange |
| VMware | Processes: vmwareuser.exe, vmwaretray.exe; registry; SCSI identifiers; BIOS manufacturer |
| Virtual PC | Processes: vmusrvc.exe, vmsrvc.exe; registry: vpc-s3, vpcuhub, msvmmouf |
| VirtualBox | Processes: vboxservice.exe, vboxtray.exe; registry: VBoxGuest, VBoxMouse, VBoxService, VBoxSF; BIOS/ACPI/SCSI |
| Xen | Registry, processes, ACPI, drivers |
| QEMU | Processor and SCSI identifiers |

## Phase 6: Registry and process enumeration

The script repeatedly queried `HKLM:\SYSTEM\ControlSet001\Services` — installed virtualization drivers remain visible in the registry even when their processes aren't currently running, making this a durable detection point.

```powershell
Get-Process
```

Equivalent to Linux's `ps aux` — the malware compares running processes against known VM guest tools (e.g. `vboxservice.exe`, `vboxtray.exe`) to positively identify VirtualBox.

**Finding:** the event log captured both `"This is a Hyper-V machine."` and `"This is a VMWare machine."` being printed during actual execution — direct evidence the detection logic ran and matched.

## Final challenge answers

| Task | Answer |
|---|---|
| WMI class for Manufacturer/Model | `Win32_ComputerSystem` |
| Temperature WMI query | `SELECT * FROM MSAcpi_ThermalZoneTemperature` |
| PowerShell function name | `Check-VM` |
| Registry key for service enumeration | `HKLM:\SYSTEM\ControlSet001\Services` |
| VirtualBox process comparison | `vboxservice.exe`, `vboxtray.exe` |
| Detected virtualization platforms | Hyper-V, VMware |

## Key lessons learned

- PowerShell Operational logs (Event ID 4104) are extremely valuable — they can contain complete attacker script blocks, not just metadata.
- Malware frequently layers WMI, registry, hardware identifiers, and process checks together rather than relying on a single VM-detection signal.
- Converting EVTX to XML unlocks the entire standard Linux toolset (`grep`, `sed`) for fast, precise searching.
- Searching for the script's own distinctive output strings ("This is a...") was far more effective than searching for generic keywords like "function."
- Troubleshooting tooling is part of the job — a broken system package was resolved cleanly with a Python virtual environment, without touching the system Python install.
