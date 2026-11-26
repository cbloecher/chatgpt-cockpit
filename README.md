# ChatGPT Cockpit

Persönliches Cockpit für ChatGPT-Projekte, Chats und ihre Beziehungen zu GitHub-Repositories.

**Stand 26.11.2026:** **M0 Chrome-Erweiterung implementiert** (Manifest V3, eigene Dashboard-Seite, Projektlisten-Abruf, Filter, JSON-Import/Export, lokale Speicherung). Automatisierte Tests sind eingerichtet. **Abnahme im eigenen angemeldeten Chrome-Webchat steht noch aus.**

> Das Repository ist **öffentlich**. Bitte keine echten ChatGPT-Projektdaten, Chat-Titel, Projekt-IDs, privaten Repo-Zuordnungen, HAR-Dateien, Cookies oder Zugangsdaten committen.

## M0 ausprobieren

1. [Repository-ZIP](https://github.com/cbloecher/chatgpt-cockpit/archive/refs/heads/main.zip) herunterladen und entpacken (alternativ `git clone`).
2. Chrome öffnen: `chrome://extensions`. **Entwicklermodus** einschalten und **Entpackte Erweiterung laden** wählen.
3. Im entpackten Repository **den Unterordner `extension/`** auswählen (er enthält `manifest.json`).
4. `https://chatgpt.com` öffnen und anmelden. Auf das Erweiterungssymbol klicken → eigener Dashboard-Tab.
5. Auf **Projekte aktualisieren** klicken. Der letzte gültige Snapshot wird lokal im Chrome-Profil gespeichert.

Es sind **keine** Installation von npm-Paketen und **kein** eigener Server erforderlich. Bei Fehlern der internen ChatGPT-API kann über **JSON importieren** ein früherer lokaler Projektexport angezeigt werden.

[Ausführliche Installations- und Fehlerhilfe](extension/README.md) · [M0-Abnahmeplan](docs/M0-IMPLEMENTATION.md)

## Architekturbild

```text
Heute (M0):
  Chrome / chatgpt.com ── Same-Origin-Abruf durch MV3 ──▶
  Eigener Cockpit-Tab ──▶ chrome.storage.local

Geplant (M1–M3):
  mehrere eigene Chrome-PCs ──▶ CB-LINUX / Docker
                               FastAPI + SQLite
  ⇄ Themen/Status/Repo-Relationen ⇄ GitHub / ai-workspace
```

- **Chrome-Erweiterung:** nach Benutzeraktion nur Projekt-ID, Name und Erstellungs-/Änderungszeitpunkt aus der ChatGPT-Weboberfläche. Keine Cookies/Tokens oder Gesprächsvolltexte.
- **Dashboard:** Suche, Sortierung, Export/Import, Zählung und Abrufstatus.
- **Synchronisation (M1):** zentraler FastAPI-Dienst auf CB-LINUX im LAN, später mehrere eigene PCs.
- **Vue 3 / TypeScript:** Zielarchitektur des umfangreicheren Cockpits. M0 nutzt bewusst **dependency-freies HTML/CSS/JavaScript**, um den riskanten ChatGPT-Abruf sofort prüfen zu können.

Die interne ChatGPT-Schnittstelle ist **nicht offiziell unterstützt** und kann ihr Format/Verhalten ändern. Ein erfolgreicher Test der automatisierten Validierung ersetzt keine Echtabnahme im Webchat.

## Dokumentation

- [Konzept](docs/CONCEPT.md)
- [Architektur / Datenhoheit](docs/ARCHITECTURE.md)
- [Roadmap M0–M3](docs/ROADMAP.md)
- [M0-Implementierung und Testfälle](docs/M0-IMPLEMENTATION.md)
- [Öffentliche Vergleichsprojekte](docs/RESEARCH-COMPARABLE-PROJECTS.md)
- [Chrome-Erweiterung mit Installationsanleitung](extension/README.md)

Referenzen:
- [Projektübersicht in ai-workspace](https://github.com/cbloecher/ai-workspace/blob/main/chatgpt-projects.md)
- [Beobachtete ChatGPT-Web-Endpunkte](https://github.com/context-loom/.github-private/blob/main/documentation/chatgpt-web-project-endpoints.md)

## Entwicklung / Prüfung

```bash
npm run check
```

Node.js 22 ist für die Tests vorgesehen. Es werden keine Pakete installiert und keine echten Projektdaten für Tests verwendet. Siehe [GitHub Actions](.github/workflows/extension-checks.yml).

**Noch nicht umgesetzt:** Chat-Liste, Chat-Status-Präfixe, GitHub-Live-Integration, Beziehungsgraph und Docker-LAN-Synchronisation.
