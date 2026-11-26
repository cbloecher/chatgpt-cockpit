/**
 * Eigenes, minimiertes Datenformat. Keine Rohantworten, Sessiondaten oder
 * Gesprächsinhalte übernehmen. Auch importierte Dateien sind nicht vertrauenswürdig.
 */
const MAX_PROJECTS = 10000;
const MAX_NAME = 500;

function optionalDate(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value))
    ? value
    : null;
}

export function normalizeProjects(items) {
  if (!Array.isArray(items) || items.length > MAX_PROJECTS) {
    throw new Error("Ungültige Projektliste oder zu viele Einträge.");
  }
  const byId = new Map();
  for (const item of items) {
    if (!item || typeof item !== "object"
      || typeof item.id !== "string"
      || !/^g-p-[a-zA-Z0-9-]{8,160}$/.test(item.id)
      || typeof item.name !== "string"
      || !item.name.trim() || item.name.length > MAX_NAME) {
      throw new Error("Ungültiger Projekt-Eintrag im Import.");
    }
    byId.set(item.id, {
      id: item.id,
      name: item.name,
      created_at: optionalDate(item.created_at),
      updated_at: optionalDate(item.updated_at)
    });
  }
  return [...byId.values()].sort((a, b) =>
    a.name.localeCompare(b.name, "de", { sensitivity: "base" }) ||
    a.id.localeCompare(b.id)
  );
}

export function normalizeSnapshot(input, source = "import") {
  const root = Array.isArray(input) ? { projects: input } : input;
  if (!root || typeof root !== "object" || !Array.isArray(root.projects)) {
    throw new Error("Keine Projektliste gefunden (projects[] erwartet).");
  }
  if (root.complete === false) {
    throw new Error("Unvollständigen Abruf nicht als Snapshot übernehmen.");
  }
  const projects = normalizeProjects(root.projects);
  // Externe Exporte dürfen keine beliebigen zusätzlichen Felder durchreichen.
  return {
    schemaVersion: 1,
    source: source === "live" ? "live" : "import",
    capturedAt: optionalDate(root.capturedAt)
      ?? optionalDate(root.exported_date)
      ?? new Date().toISOString(),
    pageCount: Number.isInteger(root.pageCount)
      && root.pageCount >= 0 && root.pageCount <= 100 ? root.pageCount : null,
    projects
  };
}
