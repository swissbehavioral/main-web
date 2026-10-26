---
title: "Context Vault \u2014 start here"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Context Vault — start here

This is the shared project memory for Swiss Behavioral Health. Open **this folder** as an Obsidian vault. It also works as ordinary Markdown in an editor. Last reviewed: **2026-10-19** (Asia/Karachi).

## Read in this order

1. [[01-Project/Project-Overview|Project overview]] — purpose, scope and boundaries.
2. [[01-Project/Current-State|Current state]] — implemented versus verified versus unknown.
3. [[02-Architecture/System-Architecture|System architecture]] and [[02-Architecture/Repository-Map|repository map]].
4. [[03-Integrations/Integration-Register|Integration register]] and [[03-Integrations/Appwrite|Appwrite]].
5. [[05-Quality-and-Risks/Findings|Open findings]] before production work.
6. [[07-Handoff/Next-Session|Next session handoff]] to continue work.

Visual reference: [[02-Architecture/Visual-Design-System|Visual design system]] records the public/admin redesign.

## Browse by purpose

| Folder | Contains |
|---|---|
| `01-Project` | Scope, current state, content ownership |
| `02-Architecture` | Runtime design, source map, routes, lead data and auth |
| `03-Integrations` | Implemented connections and Appwrite behavior |
| `04-Operations` | Local commands, configuration, VPS deployment, recovery |
| `05-Quality-and-Risks` | Findings, validation evidence and launch gates |
| `06-Decisions` | Existing technical choices, recommendations and unresolved decisions |
| `07-Handoff` | Next-session instructions and ongoing change log |
| `08-Reference` | Source documents and terminology |
| `09-Templates` | Templates for future sessions and decisions |

## Evidence rules

- **Source-verified:** supported by the checked-in source in this workspace.
- **Command-verified:** a named command was actually run with a recorded result.
- **Historical:** an older document reports a result; this review did not repeat it.
- **Proposed:** a recommendation, not an approved or deployed decision.
- **Unknown:** requires access, input or testing that has not happened.

Source code establishes implemented behavior; live configuration establishes deployed behavior. This vault records both only when evidence exists. Older runbooks can be useful without being current proof.

Start each work session at [[07-Handoff/Next-Session|Next Session]]. End it by updating the affected notes, [[01-Project/Current-State|Current State]], and [[07-Handoff/Change-Log|Change Log]]. Store no API keys, passwords, cookies or real lead data here. Read [[08-Reference/Source-Index|Source Index]] for links outside the vault.
