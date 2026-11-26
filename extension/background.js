import { normalizeSnapshot } from "./snapshot.js";

// Wird als serialisierbare, vollständig eigenständige Funktion in der
// ChatGPT-MAIN-World ausgeführt. Kein Zugriff auf Cookies oder Session-Tokens.
async function readProjectsOnChatGptPage() {
  if (location.origin !== "https://chatgpt.com") {
    throw new Error("Nicht auf chatgpt.com ausgeführt.");
  }
  const projects = new Map();
  const cursors = new Set();
  let cursor = null;
  let pageCount = 0;

  do {
    pageCount += 1;
    if (pageCount > 100) {
      throw new Error("Pagination abgebrochen: mehr als 100 Seiten.");
    }
    if (cursor !== null) {
      if (cursors.has(cursor)) {
        throw new Error("Pagination abgebrochen: Cursor wiederholt.");
      }
      cursors.add(cursor);
    }
    const params = new URLSearchParams({
      owned_only: "false",
      conversations_per_gizmo: "0",
      limit: "20"
    });
    if (cursor !== null) params.set("cursor", cursor);
    const response = await fetch(
      "/backend-api/gizmos/snorlax/sidebar?" + params.toString(),
      { credentials: "same-origin", signal: AbortSignal.timeout(20000) }
    );
    if (!response.ok) {
      throw new Error("ChatGPT-Projektabfrage: HTTP " + response.status);
    }
    const body = await response.json();
    if (!body || !Array.isArray(body.items)
      || !(body.cursor == null || typeof body.cursor === "string")) {
      throw new Error("Unerwartete ChatGPT-API-Antwort.");
    }
    for (const item of body.items) {
      const project = item?.gizmo?.gizmo;
      if (typeof project?.id !== "string"
        || typeof project?.display?.name !== "string") {
        throw new Error("Projektformat der ChatGPT-API hat sich geändert.");
      }
      // Ausdrückliche Whitelist, keine Anweisungen/Chats/Beschreibungen.
      projects.set(project.id, {
        id: project.id,
        name: project.display.name,
        created_at: typeof project.created_at === "string"
          ? project.created_at : null,
        updated_at: typeof project.updated_at === "string"
          ? project.updated_at : null
      });
    }
    if (projects.size > 10000) {
      throw new Error("Unerwartet große Projektliste.");
    }
    cursor = body.cursor || null;
  } while (cursor !== null);

  return {
    schemaVersion: 1,
    complete: true,
    capturedAt: new Date().toISOString(),
    pageCount,
    projects: [...projects.values()]
  };
}

async function locateChatGptTab() {
  const tabs = await chrome.tabs.query({ url: ["https://chatgpt.com/*"] });
  const candidates = tabs.filter(tab => Number.isInteger(tab.id));
  candidates.sort((a, b) =>
    Number(b.active) - Number(a.active)
    || (b.lastAccessed || 0) - (a.lastAccessed || 0)
  );
  if (!candidates.length) {
    throw new Error("Kein ChatGPT-Tab gefunden. Öffne chatgpt.com und melde dich an.");
  }
  return candidates[0].id;
}

async function refreshProjects() {
  const tabId = await locateChatGptTab();
  const frames = await chrome.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: readProjectsOnChatGptPage
  });
  if (!frames || !frames[0] || !frames[0].result) {
    throw new Error("Der ChatGPT-Tab lieferte kein Ergebnis.");
  }
  // Erst nach erfolgreichem, vollständigem Abruf und erneuter Prüfung speichern.
  // Bei Fehlern bleibt der letzte gültige Snapshot erhalten.
  const snapshot = normalizeSnapshot(frames[0].result, "live");
  await chrome.storage.local.set({ projectSnapshot: snapshot });
  return {
    count: snapshot.projects.length,
    capturedAt: snapshot.capturedAt,
    pageCount: snapshot.pageCount
  };
}

chrome.action.onClicked.addListener(() => {
  void chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") });
});

chrome.runtime.onInstalled.addListener(() => {
  // Verhindert später versehentlichen Zugriff durch Content Scripts.
  void chrome.storage.local.setAccessLevel({
    accessLevel: "TRUSTED_CONTEXTS"
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) return false;
  if (message?.type === "COCKPIT_REFRESH") {
    refreshProjects()
      .then(result => sendResponse({ ok: true, result }))
      .catch(error => sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : "Unbekannter Abruffehler."
      }));
    return true;
  }
  if (message?.type === "COCKPIT_OPEN_CHATGPT") {
    chrome.tabs.create({ url: "https://chatgpt.com/" })
      .then(() => sendResponse({ ok: true }))
      .catch(() => sendResponse({ ok: false, error: "ChatGPT konnte nicht geöffnet werden." }));
    return true;
  }
  return false;
});
