---
title: "RedTeam SOC — A Python Penetration Testing & SIEM-Style Reporting Platform"
date: 2026-07-19 08:00:00 +0300
categories: [Projects, Tool Development]
tags: [python, flask, osint, nmap, siem]
layout: locked-post
toc: true
---

## Scenario

RedTeam SOC is a self-built platform combining offensive reconnaissance tooling with defensive-style reporting — built from scratch in Python/Flask rather than assembled from existing frameworks, specifically to understand how each piece works under the hood.

## Project overview

| Field | Value |
|---|---|
| Stack | Python, Flask |
| Purpose | Penetration testing automation + SIEM-style reporting |
| Report formats | TXT, JSON, PDF |

## Core capabilities

**Live OSINT enumeration** — pulls publicly available information on a target as part of the reconnaissance phase, feeding directly into the rest of the assessment workflow rather than being a disconnected manual step.

**Nmap integration** — automated port/service scanning wired directly into the platform, rather than requiring a separate manual scan-then-copy-paste workflow.

**SQL injection detection** — basic automated testing for SQL injection vulnerabilities against discovered web endpoints.

**CVSS-weighted risk scoring** — findings aren't just listed; they're scored using CVSS-style weighting so a report reader can immediately see what matters most, not just a flat list of "things found."

**Real-time SSE streaming** — uses Server-Sent Events so that scan/test progress streams to the interface live, rather than the user staring at a blank screen waiting for a batch job to finish.

**Report generation** — findings compile automatically into TXT, JSON, or PDF, meaning results are client-ready without manual reformatting after the technical work is done.

## A deliberate scope decision

During development, a facial-recognition / social-media-identification feature was considered for the OSINT module. After evaluating the privacy and misuse implications, this was **deliberately left out of the platform** — twice reconsidered, twice declined. Automation is only worth building when it's built responsibly; not every technically-possible feature belongs in a tool, especially one involving identifying real people without their consent.

## Key takeaway

Building your own tooling — even when mature frameworks already exist — forces a much deeper understanding of what each piece of a pentest workflow actually does, from scan orchestration to report scoring. It also creates space to make deliberate ethical calls about what a tool should and shouldn't do, rather than inheriting someone else's defaults.
