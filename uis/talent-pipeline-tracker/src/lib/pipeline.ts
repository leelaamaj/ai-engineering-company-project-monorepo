export const statuses = {
  received: "Received",
  in_progress: "In progress",
  selected: "Selected",
  discarded: "Discarded",
};

export const stages = {
  pending: "Pending review",
  review: "Under review",
  personal_interview: "Personal interview",
  technical_interview: "Technical interview",
  offer_presented: "Offer presented",
};

export function labelFor(labels: Record<string, string>, value: string) {
  return Object.hasOwn(labels, value) ? labels[value] : "Unknown";
}

export function listQuery(params: Pick<URLSearchParams, "get">) {
  const query = new URLSearchParams();
  const status = params.get("status") ?? "";
  const stage = params.get("stage") ?? "";
  const search = params.get("search")?.trim();
  const page = Number(params.get("page"));

  if (Object.hasOwn(statuses, status)) query.set("status", status);
  if (Object.hasOwn(stages, stage)) query.set("stage", stage);
  if (search) query.set("search", search);
  if (Number.isSafeInteger(page) && page > 1) query.set("page", String(page));
  return query;
}

export function withQuery(path: string, query: URLSearchParams) {
  const suffix = query.toString();
  return suffix ? `${path}?${suffix}` : path;
}

export function candidateHref(id: string, query: URLSearchParams) {
  return withQuery(`/candidates/${encodeURIComponent(id)}`, query);
}
