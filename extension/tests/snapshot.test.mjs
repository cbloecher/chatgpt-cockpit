import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeProjects, normalizeSnapshot } from "../snapshot.js";

const p = (id, name) => ({ id: "g-p-" + id.repeat(32), name,
  created_at: "2026-01-01T12:00:00Z", updated_at: "2026-01-02T12:00:00Z" });

test("gleichnamige Projekte mit verschiedenen IDs bleiben erhalten", () => {
  const list = normalizeProjects([p("a", "FLOW"), p("b", "FLOW")]);
  assert.equal(list.length, 2);
  assert.notEqual(list[0].id, list[1].id);
});

test("Import akzeptiert vorhandenes minimiertes JSON-Format", () => {
  const result = normalizeSnapshot({
    source: "sidebar", exported_date: "2026-11-13T12:00:00Z",
    projects: [p("c", "Nesting")]
  });
  assert.equal(result.source, "import");
  assert.equal(result.projects.length, 1);
  assert.equal(result.capturedAt, "2026-11-13T12:00:00Z");
  assert.deepEqual(Object.keys(result.projects[0]), [
    "id", "name", "created_at", "updated_at"
  ]);
});

test("sensitive Rohdaten werden explizit nicht in den Snapshot übernommen", () => {
  const input = p("d", "Test");
  input.instructions = "private data";
  input.token = "secret";
  const result = normalizeSnapshot({ projects: [input] }, "live");
  assert.equal(JSON.stringify(result).includes("private data"), false);
  assert.equal(JSON.stringify(result).includes("secret"), false);
});

test("unvollständige Snapshots werden abgewiesen", () => {
  assert.throws(() =>
    normalizeSnapshot({ complete: false, projects: [p("e", "Test")] }),
    /Unvollständigen/
  );
});

test("ungültige IDs und Leernamen werden abgewiesen", () => {
  assert.throws(() => normalizeProjects([{ id: "unsafe", name: "A" }]));
  assert.throws(() => normalizeProjects([{ id: "g-p-" + "f".repeat(32), name: "" }]));
});

test("gleiche IDs werden nach der letzten gültigen Beobachtung geführt", () => {
  const a = p("1", "Alter Titel");
  const b = p("1", "Neuer Titel");
  const result = normalizeProjects([a, b]);
  assert.equal(result.length, 1);
  assert.equal(result[0].name, "Neuer Titel");
});

test("importierte Daten mit anderen Feldern bleiben minimiert", () => {
  const item = p("2", "Test");
  const result = normalizeSnapshot({
    projects: [item], irrelevant: { secret: "private" }, pageCount: 999
  });
  assert.equal(result.pageCount, null);
  assert.equal("irrelevant" in result, false);
});

test("Zeitstempel werden nur bei gültigem Datum gespeichert", () => {
  const item = p("3", "Test");
  item.updated_at = "not a date";
  assert.equal(normalizeProjects([item])[0].updated_at, null);
});
