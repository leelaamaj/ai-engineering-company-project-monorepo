import type {
  ApiErrorResponse, Candidate, CandidateInput, CandidatePage, CandidatePatch, NoteInput, NotesResponse,
} from "@/types/tracker";

const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

export class TrackerError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!apiBase) throw new TrackerError("Set NEXT_PUBLIC_API_URL to connect to the tracker.");

  let response: Response;
  try {
    response = await fetch(`${apiBase}${path}`, {
      cache: "no-store",
      ...options,
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
    });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    throw new TrackerError("Could not connect to the tracker. Check your connection and try again.");
  }

  if (!response.ok) {
    const error: ApiErrorResponse | null = await response.json().catch(() => null);
    const detail = error?.detail;
    const message = Array.isArray(detail) ? detail.map((issue) => issue.msg).join(" ") : detail;
    throw new TrackerError(message || `The tracker returned an error (${response.status}). Try again.`, response.status);
  }

  if (response.status === 204) return undefined as T;
  return await response.json() as T;
}

function recordPath(id: string) {
  return `/records/${encodeURIComponent(id)}`;
}

export const tracker = {
  async list(query: string, signal: AbortSignal) {
    const params = new URLSearchParams(query);
    params.set("limit", "20");
    return await request<CandidatePage>(`/records?${params}`, { signal });
  },
  async get(id: string, signal: AbortSignal) {
    return await request<Candidate>(recordPath(id), { signal });
  },
  async create(candidate: CandidateInput) {
    return await request<Candidate>("/records", { method: "POST", body: JSON.stringify(candidate) });
  },
  async replace(id: string, candidate: CandidateInput) {
    return await request<Candidate>(recordPath(id), { method: "PUT", body: JSON.stringify(candidate) });
  },
  async patch(id: string, change: CandidatePatch) {
    return await request<Candidate>(recordPath(id), { method: "PATCH", body: JSON.stringify(change) });
  },
  async notes(id: string, signal: AbortSignal) {
    return await request<NotesResponse>(`${recordPath(id)}/notes`, { signal });
  },
  async addNote(id: string, note: NoteInput) {
    await request<unknown>(`${recordPath(id)}/notes`, { method: "POST", body: JSON.stringify(note) });
  },
  async deleteNote(id: string, noteId: string) {
    await request<void>(`${recordPath(id)}/notes/${encodeURIComponent(noteId)}`, { method: "DELETE" });
  },
};
