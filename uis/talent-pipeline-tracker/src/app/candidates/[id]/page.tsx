import { CandidateDetail } from "@/components/candidate-detail";

export default async function CandidatePage({
  params,
  searchParams,
}: PageProps<"/candidates/[id]">) {
  const [{ id }, search] = await Promise.all([params, searchParams]);
  const query = new URLSearchParams();
  for (const [name, value] of Object.entries(search)) {
    if (typeof value === "string") query.set(name, value);
  }

  return <CandidateDetail key={id} id={id} listSearch={query.toString()} />;
}
