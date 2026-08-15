import { redirect } from "next/navigation";

export default function BenchmarksIndexPage() {
  redirect("/benchmarks/false-positives" as any);
}
