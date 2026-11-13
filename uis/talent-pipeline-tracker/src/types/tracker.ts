export interface CandidateInput {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  experience_years: number;
  linkedin_url: string | null;
  cv_url: string | null;
}

export interface Candidate extends CandidateInput {
  id: string;
  status: string;
  stage: string;
  notes_count: number;
  applied_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  record_id: string;
  content: string;
  created_at: string;
}

export interface CandidatePage {
  data: Candidate[];
  page: number;
  limit: number;
  total: number;
}

export interface NotesResponse {
  data: Note[];
  meta: { total: number };
}

export type CandidatePatch = Partial<Pick<Candidate, "status" | "stage">>;

export interface NoteInput {
  content: string;
}

export interface ApiValidationIssue {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ApiErrorResponse {
  detail?: string | ApiValidationIssue[];
}
