# Konzept: ChatGPT Project Cockpit

**Stand:** Entwurf, 26.11.2026 · **nicht normativ**

## Problem

Die wachsende Menge von ChatGPT-Projekten und Chats überlappt fachlich mit einer wachsenden Zahl privater und Context-Loom-GitHub-Repositories. Weder ChatGPT-Projektnamen noch GitHub-Repository-Listen zeigen alle Themen, Beziehungen oder Arbeitsstände zuverlässig.

## Funktionale Anforderungen

1. Projekte nach stabiler ChatGPT-ID und ursprünglichem Anzeigenamen erfassen, um Umbenennungen und gleichnamige Projekte (z. B. `FLOW`) voneinander zu unterscheiden.
2. Chats je Projekt mit Chat-ID, Titel, Zeitstempel, Projekt-ID und Chat-Link erfassen; **zunächst ohne Gesprächsvolltexte**.
3. Titelpräfixe erkennen (z. B. `dev`, `closed`, `merged`), aber nur als **beobachtete Titelmetadaten**, nicht als verbindliche GitHub- oder Arbeitsstände behandeln.
4. Manuelle Projektzustände, Themen, Notizen und N:M-Zuordnungen zu Repositories pflegen.
5. Issues und PRs später optional über die GitHub-API zuordnen; `merged` nur dann als **tatsächlichen PR-Status** anzeigen, wenn von GitHub bestätigt.
6. Projekte alphabetisch, nach Aktivität, Status, Kontextpräfix und Repo-Zugehörigkeit filtern; später Graph und Änderungsverlauf ergänzen.
7. Mehrere eigene PCs über einen LAN-Dienst auf CB-LINUX mit einem gemeinsamen Stand versorgen; Offline-/Fehlerzustände sichtbar machen.
8. Persönliche Metadaten und Daten aus privaten Repositories **nicht** im öffentlichen Source-Repository oder auf öffentlich zugänglichen Pages veröffentlichen.

## Terminologie / Statusdimensionen

| Dimension | Herkunft | Bedeutung |
| --- | --- | --- |
| Projektname | ChatGPT | Navigationsname, veränderbar und nicht eindeutig |
| Projekt-ID | ChatGPT | Primärschlüssel für Zuordnung und Änderungsverfolgung |
| Chat-Titel-Präfix | ChatGPT | Unverbindlicher Hinweis auf Arbeitsphase, vom Namen geparst |
| Arbeitsstatus | Nutzer/Cockpit | Manuell bestätigter Status eines Projekts oder Arbeitspakets |
| GitHub-Issue-Status | GitHub | `open`, `closed` etc. für konkretes Issue |
| PR-Status | GitHub | `open`, `closed`, `merged` für konkreten Pull Request |
| Repo-Beziehung | Nutzer/Mapping | `primary`, `related`, `research`, `poc`, `publishing`, `integration` |
| Quelle/Sicherheit | Cockpit | `observed`, `confirmed`, `inferred`, `manual` + Zeitpunkt |

`cl.` ist das etablierte Kennzeichen für Vorhaben von `context-loom`; keine automatische Festlegung der GitHub-Owner-Zuordnung allein aus dem Namen.

## Nichtziele im ersten PoC

Keine Volltextsuche über Chats, keine automatischen Inhaltszusammenfassungen, keine Änderung oder Löschung von Chats/Projekten, keine GitHub-Schreiboperationen, keine umfassende Aufgabenverwaltung (IMP bleibt eigenständig).

## Integrationsprinzip

- **Live-Daten**: Projekt-/Chat-Metadaten aus ChatGPT.
- **Manuelle Metadaten**: Themen, Status, Verbindungen, Hinweise mit eigenen Revisionsnummern.
- **GitHub-Metadaten**: verifizierte Repos/Issues/PRs mit Zeitstempel, optional nach MVP.
- Keine Quelle darf die Datenhoheit der anderen Quelle stillschweigend ersetzen.
