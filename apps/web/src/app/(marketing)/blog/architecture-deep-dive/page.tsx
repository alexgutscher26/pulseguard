import type { Metadata } from "next";
import PostLayout from "@/components/blog/post-layout";

export const metadata: Metadata = {
  title: "Building a monitoring mesh: architecture deep dive | PulseGuard Blog",
  description:
    "How we designed PulseGuard's distributed check infrastructure for reliability, low latency, and horizontal scalability across 12 global regions.",
};

export default function Post() {
  return (
    <PostLayout
      title="Building a monitoring mesh: architecture deep dive"
      date="June 5, 2026"
      readTime="12 min read"
      category="Engineering"
    >
      <p>
        PulseGuard&apos;s monitoring infrastructure is built as a distributed mesh — a network of
        lightweight check nodes spread across 12 global regions that coordinate to verify endpoint
        availability. Here&apos;s how it works under the hood.
      </p>

      <h2>Architecture overview</h2>
      <p>
        At a high level, the system has three layers: <strong>scheduler</strong>,{" "}
        <strong>check nodes</strong>, and <strong>verifier</strong>. The scheduler assigns checks
        to nodes, nodes execute them and report results, and the verifier resolves failures using
        multi-node consensus.
      </p>
      <p>
        Each layer is horizontally scalable and independently deployable. We use a publish-subscribe
        model for communication, with a message broker that handles millions of check results per
        day.
      </p>

      <h2>Check nodes</h2>
      <p>
        Each check node is a lightweight container running a minimal Rust-based agent. The agent
        maintains a persistent connection to the scheduler, receives check assignments, executes them
        via HTTP, DNS, or TCP probes, and reports results back through the message bus.
      </p>
      <p>
        Nodes are stateless and ephemeral. They can be added or removed without any coordination.
        This makes scaling as simple as spinning up more containers in the region where you need
        additional capacity.
      </p>

      <h2>The scheduler</h2>
      <p>
        The scheduler is the brain of the system. It maintains the desired check schedule for every
        monitor, assigns checks to available nodes using a consistent hashing algorithm, and handles
        node failures gracefully by reassigning orphaned checks within seconds.
      </p>
      <p>
        We use a Raft-based consensus layer to ensure scheduler state is consistent across
        replicas. If the primary scheduler fails, a replica takes over with zero data loss.
      </p>

      <h2>Verification and alerting</h2>
      <p>
        When a check fails, the verifier kicks in. It selects two additional nodes from different
        regions and dispatches verification checks. Only when a majority of nodes confirm the
        failure does an alert fire. This is the core of our zero-false-positive guarantee.
      </p>

      <h2>Data pipeline</h2>
      <p>
        Check results flow through a streaming data pipeline that ingests, normalizes, and stores
        latency and status data. We use a time-series database optimized for high-throughput write
        patterns. Historical data is retained according to each plan&apos;s retention policy.
      </p>
      <p>
        The pipeline also feeds real-time dashboards, incident timelines, and the public status
        pages — all with sub-second latency from ingestion to display.
      </p>

      <h2>Lessons learned</h2>
      <p>
        Building a global monitoring mesh taught us that network reliability is humbling. Even with
        redundant nodes in every region, we&apos;ve seen edge cases where entire cloud regions
        become unreachable. The multi-node verification system wasn&apos;t just a feature — it was a
        necessity for building a system we could trust ourselves.
      </p>
    </PostLayout>
  );
}
