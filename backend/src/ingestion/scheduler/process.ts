import { NormalizedPaper } from '../types/index';
import { PaperMerger } from '../merger/index';
import { Deduplicator } from '../deduplication/index';
import { PrismaClient } from '@prisma/client';
import { logger } from '../logger/index';

export async function processPapers(papers: NormalizedPaper[], prisma: PrismaClient): Promise<NormalizedPaper[]> {
  logger.info(`Starting process phase with ${papers.length} papers`);

  const merger = new PaperMerger();
  const mergedPapers = merger.merge(papers);
  logger.info(`Merged down to ${mergedPapers.length} unique papers across sources`);

  const deduplicator = new Deduplicator(prisma);
  const newPapers = await deduplicator.filterNewPapers(mergedPapers);
  
  logger.info(`Process phase completed. ${newPapers.length} new papers ready for insertion`);
  
  return newPapers;
}
