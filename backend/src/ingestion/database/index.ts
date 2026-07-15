import { PrismaClient } from '@prisma/client';
import { NormalizedPaper } from '../types/index';
import slugify from 'slugify';
import { logger } from '../logger/index.js';

export class DatabaseSyncer {
  constructor(private prisma: PrismaClient) {}

  async insertPapers(papers: NormalizedPaper[]): Promise<number> {
    if (papers.length === 0) return 0;

    logger.info(`Starting bulk author resolution for ${papers.length} papers...`);

    // Author resolution removed: The database schema has been simplified.
    // Authors are now stored directly on the Paper table as a text string instead of a separate relation.

    logger.info(`Bulk author resolution completed. Starting insertion loop...`);
    let insertedCount = 0;

    const BATCH_SIZE = 10;
    for (let i = 0; i < papers.length; i += BATCH_SIZE) {
      const batch = papers.slice(i, i + BATCH_SIZE);
      
      await Promise.all(batch.map(async (paper, batchIdx) => {
        const index = i + batchIdx;
        try {
          logger.debug(`[${index + 1}/${papers.length}] Inserting paper: ${paper.arxivId || paper.slug}`);

          await this.prisma.paper.create({
            data: {
              title: paper.title,
              slug: paper.slug,
              abstract: paper.abstract,
              arxivId: paper.arxivId,
              doi: paper.doi,
              publicationDate: paper.publicationDate,
              paperUrl: paper.paperUrl,
              pdfUrl: paper.pdfUrl,
              thumbnailUrl: paper.thumbnailUrl,
              sourceUrl: paper.sourceUrl,
              projectUrl: paper.projectUrl,
              githubUrl: paper.githubUrl,
              authors: Array.from(new Set(paper.authors.filter(a => a && a.trim().length > 0))).join(', '),
            }
          });

          insertedCount++;

        } catch (err: any) {
          logger.error(`Failed to insert paper ${paper.title} (${paper.arxivId || paper.slug})`, err);
        }
      }));
    }

    return insertedCount;
  }
}
