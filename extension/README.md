# ChatGPT Cockpit – Chrome-Erweiterung (M0)

**Funktional implementiert, aber noch nicht in einer echten angemeldeten Chrome-Sitzung abgenommen.** Keine LAN-Synchronisation; nur Metadaten und manueller Abruf.

## Installation

1. Repository klonen oder als ZIP herunterladen und **entpacken**.
2. Chrome öffnen: `chrome://extensions`.
3. **Entwicklermodus** aktivieren → **Entpackte Erweiterung laden**.
4. Den Ordner **`extension/`** auswählen (dort liegt `manifest.json`).
5. Chrome-Erweiterung an die Symbolleiste anheften (optional).
6. `https://chatgpt.com` öffnen und anmelden.
7. Auf das **ChatGPT Cockpit**-Erweiterungssymbol klicken → eigenes Dashboard öffnet sich.
8. **Projekte aktualisieren** klicken. Der letzte gültige Abruf bleibt im Browser gespeichert.

Das Dashboard kann außerdem einen lokalen JSON-Projektexport importieren, falls die interne ChatGPT-API nicht erreichbar ist. Der bisherige Export aus `ai-workspace` mit `projects[]` wird unterstützt.

## Berechtigungen / Datenschutz

- `scripting`: auf bewusste Benutzeraktion hin Skript in einem vorhandenen ChatGPT-Tab ausführen.
- `host_permissions`: **nur** `https://chatgpt.com/*` zur Tab-Erkennung und Same-Origin-Injektion.
- `storage`: letzter Snapshot in `chrome.storage.local` des jeweiligen Profils.
- Es werden **nur** `id`, `name`, `created_at` und `updated_at` gespeichert. Keine Roh-API-Antworten, Anweisungen, Chats, Cookies oder Token.
- Es gibt **keinen externen Sync**, kein Tracking und keine Netzwerkanfragen außer dem Same-Origin-Abruf durch den ChatGPT-Tab. JSON-Export ist nur lokal.
- Rückmeldungen von Chrome/ChatGPT werden angezeigt; bei Fehlschlägen bleibt der alte Stand bestehen.

## Tests

```bash
node --version  # Node 22 empfohlen
npm run check   # Keine npm-Installation nötig
```

Eine echte End-to-End-Prüfung des Web-Endpunkts muss auf einem angemeldeten eigenen PC erfolgen. Die API ist intern und kann jederzeit ihre Struktur oder Authentifizierungsanforderungen ändern.

## Fehlerbehebung

- **Kein ChatGPT-Tab:** `chatgpt.com` öffnen, anmelden, danach erneut aktualisieren.
- **401/403:** Login/Berechtigungen prüfen; keine Sessions oder Header in Code kopieren.
- **API-Format geändert:** Über die README/Issues feststellen, ob der Adapter angepasst werden muss.
- **Leere Liste:** Bei erfolgreichem Abruf kann das legitim sein; Testweise JSON importieren.
- **Erweiterung verändert:** Unter `chrome://extensions` den Neu-laden-Pfeil wählen, Dashboard neu öffnen.

## Abgrenzung

Dies ist ein **absichtlich dependency-freier M0-Adapter mit HTML/CSS/JavaScript**. Das verhindert einen zusätzlichen Build-Schritt beim ersten Test der risikoreichsten Komponente. Vue 3 / TypeScript, Chat-Liste, Repo-Mapping und der CB-LINUX-Synchronisationsdienst folgen erst nach Abnahme der Erfassung. Die konzeptionelle Zielarchitektur bleibt erhalten.
