"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useResource } from "@/hooks/use-resource";
import { tracker } from "@/lib/api";
import { candidateHref, labelFor, listQuery, stages, statuses, withQuery } from "@/lib/pipeline";
import type { Candidate } from "@/types/tracker";
import { CandidateForm } from "./candidate-form";
import { RequestError } from "./feedback";

function updateQuery(changes: Record<string, string>, replace = false) {
  const query = listQuery(new URLSearchParams(window.location.search));
  for (const [key, value] of Object.entries(changes)) {
    if (value) query.set(key, value);
    else query.delete(key);
  }
  const href = withQuery("/", listQuery(query));
  if (href === window.location.pathname + window.location.search) return;
  if (replace) window.history.replaceState(null, "", href);
  else window.history.pushState(null, "", href);
}

function SearchBox({ search }: { search: string }) {
  const [draft, setDraft] = useState(search);
  const [previousSearch, setPreviousSearch] = useState(search);
  if (search !== previousSearch) {
    setPreviousSearch(search);
    setDraft(search);
  }

  useEffect(() => {
    if (draft.trim() === search) return;
    const timer = window.setTimeout(() => updateQuery({ search: draft.trim(), page: "" }, true), 300);
    return () => window.clearTimeout(timer);
  }, [draft, search]);

  return (
    <div className="field search">
      <label htmlFor="search">Search candidates</label>
      <input id="search" type="search" placeholder="Name or email" value={draft}
        onChange={(event) => setDraft(event.target.value)} />
    </div>
  );
}

function Filter({
  name, label, value, choices,
}: { name: string; label: string; value: string; choices: Record<string, string> }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <select id={name} value={value} onChange={(event) => updateQuery({ [name]: event.target.value, page: "" })}>
        <option value="">All {name === "status" ? "statuses" : "stages"}</option>
        {Object.entries(choices).map(([key, text]) => <option key={key} value={key}>{text}</option>)}
      </select>
    </div>
  );
}

export function CandidateList() {
  const query = listQuery(useSearchParams());
  const queryString = query.toString();
  const { state, refresh } = useResource(queryString, tracker.list);
  const [registering, setRegistering] = useState(false);
  const [created, setCreated] = useState<Candidate>();

  function registerDone(candidate: Candidate) {
    setCreated(candidate);
    setRegistering(false);
    refresh();
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Talent pipeline</h1>
          <p className="subtitle">Executive Assistant recruitment · Zaragoza headquarters</p>
        </div>
        {!registering && <button className="button primary" onClick={() => {
          setCreated(undefined);
          setRegistering(true);
        }}>New candidate</button>}
      </div>

      {registering && (
        <section className="panel form-panel" aria-labelledby="registration-title">
          <h2 id="registration-title">Register candidate</h2>
          <CandidateForm save={tracker.create} onSaved={registerDone} onCancel={() => setRegistering(false)} />
        </section>
      )}
      {created && (
        <div className="feedback success" role="status">
          <span>{created.full_name} was registered.</span>
          <Link href={candidateHref(created.id, query)}>Open candidate profile</Link>
        </div>
      )}

      <section className="panel list-panel" aria-labelledby="candidate-list-title">
        <div className="list-heading">
          <h2 id="candidate-list-title">Candidates</h2>
          <span role="status">{state.status === "success" && `${state.data.total} ${state.data.total === 1 ? "result" : "results"}`}</span>
        </div>
        <div className="filters">
          <SearchBox search={query.get("search") ?? ""} />
          <Filter name="status" label="Status" value={query.get("status") ?? ""} choices={statuses} />
          <Filter name="stage" label="Stage" value={query.get("stage") ?? ""} choices={stages} />
        </div>

        {state.status === "loading" && <p className="results-message" role="status">Loading candidates…</p>}
        {state.status === "error" && <RequestError message={state.error.message} retry={refresh} />}
        {state.status === "success" && (
          <>
            {state.data.data.length ? (
              <div className="table-container">
                <table aria-label="Candidates">
                  <thead><tr><th scope="col">Candidate</th><th scope="col">Position</th><th scope="col">Status</th><th scope="col">Stage</th></tr></thead>
                  <tbody>
                    {state.data.data.map((candidate) => (
                      <tr key={candidate.id}>
                        <th scope="row"><Link href={candidateHref(candidate.id, query)}>{candidate.full_name}</Link></th>
                        <td>{candidate.position}</td>
                        <td><span className="status-chip" data-status={candidate.status}>{labelFor(statuses, candidate.status)}</span></td>
                        <td>{labelFor(stages, candidate.stage)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="results-message">
                <p>{state.data.total ? "There are no candidates on this page." : "No candidates match these filters."}</p>
                {!!query.size && <button className="button secondary" onClick={() =>
                  updateQuery(state.data.total ? { page: "" } : { status: "", stage: "", search: "", page: "" })
                }>{state.data.total ? "Go to first page" : "Clear filters"}</button>}
              </div>
            )}
            {!!state.data.data.length && state.data.total > state.data.limit && (
              <nav aria-label="Candidate pages" className="pagination">
                <button className="button secondary" disabled={state.data.page <= 1}
                  onClick={() => updateQuery({ page: String(state.data.page - 1) })}>Previous</button>
                <span>Page {state.data.page} of {Math.ceil(state.data.total / state.data.limit)}</span>
                <button className="button secondary" disabled={state.data.page * state.data.limit >= state.data.total}
                  onClick={() => updateQuery({ page: String(state.data.page + 1) })}>Next</button>
              </nav>
            )}
          </>
        )}
      </section>
    </>
  );
}
