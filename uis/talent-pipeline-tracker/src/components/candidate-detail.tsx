"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useResource } from "@/hooks/use-resource";
import { tracker, TrackerError } from "@/lib/api";
import { safeWebUrl } from "@/lib/candidate-form";
import { labelFor, listQuery, stages, statuses, withQuery } from "@/lib/pipeline";
import type { Candidate } from "@/types/tracker";
import { CandidateForm } from "./candidate-form";
import { CandidateNotes } from "./candidate-notes";
import { RequestError } from "./feedback";

function ProfileLink({ value, label }: { value: string | null; label: string }) {
  const href = safeWebUrl(value);
  return href ? <a href={href} target="_blank" rel="noreferrer">{label}</a> : "Unavailable";
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "Unavailable" : new Intl.DateTimeFormat("en", {
    year: "numeric", month: "short", day: "numeric", timeZone: "Europe/Madrid",
  }).format(date);
}

function Profile({ candidate }: { candidate: Candidate }) {
  return (
    <dl className="profile-grid">
      <div><dt>Full name</dt><dd>{candidate.full_name}</dd></div>
      <div><dt>Position</dt><dd>{candidate.position}</dd></div>
      <div><dt>Email</dt><dd>{candidate.email}</dd></div>
      <div><dt>Phone</dt><dd>{candidate.phone}</dd></div>
      <div><dt>Years of experience</dt><dd>{candidate.experience_years}</dd></div>
      <div><dt>Application date</dt><dd>{formatDate(candidate.applied_at)}</dd></div>
      <div><dt>LinkedIn</dt><dd><ProfileLink value={candidate.linkedin_url} label="Open LinkedIn profile" /></dd></div>
      <div><dt>CV</dt><dd><ProfileLink value={candidate.cv_url} label="Open CV" /></dd></div>
    </dl>
  );
}

function CandidateProfile({
  candidate, onUpdate,
}: { candidate: Candidate; onUpdate: (candidate: Candidate) => void }) {
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState<"status" | "stage">();
  const [message, setMessage] = useState("");
  const [failure, setFailure] = useState("");
  const inFlight = useRef(false);

  async function update(field: "status" | "stage", value: string) {
    if (inFlight.current || value === candidate[field]) return;
    inFlight.current = true;
    setPending(field);
    setMessage("");
    setFailure("");
    try {
      const saved = await tracker.patch(candidate.id, { [field]: value });
      onUpdate(saved);
      setMessage(field === "status" ? "Status updated." : "Stage updated.");
    } catch (error) {
      setFailure(error instanceof Error ? error.message : "Could not update the pipeline.");
    } finally {
      inFlight.current = false;
      setPending(undefined);
    }
  }

  return (
    <>
      <div className="page-heading">
        <div><h1>{candidate.full_name}</h1><p className="subtitle">{candidate.position}</p></div>
        {!editing && <button className="button secondary" disabled={!!pending} onClick={() => {
          setFailure("");
          setMessage("");
          setEditing(true);
        }}>Edit candidate</button>}
      </div>
      {message && <p className="feedback success" role="status">{message}</p>}
      <section className="panel detail-panel" aria-labelledby="profile-title">
        <h2 id="profile-title">{editing ? "Edit candidate details" : "Candidate details"}</h2>
        {editing ? (
          <CandidateForm candidate={candidate} save={(input) => tracker.replace(candidate.id, input)}
            onSaved={(saved) => {
              onUpdate(saved);
              setEditing(false);
              setMessage("Candidate details saved.");
            }}
            onCancel={() => setEditing(false)} />
        ) : <Profile candidate={candidate} />}
      </section>

      <section className="panel detail-panel" aria-labelledby="pipeline-title" aria-busy={!!pending}>
        <h2 id="pipeline-title">Pipeline</h2>
        <fieldset className="pipeline-grid" disabled={!!pending || editing}>
          {([
            { field: "status", label: "Status", options: statuses },
            { field: "stage", label: "Stage", options: stages },
          ] as const).map(({ field, label, options }) => (
            <div className="field" key={field}>
              <label htmlFor={field}>{label}</label>
              <select id={field} value={candidate[field]} onChange={(event) => void update(field, event.target.value)}>
                {!Object.hasOwn(options, candidate[field]) && (
                  <option value={candidate[field]} disabled>{labelFor(options, candidate[field])}</option>
                )}
                {Object.entries(options).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
              </select>
            </div>
          ))}
        </fieldset>
        {pending && <p role="status" className="small-message">Updating {pending}…</p>}
        {failure && <RequestError message={failure} />}
      </section>
    </>
  );
}

export function CandidateDetail({ id, listSearch }: { id: string; listSearch: string }) {
  const { state, refresh, update } = useResource(id, tracker.get);
  const back = withQuery("/", listQuery(new URLSearchParams(listSearch)));
  const missing = state.status === "error" && state.error instanceof TrackerError && state.error.status === 404;

  return (
    <>
      <Link href={back} className="back-link">Back to candidates</Link>
      {state.status === "loading" && <p role="status">Loading candidate…</p>}
      {state.status === "error" && <RequestError
        message={missing ? "This candidate could not be found." : state.error.message}
        retry={missing ? undefined : refresh} />}
      {state.status === "success" && <CandidateProfile candidate={state.data} onUpdate={update} />}
      {!missing && <CandidateNotes id={id} />}
    </>
  );
}
