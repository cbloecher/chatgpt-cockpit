# Vergleich öffentlicher ChatGPT-Projekt- und Chat-Management-Werkzeuge

**Recherche:** 26.11.2026 · **Status:** externe Bestandsaufnahme / keine Technologieentscheidung. Links und Funktionsbehauptungen stammen aus den jeweiligen öffentlichen Repository-READMEs und GitHub-Metadaten. Keine Übernahme fremden Codes beschlossen oder durchgeführt.

## Ziel der Recherche

Welche bestehenden Open-Source-Vorhaben liefern Anregungen oder verwendbare Bausteine für ein persönliches **ChatGPT-Projekt-Cockpit mit LAN-Synchronisation auf CB-LINUX**, Chrome-Erweiterung, Visualisierung und Beziehungen zu GitHub-Repositories?

## Kandidaten

| Projekt | Nachgewiesener Schwerpunkt | Interessant für unser Cockpit | Begrenzung / Prüfung |
| --- | --- | --- | --- |
| [Shiva-The-Witch/chatgpt-chat-cleaner](https://github.com/Shiva-The-Witch/chatgpt-chat-cleaner) | Chromium/MV3; Chat-Scan inkl. ChatGPT-Projekten, Synchronisierung der Projektliste, Filter, Export, Verschieben/Löschen | **Hohe Relevanz für Projekt-/Chat-Discovery** und UI-/API-Integrationsmuster | Enthält auch mutierende Funktionen; wir benötigen **read-only**. GitHub meldet Lizenz als `NOASSERTION`: vor Codeübernahme Lizenz tatsächlich klären |
| [benedyktdryl/gpt-organizer](https://github.com/benedyktdryl/gpt-organizer) | Chrome-Erweiterung mit **WXT + TypeScript**; Sidebar-Selektion, Projektzuordnung und Metadaten-Import/-Export | **Hohe Relevanz für Extension-Architektur**, Messaging und typisierte Datenformate | Fokus auf ChatGPT-Seitenleiste und Bulk-Verwaltung; kein belegter zentraler LAN-Sync; Lizenz und Sicherheitsmodell vor Übernahme verifizieren |
| [thekester/chatgpt-export](https://github.com/thekester/chatgpt-export) | Browser-Erweiterung; Projekt-/Chat-Historie, Export mit Dateianhängen, inkrementeller Archivierung, lokaler HTML-Index | **Sehr gut für Datenzugriff, Pagination, Fehlerbehandlung und Änderungsdetektion** | Exportierendes Archivprodukt, kein GitHub-Statuscockpit; wir wollen anfangs ausdrücklich **keine Chatvolltexte**. GitHub-Lizenz: MIT |
| [ezwep/chatgpt-exporter](https://github.com/ezwep/chatgpt-exporter) | Lokal betriebener Node.js-Exporter für Projekte, Chats und GPTs mit HTML-/JSON-/Markdown-Ausgabe | **Referenz für vollständige ChatGPT-Datenstruktur und lokal auswertbare Projekthierarchie** | Nutzt nichtoffizielle API und laut README Session-Token-Verarbeitung: **nicht** als Authentifizierungsvorbild verwenden. Lizenz: MIT |
| [withLinda/Chatgpt-conversations-exporter](https://github.com/withLinda/Chatgpt-conversations-exporter) | Browser-Console-Exporter im angemeldeten ChatGPT-Webchat, Metadaten samt Projektzuordnung, Markdown-Export | **Gute Referenz für Same-Origin-Abfrage ohne externen Proxy** | Console-Skript, keine Extension-/LAN-Architektur; Lizenz nicht aus GitHub-Repo-Metadaten bestätigt |
| [imranbarbhuiya/chatgpt-project-sidebar](https://github.com/imranbarbhuiya/chatgpt-project-sidebar) | Privacy-first Chrome-Erweiterung, Projekt-Chats in Sidebar-Gruppen, DOM-basierte Erfassung ohne private API | **Fallback-Strategie**, falls interne ChatGPT-Endpunkte wechseln; nur sichtbare/gelernte Daten | Für vollständige automatische Inventarisierung weniger robust; kein LAN-Sync. GitHub-Lizenz: MIT |
| [neona-fm/chatpins](https://github.com/neona-fm/chatpins) | Chat-Favoriten, Ordner, Notizen, Sortierung, JSON-Export/Import in der Browser-Erweiterung | **UI-Ideen** für Pinning, Zusatzmetadaten, Notizen | Fokus auf gespeicherte Chats statt echte Projekt-/GitHub-Zuordnungen. GitHub-Lizenz: MIT |

**Nicht in die Kandidatenliste aufgenommen:** `yakirosm/chatgpt-projects-dashboard` wurde zwar von einer Suchmaschine beschrieben, lieferte bei direktem GitHub-API- und Seitenaufruf am 26.11.2026 jedoch 404. Verfügbarkeit daher nicht nachgewiesen.

## Vergleich mit unseren Anforderungen

| Anforderung | Rechercheergebnis |
| --- | --- |
| **Projekt- und Chat-Inventar** | Andere Tools demonstrieren, dass Browser-/Sitzungszugriff und teils Projekt-Pagination machbar sind; **konkret in unserem Chrome-PoC verifizieren** |
| **Eigenständige Browserseite** | Externe HTML-Viewer und Extension-UIs vorhanden; Vue 3 + TypeScript in unserem Vorhaben bleibt sinnvoll |
| **Synchronisation über mehrere PCs** | Bei den untersuchten Repositories **keine belegte Kombination** aus eigener LAN-FastAPI, Overlay-Sync und Cockpit gefunden |
| **GitHub-Issues/PRs und Repo-Beziehungen** | Keine nachgewiesene vollständige Umsetzung in diesen Kandidaten; eigene fachliche Integrationsschicht planen |
| **Arbeits-/Chat-/GitHub-Status getrennt** | Kein passendes umfassendes Modell gefunden; eigenständiges Datenmodell und klare Evidenzkennzeichnung erforderlich |
| **Privatsphäre / Datensparsamkeit** | Ein Teil der Exporter verarbeitet volle Gesprächs-/Dateiinhalte; für uns nur minimal nötige Metadaten |
| **Abhängigkeit von interner ChatGPT-API** | Breites Risiko bei API-basierten Lösungen: Versions-/Schemaänderungen, Auth- und Rate-Limit-Verhalten. Adapter mit Tests und optionalem manuellen JSON-Import vorsehen |

## Empfehlung für die weitere Umsetzung

1. **Keine komplette Fremdanwendung übernehmen:** Die fachliche Kombination aus persönlichem Arbeitscockpit, GitHub-Relationen und synchronisierten Overlays ist ein eigener Use Case.
2. **Technische Vorbilder selektiv studieren:** zunächst `gpt-organizer` (WXT/MV3), `chatgpt-chat-cleaner` (Projekt-/Chat-Erkennung) und `chatgpt-export` (inkrementeller, robuster Import).
3. **Sicherheitsgrenze nicht aufweichen:** Nur Same-Origin-Anfragen im angemeldeten Tab, keine Cookie-/Token-Extraktion, nur selektierte Felder an CB-LINUX; zunächst **read-only** und ausschließlich bewusster manueller Abruf.
4. **Adapter statt API-Kopplung im UI:** `ChatGPTAdapter` für interne API, optional `JsonImportAdapter` als Fallback; Versionierung und Validierung des eigenen Importschemas.
5. **Lizenzprüfung je Codeübernahme:** README-Funktionsvergleich bedeutet **keine Freigabe für Kopieren/Vendoring**. Besonders bei `NOASSERTION` und nicht ausgewiesener Lizenz keine Quellcodeübernahme.
6. **Erst danach entscheiden**, ob WXT für den Extension-Build vorteilhaft ist oder eine kleine Vite/MV3-Lösung genügt. Eigenes Dashboard und FastAPI/SQLite sind in beiden Fällen kompatibel.

## Quellen (abgerufen am 26.11.2026)

- [Chat Cleaner & Organizer – README](https://github.com/Shiva-The-Witch/chatgpt-chat-cleaner)
- [GPT Organizer – README](https://github.com/benedyktdryl/gpt-organizer)
- [ChatGPT Markdown Export – README](https://github.com/thekester/chatgpt-export)
- [ChatGPT Exporter – README](https://github.com/ezwep/chatgpt-exporter)
- [ChatGPT Conversations Exporter – README](https://github.com/withLinda/Chatgpt-conversations-exporter)
- [ChatGPT Project Sidebar – README](https://github.com/imranbarbhuiya/chatgpt-project-sidebar)
- [ChatPins – README](https://github.com/neona-fm/chatpins)
- [Chrome: Extension Service Worker](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers)
- [Chrome: Scripting API](https://developer.chrome.com/docs/extensions/reference/api/scripting)
- [Chrome: Permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions)

Hinweis: Diese Bewertung ist eine **Repository-/Dokumentationssicht**; die Fremdprojekte wurden weder installiert noch auf Sicherheit, API-Aktualität oder Funktionsfähigkeit getestet.
