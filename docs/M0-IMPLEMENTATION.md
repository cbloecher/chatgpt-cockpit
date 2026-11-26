# M0 – Implementierung und Abnahme

**Stand:** 26.11.2026. Quellcode implementiert; reale Funktion in einer angemeldeten Chrome-Sitzung steht noch aus.

## Implementierter Ablauf

1. Ein Klick auf das Erweiterungssymbol öffnet die eigenständige lokale Dashboard-Seite.
2. `Projekte aktualisieren` löst eine Nachricht an den Manifest-V3-Hintergrunddienst aus.
3. Der Dienst sucht einen vorhandenen angemeldeten `https://chatgpt.com/`-Tab und führt dort einmalig eine Funktion in `MAIN` aus.
4. Die Funktion liest per Same-Origin-Fetch die Sidebar-Projektliste mit `owned_only=false`, `limit=20`, `conversations_per_gizmo=0`, folgt dem `cursor` und gibt **nur vier Metadatenfelder** je Projekt zurück.
5. Die MV3-Erweiterung validiert und normalisiert die Antwort. Erst nach einem vollständig erfolgreichen Abruf überschreibt sie den gespeicherten Snapshot.
6. Dashboard: alphabetische Tabelle, Suche, Zählung, Zeitstempel, JSON-Import/Export. Projekte werden über die ID identifiziert – auch bei zwei gleichnamigen `FLOW`-Einträgen.

## Grenzen

- Der internen ChatGPT-Web-API liegt keine offizielle, stabile Vertragszusage zugrunde.
- Der vereinfachte Fetch im Seitenkontext könnte zusätzliche Webapp-Header benötigen. Bei HTTP 401/403 zunächst Fehler prüfen, **keine** Token-Extraktion nachrüsten.
- Die Abfrage ist bewusst manuell und nur projektbezogen; Chat-Liste, GitHub-Relationen, statische Overlay-Datei und LAN-Synchronisierung folgen später.
- Snapshot liegt ausschließlich in `chrome.storage.local`, **nicht** in `chrome.storage.sync`. Mehrere PCs sind daher in M0 noch nicht synchron.
- UI bewusst zunächst ohne Vue/TypeScript-Build; umstellbar nach dem ersten Integrationstest.

## Abnahmeschritte auf dem PC

1. `npm run check` lokal oder GitHub-Workflow prüfen.
2. `extension/` als entpackte Erweiterung installieren.
3. Angemeldeten ChatGPT-Tab öffnen und mit `Projekte aktualisieren` testen.
4. Anzahl, unterschiedliche IDs gleichnamiger Projekte, Datumsangaben und Filter kontrollieren.
5. ChatGPT-Tab schließen → erneuter Abruf muss **Fehler anzeigen**, der alte Stand muss bleiben.
6. JSON exportieren, erneut importieren und Metadaten prüfen.
7. Entwicklerwerkzeuge öffnen und sicherstellen, dass **keine** externen Hosts kontaktiert werden und keine Projektanweisungen gespeichert sind.

## Referenzen

- [Chrome Scripting API](https://developer.chrome.com/docs/extensions/reference/api/scripting)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage)
- [Interner ChatGPT-Web-Endpunkt](https://github.com/context-loom/.github-private/blob/main/documentation/chatgpt-web-project-endpoints.md)
