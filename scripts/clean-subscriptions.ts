import { cleanInvalidSubscriptions } from "@/prisma/db/subscriptions";

async function main() {
  try {
    const count = await cleanInvalidSubscriptions();
    console.log(`Cleaned ${count} invalid subscriptions`);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
