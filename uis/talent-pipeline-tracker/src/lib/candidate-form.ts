import type { CandidateInput } from "../types/tracker";

export const fields = [
  { name: "full_name", label: "Full name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "position", label: "Position", type: "text", required: true },
  { name: "experience_years", label: "Years of experience", type: "number", required: true },
  { name: "linkedin_url", label: "LinkedIn URL", type: "url", required: false },
  { name: "cv_url", label: "CV URL", type: "url", required: false },
] as const;

type Field = (typeof fields)[number]["name"];
export type FieldErrors = Partial<Record<Field, string>>;

export function safeWebUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

export function validateCandidate(form: FormData):
  { candidate: CandidateInput; errors?: never } | { candidate?: never; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const values = Object.fromEntries(fields.map(({ name, label, required }) => {
    const value = String(form.get(name) ?? "").trim();
    if (required && !value) errors[name] = `${label} is required.`;
    return [name, value];
  })) as Record<Field, string>;
  const experience = Number(values.experience_years);

  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (values.experience_years && (!Number.isFinite(experience) || experience < 0)) {
    errors.experience_years = "Enter zero or a positive number.";
  }
  for (const name of ["linkedin_url", "cv_url"] as const) {
    if (values[name] && !safeWebUrl(values[name])) errors[name] = "Enter an HTTP or HTTPS URL.";
  }
  if (Object.keys(errors).length) return { errors };

  return {
    candidate: {
      ...values,
      experience_years: experience,
      linkedin_url: values.linkedin_url || null,
      cv_url: values.cv_url || null,
    },
  };
}
