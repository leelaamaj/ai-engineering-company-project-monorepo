"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { fields, validateCandidate, type FieldErrors } from "@/lib/candidate-form";
import type { Candidate, CandidateInput } from "@/types/tracker";
import { RequestError } from "./feedback";

interface CandidateFormProps {
  candidate?: Candidate;
  save: (input: CandidateInput) => Promise<Candidate>;
  onSaved: (candidate: Candidate) => void;
  onCancel: () => void;
}

export function CandidateForm({ candidate, save, onSaved, onCancel }: CandidateFormProps) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [failure, setFailure] = useState("");
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const result = validateCandidate(new FormData(form));
    setFailure("");
    setErrors(result.errors ?? {});
    if (result.errors) {
      const first = fields.find(({ name }) => result.errors[name]);
      if (first) (form.elements.namedItem(first.name) as HTMLInputElement).focus();
      return;
    }

    inFlight.current = true;
    setPending(true);
    try {
      const saved = await save(result.candidate);
      onSaved(saved);
    } catch (error) {
      setFailure(error instanceof Error ? error.message : "Could not save the candidate.");
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <form className="candidate-form" noValidate onSubmit={submit} aria-busy={pending}>
      <fieldset disabled={pending} className="form-grid">
        {fields.map(({ name, label, type, required }) => (
          <div key={name} className="field">
            <label htmlFor={name}>{label}{!required && <span> (optional)</span>}</label>
            <input
              id={name}
              name={name}
              type={type}
              min={type === "number" ? 0 : undefined}
              step={type === "number" ? "any" : undefined}
              required={required}
              defaultValue={candidate?.[name] ?? (name === "position" ? "Executive Assistant" : "")}
              aria-invalid={!!errors[name]}
              aria-describedby={errors[name] ? `${name}-error` : undefined}
            />
            {errors[name] && <p id={`${name}-error`} className="field-error">{errors[name]}</p>}
          </div>
        ))}
      </fieldset>
      {failure && <RequestError message={failure} />}
      <div className="actions">
        <button className="button primary" disabled={pending}>
          {pending ? "Saving…" : candidate ? "Save changes" : "Register candidate"}
        </button>
        <button type="button" className="button secondary" onClick={onCancel} disabled={pending}>Cancel</button>
      </div>
    </form>
  );
}
