import { NormalizedPaper } from '../types/index';
import { DatabaseSyncer } from '../database/index';
import { PrismaClient } from '@prisma/client';
import { logger } from '../logger/index';

export async function syncPapers(papers: NormalizedPaper[], prisma: PrismaClient): Promise<number> {
  logger.info(`Starting sync phase for ${papers.length} papers`);
  
  const syncer = new DatabaseSyncer(prisma);
  const insertedCount = await syncer.insertPapers(papers);
  
  logger.info(`Sync phase completed. Successfully inserted ${insertedCount} papers`);
  
  return insertedCount;
}
