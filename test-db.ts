
import { getPrisma } from "./packages/db/src/index.js";
import { config } from "dotenv";
config();

async function test() {
  console.log("Existing env:", process.env.DATABASE_URL);
  
  try {
    const prisma = getPrisma(process.env.DATABASE_URL);
    console.log("Prisma client created");
    
    await prisma.$connect();
    console.log("Connected to database");
    
    const count = await prisma.user.count();
    console.log("User count:", count);
    
    await prisma.$disconnect();
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
