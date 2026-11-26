import { normalizeSnapshot } from "./snapshot.js";

const elements = Object.fromEntries([
  "refresh", "open-chatgpt", "status", "project-count", "page-count",
  "captured-at", "source-label", "search", "filter-count",
  "project-list", "export", "import-file"
].map(id => [id, document.getElementById(id)]));

let snapshot = null;
let busy = false;

function formatDate(date) {
  if (!date) return "–";
  const time = Date.parse(date);
  return Number.isFinite(time)
    ? new Date(time).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" })
    : "–";
}

function setStatus(message, level = "info") {
  elements.status.textContent = message;
  elements.status.className = "notice " + level;
}

function showProjects() {
  const query = elements.search.value.trim().toLocaleLowerCase("de");
  const projects = snapshot?.projects ?? [];
  const visible = projects.filter(project =>
    project.name.toLocaleLowerCase("de").includes(query)
    || project.id.toLocaleLowerCase("de").includes(query)
  );
  elements["project-count"].textContent = snapshot ? String(projects.length) : "–";
  elements["page-count"].textContent = snapshot && snapshot.pageCount !== null
    ? String(snapshot.pageCount) : "–";
  elements["captured-at"].textContent = snapshot ? formatDate(snapshot.capturedAt) : "–";
  elements["source-label"].textContent = snapshot
    ? (snapshot.source === "live" ? "ChatGPT (Live)" : "JSON-Import") : "–";
  elements["filter-count"].textContent = String(visible.length) + " von " + projects.length;
  elements.export.disabled = !snapshot;
  elements["project-list"].replaceChildren();
  if (!visible.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.className = "empty";
    cell.textContent = snapshot ? "Keine Treffer." : "Noch keine Projekte geladen.";
    row.append(cell);
    elements["project-list"].append(row);
    return;
  }
  for (const project of visible) {
    const row = document.createElement("tr");
    const name = document.createElement("td");
    name.className = "project-name";
    name.textContent = project.name;
    const id = document.createElement("td");
    id.className = "project-id";
    id.textContent = project.id;
    const updated = document.createElement("td");
    updated.textContent = formatDate(project.updated_at);
    row.append(name, id, updated);
    elements["project-list"].append(row);
  }
}

async function loadStoredSnapshot() {
  try {
    const stored = await chrome.storage.local.get("projectSnapshot");
    if (stored.projectSnapshot) {
      snapshot = normalizeSnapshot(stored.projectSnapshot, stored.projectSnapshot.source);
      setStatus("Gespeicherter Stand geladen. Für neue Daten »Projekte aktualisieren« wählen.");
    } else {
      setStatus("Noch kein Snapshot vorhanden. Öffne ChatGPT und aktualisiere.", "info");
    }
  } catch (error) {
    setStatus("Gespeicherte Daten konnten nicht geladen werden: " + String(error), "error");
  }
  showProjects();
}

async function refresh() {
  if (busy) return;
  busy = true;
  elements.refresh.disabled = true;
  setStatus("Lese Projektmetadaten aus dem angemeldeten ChatGPT-Tab …");
  try {
    const response = await chrome.runtime.sendMessage({ type: "COCKPIT_REFRESH" });
    if (!response?.ok) throw new Error(response?.error || "Abruf fehlgeschlagen.");
    const stored = await chrome.storage.local.get("projectSnapshot");
    snapshot = normalizeSnapshot(stored.projectSnapshot, "live");
    showProjects();
    setStatus("Erfolgreich aktualisiert: " + response.result.count + " Projekte aus "
      + response.result.pageCount + " API-Seiten.");
  } catch (error) {
    setStatus("Aktualisierung fehlgeschlagen: "
      + (error instanceof Error ? error.message : String(error))
      + " Der letzte gültige Stand bleibt erhalten.", "error");
  } finally {
    busy = false;
    elements.refresh.disabled = false;
  }
}

async function importJson(file) {
  if (!file) return;
  if (file.size > 2_000_000) {
    setStatus("Importdatei ist zu groß (max. 2 MB).", "error");
    return;
  }
  try {
    const data = JSON.parse(await file.text());
    const imported = normalizeSnapshot(data, "import");
    await chrome.storage.local.set({ projectSnapshot: imported });
    snapshot = imported;
    showProjects();
    setStatus("JSON-Import erfolgreich: " + imported.projects.length + " Projekte.");
  } catch (error) {
    setStatus("JSON-Import fehlgeschlagen: "
      + (error instanceof Error ? error.message : String(error)), "error");
  } finally {
    elements["import-file"].value = "";
  }
}

function exportJson() {
  if (!snapshot) return;
  const blob = new Blob([JSON.stringify(snapshot, null, 2) + "\n"], {
    type: "application/json;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "chatgpt-projects-" + new Date().toISOString().slice(0, 10) + ".json";
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

elements.refresh.addEventListener("click", refresh);
elements.search.addEventListener("input", showProjects);
elements.export.addEventListener("click", exportJson);
elements["import-file"].addEventListener("change", event => {
  void importJson(event.target.files?.[0]);
});
elements["open-chatgpt"].addEventListener("click", () => {
  void chrome.runtime.sendMessage({ type: "COCKPIT_OPEN_CHATGPT" });
});
void loadStoredSnapshot();
