import { Suspense } from "react";
import { CandidateList } from "@/components/candidate-list";

export default function Home() {
  return (
    <Suspense fallback={<p role="status">Loading talent pipeline…</p>}>
      <CandidateList />
    </Suspense>
  );
}
