import assert from "node:assert/strict";
import { test } from "node:test";

let onMessage;
let saved = {};
const tabs = [{ id: 17, active: true, lastAccessed: 100 }];

globalThis.location = { origin: "https://chatgpt.com" };
globalThis.chrome = {
  runtime: {
    id: "cockpit-test",
    getURL: path => "chrome-extension://cockpit-test/" + path,
    onInstalled: { addListener() {} },
    onMessage: { addListener(fn) { onMessage = fn; } }
  },
  action: { onClicked: { addListener() {} } },
  tabs: {
    query: async () => tabs,
    create: async () => ({ id: 18 })
  },
  scripting: {
    executeScript: async ({ world, func }) => {
      assert.equal(world, "MAIN");
      return [{ result: await func() }];
    }
  },
  storage: {
    local: {
      set: async value => { saved = { ...saved, ...value }; },
      setAccessLevel: async () => {}
    }
  }
};

await import("../background.js");

const project = (character, name) => ({
  gizmo: {
    gizmo: {
      id: "g-p-" + character.repeat(32),
      display: { name },
      created_at: "2026-11-01T08:00:00Z",
      updated_at: "2026-11-13T16:00:00Z",
      instructions: "SENSITIVE INSTRUCTION (test only)",
      secret: "SHOULD NOT BE RETAINED"
    }
  },
  conversations: [{ title: "SENSITIVE CHAT (test only)" }]
});

function sendMessage(type) {
  return new Promise(resolve => {
    assert.equal(onMessage({ type }, { id: "cockpit-test" }, resolve), true);
  });
}

test("liest paginierte Sidebar komplett, hält gleichnamige Projekte auseinander und minimiert Daten", async () => {
  const requests = [];
  globalThis.fetch = async url => {
    const parsed = new URL(url, "https://chatgpt.com");
    requests.push(parsed);
    assert.equal(parsed.pathname, "/backend-api/gizmos/snorlax/sidebar");
    assert.equal(parsed.searchParams.get("conversations_per_gizmo"), "0");
    assert.equal(parsed.searchParams.get("owned_only"), "false");
    const isSecond = parsed.searchParams.has("cursor");
    return {
      ok: true,
      json: async () => isSecond
        ? { items: [project("b", "FLOW")], cursor: null }
        : { items: [project("a", "FLOW")], cursor: "second-page" }
    };
  };

  const response = await sendMessage("COCKPIT_REFRESH");
  assert.equal(response.ok, true);
  assert.equal(response.result.count, 2);
  assert.equal(response.result.pageCount, 2);
  assert.equal(requests.length, 2);
  assert.equal(requests[1].searchParams.get("cursor"), "second-page");
  assert.equal(saved.projectSnapshot.projects.length, 2);
  assert.notEqual(
    saved.projectSnapshot.projects[0].id,
    saved.projectSnapshot.projects[1].id
  );
  const json = JSON.stringify(saved);
  assert.equal(json.includes("SENSITIVE"), false);
  assert.equal(json.includes("SHOULD NOT"), false);
  assert.equal(json.includes("instructions"), false);
  assert.equal(json.includes("conversations"), false);
});

test("API-Fehler bewahrt den letzten gültigen Snapshot", async () => {
  const old = saved.projectSnapshot;
  globalThis.fetch = async () => ({ ok: false, status: 401 });
  const response = await sendMessage("COCKPIT_REFRESH");
  assert.equal(response.ok, false);
  assert.match(response.error, /HTTP 401/);
  assert.equal(saved.projectSnapshot, old);
});

test("beschädigte Pagination wird abgebrochen statt unvollständig gespeichert", async () => {
  const old = saved.projectSnapshot;
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ items: [project("c", "FLOW")], cursor: "repeat" })
  });
  const response = await sendMessage("COCKPIT_REFRESH");
  assert.equal(response.ok, false);
  assert.match(response.error, /Cursor wiederholt/);
  assert.equal(saved.projectSnapshot, old);
});

test("fremde Nachrichten werden ignoriert", () => {
  assert.equal(onMessage({ type: "COCKPIT_REFRESH" }, { id: "other-extension" }, () => {}), false);
});
