"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useResource } from "@/hooks/use-resource";
import { tracker } from "@/lib/api";
import type { Note } from "@/types/tracker";
import { RequestError } from "./feedback";

function DeleteConfirmation({
  note, pending, onCancel, onConfirm,
}: { note: Note; pending: boolean; onCancel: () => void; onConfirm: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  return (
    <dialog ref={dialog} aria-labelledby="delete-title" onCancel={(event) => {
      event.preventDefault();
      if (!pending) onCancel();
    }}>
      <h2 id="delete-title">Delete this note?</h2>
      <p>{note.content}</p>
      <div className="actions">
        <button className="button secondary" disabled={pending} onClick={onCancel}>Cancel</button>
        <button className="button danger" disabled={pending} onClick={onConfirm}>
          {pending ? "Deleting…" : "Delete note"}
        </button>
      </div>
    </dialog>
  );
}

function noteTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "Date unavailable" : new Intl.DateTimeFormat("en", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Madrid",
  }).format(date);
}

export function CandidateNotes({ id }: { id: string }) {
  const { state, refresh } = useResource(id, tracker.notes);
  const [content, setContent] = useState("");
  const [failure, setFailure] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [deleting, setDeleting] = useState<Note>();
  const inFlight = useRef(false);

  async function mutate(action: () => Promise<unknown>, success: string) {
    if (inFlight.current) return false;
    inFlight.current = true;
    setFailure("");
    setMessage("");
    setPending(true);
    try {
      await action();
      setMessage(success);
      refresh();
      return true;
    } catch (error) {
      setFailure(error instanceof Error ? error.message : "Could not update notes.");
      return false;
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = content.trim();
    if (!text) {
      setMessage("");
      setFailure("Enter a note before adding it.");
      return;
    }
    if (await mutate(() => tracker.addNote(id, { content: text }), "Note added.")) setContent("");
  }

  async function remove(note: Note) {
    await mutate(() => tracker.deleteNote(id, note.id), "Note deleted.");
    setDeleting(undefined);
  }

  return (
    <section className="panel detail-panel" aria-labelledby="notes-title">
      <h2 id="notes-title">Internal notes</h2>
      {message && <p className="feedback success" role="status">{message}</p>}
      {failure && <RequestError message={failure} />}
      {state.status === "loading" && <p role="status" className="small-message">Loading notes…</p>}
      {state.status === "error" && <RequestError message={state.error.message} retry={refresh} />}
      {state.status === "success" && (state.data.data.length ? (
        <ul className="notes-list">
          {state.data.data.map((note) => (
            <li key={note.id}>
              <div>
                <time dateTime={note.created_at}>{noteTime(note.created_at)}</time>
                <p>{note.content}</p>
              </div>
              <button className="button secondary" disabled={pending} onClick={() => setDeleting(note)}>Delete note</button>
            </li>
          ))}
        </ul>
      ) : <p role="status" className="small-message">No internal notes yet.</p>)}
      <form onSubmit={add} aria-busy={pending} className="notes-form">
        <div className="field">
          <label htmlFor="note-content">New note</label>
          <textarea id="note-content" value={content} onChange={(event) => setContent(event.target.value)}
            rows={3} required disabled={pending || state.status !== "success"} />
        </div>
        <button className="button primary" disabled={pending || state.status !== "success"}>
          {pending && !deleting ? "Adding…" : "Add note"}
        </button>
      </form>
      {deleting && <DeleteConfirmation note={deleting} pending={pending} onCancel={() => setDeleting(undefined)}
        onConfirm={() => void remove(deleting)} />}
    </section>
  );
}
