---
title: "Greenfield University — Multi-Campus Network Infrastructure Design"
date: 2026-07-20 08:00:00 +0300
categories: [Projects, Network Engineering]
tags: [cisco, packet-tracer, vlans, acls, network-security]
layout: locked-post
toc: true
---

## Scenario

A network infrastructure design project for a fictional multi-campus university ("Greenfield"), built entirely in Cisco Packet Tracer. The goal was to design and implement a segmented, secured network spanning multiple campuses/departments — the kind of foundational design work that underpins real enterprise network security.

## Project overview

| Field | Value |
|---|---|
| Tooling | Cisco Packet Tracer |
| Scope | Multi-campus network design |
| Core techniques | VLANs, inter-VLAN routing, ACLs, DHCP snooping, port security, SSH hardening, static routing |

## Design components

**VLAN segmentation** — the network was divided into multiple VLANs to separate traffic by department/function, limiting the blast radius of any single compromised segment and reducing broadcast domain size.

**Inter-VLAN routing (router-on-a-stick)** — a single router interface, trunked and subdivided into logical sub-interfaces, handled routing between VLANs without requiring a dedicated router per segment — a classic, cost-effective enterprise pattern.

**Access Control Lists (ACLs)** — used to enforce which VLANs/subnets could communicate with each other and on which ports, implementing least-privilege network access rather than flat, fully-open connectivity.

**DHCP snooping** — configured to prevent rogue DHCP servers from handing out malicious configuration (e.g., attacker-controlled DNS or gateway addresses) to hosts on the network.

**Port security** — limited which MAC addresses could connect to specific switch ports, mitigating unauthorized device connections and basic MAC-flooding attempts.

**SSH hardening** — remote management access to network devices was locked down to SSH only (no Telnet), with authentication hardening on top.

**Static routing** — used alongside inter-VLAN routing to ensure predictable, controlled paths between campus segments rather than relying on dynamic routing protocols for a network of this scope.

## Troubleshooting note

During testing, DHCP broadcasts across sub-interfaces and inter-VLAN ping results were occasionally inconsistent. After isolating the configuration and confirming it matched correct design principles, this was documented as a **Packet Tracer simulation-engine limitation** rather than a configuration fault — an important distinction to make when working in a simulated environment: know the difference between "my config is wrong" and "the simulator doesn't fully model this behavior."

## Key takeaway

Good network segmentation is a security control, not just an organizational convenience — VLANs, ACLs, and port security together mean that a compromise of one segment doesn't automatically grant access to everything else. Documenting simulator-specific quirks (rather than chasing a phantom misconfiguration) is also a real skill: knowing your tooling's limitations is part of engineering competence.
