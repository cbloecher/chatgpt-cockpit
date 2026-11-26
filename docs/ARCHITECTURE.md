# Architektur und Datenhoheit

**Status:** M0 Browser-Adapter implementiert; LAN-Sync und Vue-Frontend weiterhin Entwurf (26.11.2026).

## Komponenten

```text
Chrome-PC 1                         Chrome-PC 2
┌─────────────────────┐             ┌─────────────────────┐
│ ChatGPT-Tab         │             │ ChatGPT-Tab         │
│ Extension MV3       │             │ Extension MV3       │
│ Vue-Cockpit als Tab │             │ Vue-Cockpit als Tab │
└──────────┬──────────┘             └──────────┬──────────┘
           └───────── LAN HTTPS ──────────────┘
                          │
                ┌─────────▼─────────┐
                │ CB-LINUX / Docker │
                │ FastAPI           │
                │ SQLite / Volume   │
                └───────────────────┘
```

### ChatGPT-Datenerfassung

- MV3-Serviceworker öffnet/ermittelt einen **bereits angemeldeten** ChatGPT-Tab und löst nach bewusster Nutzeraktion eine isolierte, lesende Anfrage im Seitenkontext aus (`chrome.scripting.executeScript`, `world: 'MAIN'`). Die Reaktion auf tatsächliche CSP-/Berechtigungsgrenzen wird im PoC getestet.
- Antwort **innerhalb des Seitenkontexts minimieren**: Projekt-ID, Name, Zeitstempel; für Chats später nur Chat-ID, Titel, Zeitstempel, Projekt-ID. Keine Header, Cookies, Zugangsdaten, Anweisungen oder Antworten als Rohdaten weiterreichen.
- Pagination (`items`, `cursor`) defensiv auswerten: Begrenzung der Seitenzahl, Erkennung wiederholter Cursor, Fehleranzeige, keine stillschweigend als „vollständig“ markierten Teilimporte.
- Die interne `/backend-api/gizmos/snorlax/sidebar`-Schnittstelle wurde zuvor im Webchat beobachtet; sie ist **nicht offiziell stabil zugesichert**. Andere Endpunkte erst nach gesonderter Erprobung verwenden.

### Dashboard und LAN-Synchronisierung

- M0-Dashboard als vollwertiger Chrome-Extension-Tab mit dependency-freiem HTML/CSS/JavaScript. Nachrichten zum MV3-Hintergrunddienst über `chrome.runtime`. Vue 3/TypeScript/Vite bleibt die Zieloption für die umfangreichere UI nach dem technischen Praxistest.
- **M0:** Daten bleiben ausschließlich in `chrome.storage.local`, kein LAN-Aufruf. **Ab M1:** Hintergrunddienst überträgt minimierte Daten zum CB-LINUX-API-Endpunkt. Berechtigungen für einen LAN-Host werden gezielt angefragt.
- FastAPI mit SQLite (`WAL` bei Bedarf), persistente Docker-Volume-/Bind-Mount-Daten. Zunächst ein zentraler Server, kein Multi-Master.
- **HTTPS empfohlen/erforderlich für echte Authentifizierungsinformationen**; bevorzugt lokaler Reverse Proxy mit intern vertrauenswürdigem Zertifikat. Nicht von LAN-Segmentierung allein auf ausreichende Vertraulichkeit schließen.
- Zugriffsrecht über einen authentifizierten API-Zugang; keine Zugangsdaten im Frontend-Bundle/Git. Auf PC lokal gehaltene Anmeldedaten nicht automatisch per Chrome Sync replizieren.
- Container-Anbindung zunächst auf Loopback; externe LAN-Freigabe ausschließlich über bewusst konfigurierte Proxy-/Firewall-Regeln. Keine ungeschützte Internetexposition.

## Datenmodell – konzeptionell

- `Project`: `source`, `external_id`, `title`, `source_updated_at`, `last_seen_at`, optional `aliases`.
- `Conversation`: `source`, `external_id`, `project_id`, `title`, `updated_at`, `observed_at`, optional `chat_url`.
- `Repository`: `full_name`, `owner`, `visibility`, `observed_at`.
- `Relation`: `source_type/id`, `target_type/id`, `relation_type`, `confidence`, `provenance`.
- `Overlay`: `target_type/id`, `notes`, `work_status`, `priority`, `tags`, `revision`.
- `SyncRun`: `source`, `started_at`, `finished_at`, `result`, `item_count`, `completeness`, `error`.

**Merge-Regel:** Erfassungsdaten sind pro externer ID aktualisierbar; manuell gepflegte Overlays bleiben erhalten. Fehlende Datensätze bei Teilabruf oder geändertem Filter werden **nicht automatisch gelöscht**. Bei konkurrierenden Overlay-Änderungen Optimistic Locking (`revision`, HTTP 409).

## Sicherheitsanforderungen

- Öffentliches GitHub-Repository = **ausschließlich Code und synthetische Beispieldaten**.
- Keine HAR, Browser-Sessions, Chat-IDs/Projekt-IDs, private Repo-Zuordnungen oder Zugriffsschlüssel committen.
- API nur im LAN, authentifiziert, HTTPS, gesicherte Backups und dokumentierter Restore-Test.
- Bei Verlust einer Sitzung oder veränderter ChatGPT-API muss das Cockpit alte Daten anzeigen und den Abrufzustand als Fehler/„veraltet“ kennzeichnen, nicht leere Daten als vollständigen neuen Stand übernehmen.

## Abgrenzung

`cbloecher/ai-workspace/chatgpt-projects.md` ist die vorhandene gepflegte Markdown-Übersicht. Das Cockpit hält den operativen Datenstand; eventuelle spätere Git-basierte Im-/Exporte sind explizite Funktionen und keine unkontrollierte bidirektionale Synchronisierung.
