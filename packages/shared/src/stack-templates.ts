export type StackMonitorPreset = {
  name: string;
  type: "HTTP" | "PING" | "PORT" | "SSL" | "DNS" | "HEARTBEAT";
  url: string;
  port?: number;
  description?: string;
  method?: string;
  headers?: { key: string; value: string }[];
  body?: string;
  expectation?: string;
  interval?: number;
  timeout?: number;
};

export type StackTemplate = {
  id: string;
  name: string;
  description: string;
  tagline: string;
  icon: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  monitors: StackMonitorPreset[];
  techStack: string[];
};

export const stackTemplates: StackTemplate[] = [
  {
    id: "nextjs",
    name: "The Perfect Next.js Setup",
    description:
      "Complete monitoring for a Next.js application — frontend pages, API routes, SSL certificate, and revalidation checks.",
    tagline: "1-click peace of mind for your Next.js app",
    icon: "Globe",
    difficulty: "beginner",
    techStack: ["Next.js", "React", "Vercel", "Node.js"],
    monitors: [
      {
        name: "Next.js Production (Homepage)",
        type: "HTTP",
        url: "https://example.com",
        method: "GET",
        expectation: JSON.stringify({ body_contains: "</div>" }),
        interval: 60,
        timeout: 10,
      },
      {
        name: "Next.js API Health",
        type: "HTTP",
        url: "https://example.com/api/health",
        method: "GET",
        expectation: JSON.stringify({ json_assertions: [{ path: "status", operator: "==", value: "ok" }] }),
        interval: 60,
        timeout: 10,
      },
      {
        name: "Next.js SSL Certificate",
        type: "SSL",
        url: "https://example.com",
        interval: 3600,
        timeout: 10,
      },
    ],
  },
  {
    id: "supabase",
    name: "The Supabase Stack",
    description:
      "Monitor your Supabase project — dashboard availability, database connectivity, authentication endpoint, and edge functions.",
    tagline: "Full visibility into your Supabase ecosystem",
    icon: "Database",
    difficulty: "beginner",
    techStack: ["Supabase", "PostgreSQL", "Auth", "Edge Functions"],
    monitors: [
      {
        name: "Supabase Project Dashboard",
        type: "HTTP",
        url: "https://project-ref.supabase.co",
        method: "GET",
        interval: 300,
        timeout: 15,
      },
      {
        name: "Supabase Auth Endpoint",
        type: "HTTP",
        url: "https://project-ref.supabase.co/auth/v1/health",
        method: "GET",
        interval: 300,
        timeout: 10,
      },
      {
        name: "Supabase Database Port",
        type: "PORT",
        url: "db.project-ref.supabase.co",
        port: 5432,
        interval: 300,
        timeout: 10,
      },
      {
        name: "Supabase Edge Functions",
        type: "HTTP",
        url: "https://project-ref.functions.supabase.co/health",
        method: "GET",
        interval: 300,
        timeout: 15,
      },
    ],
  },
  {
    id: "ecommerce",
    name: "The E-Commerce Stack",
    description:
      "Comprehensive monitoring for an online store — product pages, checkout flow, API, search, and payment gateway availability.",
    tagline: "Never lose a sale to downtime",
    icon: "ShoppingCart",
    difficulty: "intermediate",
    techStack: ["Shopify", "Stripe", "Next.js", "Search"],
    monitors: [
      {
        name: "Homepage & Landing",
        type: "HTTP",
        url: "https://store.example.com",
        method: "GET",
        expectation: JSON.stringify({ body_contains: "Add to Cart" }),
        interval: 60,
        timeout: 10,
      },
      {
        name: "Product Pages",
        type: "HTTP",
        url: "https://store.example.com/products/sample",
        method: "GET",
        expectation: JSON.stringify({ body_contains: "price" }),
        interval: 120,
        timeout: 10,
      },
      {
        name: "Checkout API",
        type: "HTTP",
        url: "https://api.store.example.com/checkout/health",
        method: "GET",
        expectation: JSON.stringify({ json_assertions: [{ path: "status", operator: "==", value: "healthy" }] }),
        interval: 60,
        timeout: 15,
      },
      {
        name: "Search Endpoint",
        type: "HTTP",
        url: "https://api.store.example.com/search/health",
        method: "GET",
        interval: 120,
        timeout: 10,
      },
      {
        name: "Store SSL Certificate",
        type: "SSL",
        url: "https://store.example.com",
        interval: 3600,
        timeout: 10,
      },
    ],
  },
  {
    id: "api-stack",
    name: "The API Stack",
    description:
      "Full coverage for a REST or GraphQL API — endpoint availability, response validation, latency tracking, and port monitoring.",
    tagline: "Your API deserves enterprise-grade watching",
    icon: "Code",
    difficulty: "beginner",
    techStack: ["REST", "GraphQL", "Node.js", "Express", "Fastify"],
    monitors: [
      {
        name: "API Root Health",
        type: "HTTP",
        url: "https://api.example.com/health",
        method: "GET",
        expectation: JSON.stringify({ json_assertions: [{ path: "status", operator: "==", value: "ok" }] }),
        interval: 60,
        timeout: 10,
      },
      {
        name: "API Authentication Endpoint",
        type: "HTTP",
        url: "https://api.example.com/auth/login",
        method: "POST",
        body: JSON.stringify({ test: true }),
        headers: [{ key: "Content-Type", value: "application/json" }],
        expectation: JSON.stringify({ body_contains: "token" }),
        interval: 300,
        timeout: 15,
      },
      {
        name: "GraphQL Endpoint",
        type: "HTTP",
        url: "https://api.example.com/graphql",
        method: "POST",
        body: JSON.stringify({ query: "{ __typename }" }),
        headers: [{ key: "Content-Type", value: "application/json" }],
        expectation: JSON.stringify({ body_contains: "__typename" }),
        interval: 120,
        timeout: 15,
      },
      {
        name: "API SSL Certificate",
        type: "SSL",
        url: "https://api.example.com",
        interval: 3600,
        timeout: 10,
      },
    ],
  },
  {
    id: "docker-host",
    name: "The Docker Host",
    description:
      "Monitor your Docker infrastructure — host reachability, container port availability, registry access, and resource health.",
    tagline: "Keep your containers containerized and online",
    icon: "Container",
    difficulty: "advanced",
    techStack: ["Docker", "Linux", "Portainer", "Nginx"],
    monitors: [
      {
        name: "Host Reachability (Ping)",
        type: "PING",
        url: "192.168.1.100",
        interval: 60,
        timeout: 10,
      },
      {
        name: "SSH Port",
        type: "PORT",
        url: "192.168.1.100",
        port: 22,
        interval: 300,
        timeout: 10,
      },
      {
        name: "Docker Registry",
        type: "HTTP",
        url: "https://registry.example.com/v2/_catalog",
        method: "GET",
        interval: 300,
        timeout: 15,
      },
      {
        name: "Portainer Dashboard",
        type: "HTTP",
        url: "https://portainer.example.com",
        method: "GET",
        interval: 120,
        timeout: 10,
      },
    ],
  },
  {
    id: "jamstack",
    name: "Static Site (JAMStack)",
    description:
      "Essential monitoring for a static site — page availability, SSL health, DNS propagation, and CDN edge cache checks.",
    tagline: "Your static site, statically reliable",
    icon: "FileText",
    difficulty: "beginner",
    techStack: ["Next.js SSG", "Gatsby", "Vercel", "Netlify", "Cloudflare"],
    monitors: [
      {
        name: "Homepage Availability",
        type: "HTTP",
        url: "https://yoursite.com",
        method: "GET",
        expectation: JSON.stringify({ body_contains: "<html" }),
        interval: 300,
        timeout: 10,
      },
      {
        name: "SSL Certificate",
        type: "SSL",
        url: "https://yoursite.com",
        interval: 3600,
        timeout: 10,
      },
      {
        name: "DNS Propagation",
        type: "DNS",
        url: "yoursite.com",
        expectation: JSON.stringify({ expectedIPs: [] }),
        interval: 3600,
        timeout: 10,
      },
    ],
  },
  {
    id: "saas-dashboard",
    name: "The SaaS Dashboard",
    description:
      "End-to-end monitoring for a SaaS application — login sequence, key dashboard pages, billing API, and critical user flows.",
    tagline: "Your SaaS, always operational",
    icon: "LayoutDashboard",
    difficulty: "advanced",
    techStack: ["React", "Node.js", "Stripe", "Auth0", "PostgreSQL"],
    monitors: [
      {
        name: "Login Page",
        type: "HTTP",
        url: "https://app.example.com/login",
        method: "GET",
        expectation: JSON.stringify({ body_contains: "password" }),
        interval: 120,
        timeout: 10,
      },
      {
        name: "Billing API Health",
        type: "HTTP",
        url: "https://api.example.com/billing/health",
        method: "GET",
        expectation: JSON.stringify({ json_assertions: [{ path: "status", operator: "==", value: "up" }] }),
        interval: 60,
        timeout: 10,
      },
      {
        name: "Database Connectivity",
        type: "PORT",
        url: "db.example.com",
        port: 5432,
        interval: 300,
        timeout: 10,
      },
      {
        name: "SSL Certificate",
        type: "SSL",
        url: "https://app.example.com",
        interval: 3600,
        timeout: 10,
      },
    ],
  },
  {
    id: "fullstack-node",
    name: "The Full-Stack Node App",
    description:
      "Complete monitoring for a Node.js application — frontend health, API endpoints, WebSocket stream, database port, and background job heartbeat.",
    tagline: "Node.js monitoring, zero config",
    icon: "Server",
    difficulty: "intermediate",
    techStack: ["Node.js", "Express", "Socket.io", "MongoDB", "Redis"],
    monitors: [
      {
        name: "Frontend Availability",
        type: "HTTP",
        url: "https://app.example.com",
        method: "GET",
        interval: 60,
        timeout: 10,
      },
      {
        name: "API Health",
        type: "HTTP",
        url: "https://api.example.com/health",
        method: "GET",
        expectation: JSON.stringify({ json_assertions: [{ path: "uptime", operator: "==", value: "ok" }] }),
        interval: 60,
        timeout: 10,
      },
      {
        name: "MongoDB Port",
        type: "PORT",
        url: "mongo.example.com",
        port: 27017,
        interval: 300,
        timeout: 10,
      },
      {
        name: "Redis Port",
        type: "PORT",
        url: "redis.example.com",
        port: 6379,
        interval: 300,
        timeout: 10,
      },
      {
        name: "Background Job Heartbeat",
        type: "HEARTBEAT",
        url: "heartbeat://placeholder",
        interval: 300,
        timeout: 10,
      },
    ],
  },
];

export function getTemplateById(id: string): StackTemplate | undefined {
  return stackTemplates.find((t) => t.id === id);
}

export function getTemplatesByDifficulty(
  difficulty: StackTemplate["difficulty"],
): StackTemplate[] {
  return stackTemplates.filter((t) => t.difficulty === difficulty);
}
