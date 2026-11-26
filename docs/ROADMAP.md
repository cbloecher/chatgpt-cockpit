# MVP-Plan

**Status:** Entwurf, 26.11.2026

## M0 – sichere technische Basis

- Repo-Aufbau und Minimal-Build für MV3 + Vue 3/TypeScript sowie FastAPI erstellen.
- PoC: Authentifizierten ChatGPT-Tab erkennen; Projekte über die bereits beobachtete Sidebar-Anfrage **lesend** holen.
- Ergebnisse mit synthetischen Fixtures testbar machen; keine privaten Daten in Git.
- Nachweisen, dass die Bereinigung der API-Antwort keine Gesprächs-/Sitzungsinhalte transportiert.

**Abnahme:** Installation als entpackte Chrome-Erweiterung; Projekttabelle im eigenen Tab; sauberer Fehlerfall ohne Anmeldung/API-Zugriff.

## M1 – Datenpersistenz und Synchronisierung

- FastAPI + SQLite mit Authentifizierung, Snapshots, Änderungsverfolgung und synchronisationssicherem Upsert.
- Docker Compose mit persistentem Volume, `.env.example`, Healthcheck, Backup-/Restore-Doku.
- UI-Konfiguration für LAN-Endpunkt/Verbindungsstatus, keine Credentials in Git.
- Zweiter Chrome-PC sieht denselben Datenstand; manuelle Overlays bleiben nach Aktualisierung bestehen.

**Abnahme:** Zwei Browserprofile synchronisieren 55+ Projekte; gleichnamige Einträge bleiben dank IDs getrennt; Verbindungsfehler führen nicht zu Datenverlust.

## M2 – Chat- und Repository-Zuordnung

- Chat-Liste paginiert nach Projekt, nur Titel/IDs/Zeitstempel; Endpunkt vorher separat prüfen.
- Parser für Titelpräfixe mit konfigurierbaren Regeln.
- Manuelle und importierte Repo-Beziehungen mit Herkunft und Verifikationsstatus.
- Filter, Suche, zuletzt geändert, nicht zugeordnet, Statusdimensionen getrennt.

**Abnahme:** kein fälschliches „merged“ ohne verifizierten GitHub-PR; keine doppelte Datenquelle aus Projektnamen und Github-Slugs.

## M3 – Zusammenhänge / GitHub-Integration

- Tatsächliche GitHub-Issue-/PR-Informationen read-only ergänzen, Konflikt- und Abhängigkeitsgraph.
- Historie/Änderungsdifferenzen, mögliche spätere Exporte zur Pflege von `ai-workspace`.
- Sicherheit und LAN-Zugriff härten, Build-/Release-Prozess dokumentieren.

**Nicht in M0:** automatische Inhaltsanalyse aller Chats, Projektumbenennungen, Chat-Mutationen oder Softwarebau auf anderen Repos.
