---
layout: page
icon: fas fa-terminal
order: 6
title: ./cheatsheets
---

```
$ cat ./notes/*.md | less
```

Commands I actually reach for, pulled straight from real investigations rather than a generic list copy-pasted from somewhere else.

## Recon & Scanning

```bash
# Quick single-port check
nmap -p23 <target-ip>

# Full TCP port sweep with service/version detection
nmap -sV -p- <target-ip>

# Confirm a host is alive
ping <target-ip>
```

## Log & Text Analysis (grep / sed / awk)

```bash
# Case-insensitive search
grep -i "pattern" file.log

# Extract just the matching substring (not the whole line)
grep -oP '"remote":"\K[0-9.]+' file.log

# Stop after the first match — fastest way to find the earliest
# entry in a chronological log
grep -m1 "pattern" file.log

# Show N lines of context around a match
grep -A5 -B5 "pattern" file.log

# Count matching lines
grep -i "fail" auth.log | wc -l

# Rank unique values by frequency
sort | uniq -c | sort -rn
```

## Windows Forensics (EVTX)

```bash
# Convert EVTX to readable XML (python-evtx)
python3 -m venv venv
source venv/bin/activate
pip install python-evtx
python parse_evtx.py logs/file.evtx > readable.xml
```

## Linux Privilege Escalation

```bash
# In-memory enumeration (no file touches disk)
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh
```

## WSL / Environment Quirks

```bash
# Windows drives are mounted under /mnt/ inside WSL
ls /mnt/c/Users/<username>/Downloads

# Install a missing tool
sudo apt update && sudo apt install <package> -y
```

## Git Basics

```bash
git init
git add .
git commit -m "message"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

```
$ echo "this page grows every time I hit something new"
```
