import { createServer } from "node:http";

const records = Array.from({ length: 24 }, (_, index) => {
  const id = String(index + 1);
  return {
    id,
    full_name: index === 0 ? "Jordan Example" : `Test Candidate ${id}`,
    email: index === 0 ? "jordan@example.test" : `candidate-${id}@example.test`,
    phone: "+34 555 010 011",
    position: "Executive Assistant",
    experience_years: 0,
    linkedin_url: null,
    cv_url: null,
    status: index === 0 ? "in_progress" : "received",
    stage: index === 0 ? "review" : "pending",
    applied_at: "2026-10-19T13:00:00Z",
    updated_at: "2026-10-19T13:00:00Z",
    notes_count: 0,
  };
});
const notes = new Map();
const failures = new Set();
let nextId = 25;
let nextNoteId = 1;

async function readBody(request) {
  let body = "";
  for await (const chunk of request) body += chunk;
  return JSON.parse(body);
}

function send(response, status, data) {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Content-Type": "application/json",
  });
  response.end(data === undefined ? undefined : JSON.stringify(data));
}

createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  const { searchParams, pathname } = url;
  const { method } = request;
  if (method === "OPTIONS") return send(response, 204);
  try {
    if (pathname === "/records" && method === "GET") {
      const page = Number(searchParams.get("page") ?? 1);
      const limit = Number(searchParams.get("limit") ?? 20);
      const status = searchParams.get("status");
      const stage = searchParams.get("stage");
      const search = searchParams.get("search")?.toLowerCase();
      if (search === "retry once" && !failures.has(search)) {
        failures.add(search);
        return send(response, 503, { detail: "Fixture temporarily unavailable." });
      }
      const matches = records.filter((record) => (
        (!status || record.status === status) && (!stage || record.stage === stage) &&
        (!search || [record.full_name, record.email].some((text) => text.toLowerCase().includes(search)))
      ));
      return send(response, 200, {
        data: matches.slice((page - 1) * limit, page * limit), total: matches.length, page, limit,
      });
    }
    if (pathname === "/records" && method === "POST") {
      const body = await readBody(request);
      if (body.email === "rejected@example.test") return send(response, 422, { detail: "Fixture rejected this email." });
      const now = new Date().toISOString();
      const candidate = {
        ...body, id: String(nextId++), status: "received", stage: "pending", notes_count: 0,
        applied_at: now, updated_at: now,
      };
      records.unshift(candidate);
      return send(response, 201, candidate);
    }

    const [, , id, section, noteId] = pathname.split("/");
    const candidate = records.find((record) => record.id === id);
    if (!candidate) return send(response, 404, { detail: "Candidate not found." });
    if (!section && method === "GET") return send(response, 200, candidate);
    if (!section && (method === "PUT" || method === "PATCH")) {
      const body = await readBody(request);
      Object.assign(candidate, body, { updated_at: new Date().toISOString() });
      return send(response, 200, candidate);
    }

    if (section === "notes") {
      const list = notes.get(id) ?? [];
      if (method === "GET") return send(response, 200, { data: list, meta: { total: list.length } });
      if (method === "POST") {
        const { content } = await readBody(request);
        const note = { id: String(nextNoteId++), record_id: id, content, created_at: new Date().toISOString() };
        notes.set(id, [note, ...list]);
        candidate.notes_count = list.length + 1;
        return send(response, 201, note);
      }
      if (method === "DELETE" && noteId) {
        const remaining = list.filter((note) => note.id !== noteId);
        notes.set(id, remaining);
        candidate.notes_count = remaining.length;
        return send(response, 204);
      }
    }
    return send(response, 404, { detail: "Route not found." });
  } catch {
    return send(response, 400, { detail: "Invalid fixture request." });
  }
}).listen(4311, "127.0.0.1", () => console.log("Tracker fixture listening at http://127.0.0.1:4311"));
