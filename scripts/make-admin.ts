import prisma from "../packages/db/src/index";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: bun scripts/make-admin.ts <user-email>");
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email "${email}" not found in database.`);
      process.exit(1);
    }

    const updated = await prisma.user.update({
      where: { email },
      data: { tier: "ADMIN" },
    });

    console.log(
      `Successfully granted ADMIN tier to ${updated.email} (${updated.id})!`,
    );
    process.exit(0);
  } catch (error) {
    console.error("Error making user admin:", error);
    process.exit(1);
  }
}

main();
