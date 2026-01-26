import { getPrisma } from "./src/index";

async function main() {
  const url =
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_6hvWIxFBtgA3@ep-little-dawn-ag0aibtt-pooler.c-2.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";
  const prisma = getPrisma(url);

  // Create a placeholder user if not exists
  let user = await prisma.user.findFirst({
    where: { email: "demo@pulseguard.io" },
  });

  if (!user) {
    console.log("Creating demo user...");
    user = await prisma.user.create({
      data: {
        id: "demo-user",
        name: "Demo User",
        email: "demo@pulseguard.io",
        emailVerified: true,
      },
    });
  }

  console.log(`Using user: ${user.id}`);

  // Helpers
  const monitors = [
    { name: "Google", url: "https://google.com", interval: 60 },
    { name: "Cloudflare", url: "https://cloudflare.com", interval: 60 },
    { name: "Example", url: "https://example.com", interval: 120 },
    // A guaranteed failing URL
    { name: "Broken Site", url: "https://this-site-does-not-exist.pulseguard.io", interval: 60 },
  ];

  for (const m of monitors) {
    const exists = await prisma.monitor.findFirst({
      where: { userId: user.id, url: m.url },
    });

    if (!exists) {
      console.log(`Creating monitor: ${m.name}`);
      await prisma.monitor.create({
        data: {
          name: m.name,
          url: m.url,
          interval: m.interval,
          userId: user.id,
          type: "HTTP",
          status: "UP",
          // Set nextCheck to NOW so the worker picks it up immediately
          nextCheck: new Date(),
        },
      });
    } else {
      console.log(`Monitor exists: ${m.name}, resetting nextCheck...`);
      await prisma.monitor.update({
        where: { id: exists.id },
        data: { nextCheck: new Date() },
      });
    }
  }

  console.log("✅ Seed complete! Monitors are queued for checking.");
}

main().catch(console.error);
