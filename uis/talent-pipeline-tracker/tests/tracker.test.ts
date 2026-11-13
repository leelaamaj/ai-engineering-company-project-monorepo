import assert from "node:assert/strict";
import { test } from "node:test";
import { safeWebUrl, validateCandidate } from "../src/lib/candidate-form.ts";
import { candidateHref, labelFor, listQuery, stages, statuses } from "../src/lib/pipeline.ts";

test("candidate form keeps zero experience and normalizes blank optional links", () => {
  const form = new FormData();
  const candidate = {
    full_name: "Jordan Example",
    email: "jordan@example.test",
    phone: "+34 555 010 011",
    position: "Executive Assistant",
    experience_years: "0",
  };
  for (const [key, value] of Object.entries(candidate)) form.set(key, value);
  assert.deepEqual(validateCandidate(form), {
    candidate: { ...candidate, experience_years: 0, linkedin_url: null, cv_url: null },
  });
});

test("candidate form rejects blanks, malformed fields, and unsafe links", () => {
  const form = new FormData();
  form.set("full_name", "  ");
  form.set("email", "broken");
  form.set("experience_years", "-1");
  form.set("cv_url", "javascript:alert(1)");
  assert.deepEqual(Object.keys(validateCandidate(form).errors ?? {}).sort(), [
    "cv_url", "email", "experience_years", "full_name", "phone", "position",
  ]);
  assert.equal(safeWebUrl("javascript:alert(1)"), null);
});

test("query combines validated criteria and preserves them in an encoded candidate link", () => {
  const query = listQuery(new URLSearchParams("stage=review&status=in_progress&search=%20Jordan%20&page=2&other=1"));
  assert.equal(candidateHref("person/1", query), "/candidates/person%2F1?status=in_progress&stage=review&search=Jordan&page=2");
  assert.equal(listQuery(new URLSearchParams("status=toString&stage=invalid&page=-3")).size, 0);
});

test("pipeline labels match the briefing and handle unfamiliar server values", () => {
  assert.equal(labelFor(statuses, "in_progress"), "In progress");
  assert.equal(labelFor(stages, "personal_interview"), "Personal interview");
  assert.equal(labelFor(stages, "unknown_api_code"), "Unknown");
});
