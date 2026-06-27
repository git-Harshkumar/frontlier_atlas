import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { config } from 'dotenv';
import fs from 'fs';
import csv from 'csv-parser';

config();

const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  ),
});

async function importPapers() {
  const papers: any[] = [];

  console.log('Loading papers.csv...');

  fs.createReadStream('./papers.csv')
    .pipe(csv())
    .on('data', (row) => papers.push(row))
    .on('end', async () => {
      console.log(`Importing ${papers.length} papers...\n`);

      for (const paper of papers) {
        const slug = paper.title
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        try {
          await prisma.paper.create({
            data: {
              title: paper.title,
              slug,
              arxivId: paper.arxiv_id || null,
            },
          });

          console.log(`✔ ${paper.title}`);
        } catch (err: any) {
          console.log(`✖ ${paper.title}`);
          console.error(err.message);
        }
      }

      await prisma.$disconnect();
      console.log('\nSeeding completed.');
    });
}

importPapers().catch(async (err) => {
  console.error('Unexpected Error:', err);
  await prisma.$disconnect();
  process.exit(1);
});