import { PrismaClient } from './src/generated/prisma/client.js';
import * as methodService from './src/services/method.service.js';

const prisma = new PrismaClient();

async function run() {
  const grouped = await methodService.getGroupedMethods(prisma);
  console.log("Grouped output size:", grouped.length);
  if (grouped.length > 0) {
      console.log("Sample grouped item:", JSON.stringify(grouped[0], null, 2));
  }
  
  const allMethods = await prisma.method.findMany({ take: 1 });
  if (allMethods.length > 0) {
      const slug = allMethods[0].slug;
      const detail = await methodService.getMethodBySlug(prisma, slug);
      console.log("Detail for", slug, ":");
      console.log(JSON.stringify(detail, null, 2).substring(0, 500) + "...");
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
