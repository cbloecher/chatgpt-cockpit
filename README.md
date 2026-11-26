# ChatGPT Cockpit

Persönliches Cockpit für ChatGPT-Projekte, Chats und deren Beziehungen zu GitHub-Repositories.

**Status:** Architektur-/MVP-Entwurf (26.11.2026), noch keine lauffähige Anwendung.

> Das Ziel-Repository `cbloecher/chatgpt-cockpit` ist derzeit öffentlich. Niemals persönliche ChatGPT-Daten, private Repository-Zuordnungen, HAR-Mitschnitte, Session-Tokens, Zugangsdaten oder exportierte Chat-Inhalte einchecken.

## Zielbild

- **Chrome-Erweiterung (Manifest V3):** liest nach Benutzeraktion ausschließlich benötigte Metadaten in einem angemeldeten `chatgpt.com`-Tab. Interne ChatGPT-Endpunkte sind nicht öffentlich dokumentiert und können sich ändern.
- **Cockpit (Vue 3 + TypeScript + Vite):** eigene Browserseite als Extension-Tab, mit Such-/Filteransichten, Arbeitsständen und Projekt-/Repo-Beziehungen.
- **Synchronisation (FastAPI + SQLite):** zentral auf CB-LINUX per Docker Compose, nur im LAN erreichbar, mehrere eigene PCs mit gemeinsamem Datenstand.
- **Statische Informationen:** GitHub-Mappings, Notizen und manuelle Entscheidungen als getrennte, nachvollziehbare Datenebene. `cbloecher/ai-workspace/chatgpt-projects.md` bleibt die bestehende, vom Chat aus pflegbare Übersicht.

Das Dashboard kann als `chrome-extension://…`-Tab betrieben werden. Dadurch benötigt die UI keine öffentliche GitHub Page und keine direkte CORS-Verbindung zu ChatGPT.

## Verzeichnisse

```text
extension/        MV3-Hintergrunddienst und Datenerfassung
frontend/         Vue-3-Dashboard für einen Browser-Tab
backend/          FastAPI-Synchronisationsdienst, SQLite, Tests
docs/             Konzept, Architektur, Roadmap, Research
```

## Dokumentation

- [Konzept](docs/CONCEPT.md)
- [Architektur / Sicherheitsmodell](docs/ARCHITECTURE.md)
- [MVP-Stufen](docs/ROADMAP.md)
- [Vergleich öffentlicher Projekte und Übernahmekandidaten](docs/RESEARCH-COMPARABLE-PROJECTS.md)

Verwandte Quellen:
- [ChatGPT-Projektübersicht](https://github.com/cbloecher/ai-workspace/blob/main/chatgpt-projects.md)
- [Dokumentierte interne ChatGPT-Endpunkte](https://github.com/context-loom/.github-private/blob/main/documentation/chatgpt-web-project-endpoints.md)

**Noch kein Deployment:** Der Docker-Dienst, die Erweiterung und die UI werden erst nach dem technischen PoC implementiert.
