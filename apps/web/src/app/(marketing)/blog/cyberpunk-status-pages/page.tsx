import type { Metadata } from "next";
import PostLayout from "@/components/blog/post-layout";

export const metadata: Metadata = {
  title: "Introducing cyberpunk status pages | PulseGuard Blog",
  description:
    "Your status page is often the first thing your users see when something goes wrong. We designed ours to be beautiful, informative, and on-brand.",
};

export default function Post() {
  return (
    <PostLayout
      title="Introducing cyberpunk status pages: monitoring that actually looks good"
      date="July 8, 2026"
      readTime="4 min read"
      category="Product"
    >
      <p>
        Status pages have historically been an afterthought. A white box with green and red dots.
        Maybe a timeline if you&apos;re lucky. Functional, sure — but they feel like something from
        2010.
      </p>
      <p>
        We think your status page deserves better. It&apos;s often the first place your users go
        when something goes wrong. It should be clear, calming, and — dare we say — enjoyable to
        look at.
      </p>

      <h2>Five themes, one page</h2>
      <p>
        Every PulseGuard status page comes with five visual themes: <strong>Dark</strong>,{" "}
        <strong>Light</strong>, <strong>Matrix</strong>, <strong>Cyberpunk</strong>, and{" "}
        <strong>Blade</strong>. Each theme transforms the look and feel of your status page while
        keeping the same information architecture.
      </p>
      <p>
        Users can toggle between themes with a single click. No page reload. No configuration
        changes. It&apos;s a small touch that makes a big difference in how your status page is
        perceived.
      </p>

      <h2>Designed for incidents</h2>
      <p>
        When an incident happens, clarity is king. Our status pages surface the most important
        information first:
      </p>
      <ul>
        <li>Current overall status with a clear, color-coded indicator</li>
        <li>Active incidents listed with severity and start time</li>
        <li>Real-time latency charts for each monitored endpoint</li>
        <li>Incident timeline showing updates as they happen</li>
      </ul>
      <p>
        We&apos;ve optimized for the worst-case scenario — during an outage, your users need
        answers fast. Every design decision was made with that in mind.
      </p>

      <h2>Custom domains and branding</h2>
      <p>
        Your status page lives at <code>status.yourdomain.com</code>, not on a subdomain you don&apos;t control.
        Bring your own logo, colors, and favicon. It should feel like a natural part of your
        product — because it is.
      </p>

      <h2>The Showcase</h2>
      <p>
        We&apos;ve launched a <a href="/showcase">Showcase</a> featuring real PulseGuard status
        pages. Browse them for inspiration, then build your own in minutes. No design skills
        required.
      </p>
    </PostLayout>
  );
}
