import { PrismaClient } from '@prisma/client';
import { NormalizedPaper } from '../types/index';
import slugify from 'slugify';
import { logger } from '../logger/index.js';

export class DatabaseSyncer {
  constructor(private prisma: PrismaClient) {}

  async insertPapers(papers: NormalizedPaper[]): Promise<number> {
    if (papers.length === 0) return 0;

    logger.info(`Starting bulk author resolution for ${papers.length} papers...`);

    // 1. Extract unique authors
    const authorMap = new Map<string, { name: string, slug: string, id?: string }>();
    for (const paper of papers) {
      const validAuthors = paper.authors.filter(a => a && a.trim().length > 0);
      for (const authorName of validAuthors) {
        if (!authorMap.has(authorName)) {
          const authorSlug = slugify.default(authorName, { lower: true, strict: true }).slice(0, 100) || `author-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          authorMap.set(authorName, { name: authorName, slug: authorSlug });
        }
      }
    }

    const uniqueSlugs = Array.from(new Set(Array.from(authorMap.values()).map(a => a.slug)));
    logger.info(`Found ${authorMap.size} unique author names mapping to ${uniqueSlugs.length} slugs across ${papers.length} papers.`);

    if (uniqueSlugs.length > 0) {
      // 2. Bulk fetch existing authors
      const existingAuthors = await this.prisma.author.findMany({
        where: { slug: { in: uniqueSlugs } },
        select: { id: true, slug: true }
      });

      const existingSlugToId = new Map(existingAuthors.map(a => [a.slug, a.id]));
      
      for (const [name, data] of authorMap.entries()) {
        if (existingSlugToId.has(data.slug)) {
          data.id = existingSlugToId.get(data.slug);
        }
      }

      // 3. Bulk insert missing authors
      const existingSlugs = new Set(existingAuthors.map(a => a.slug));
      // filter to unique missing authors by slug to avoid duplicate creates
      const missingAuthorsMap = new Map<string, {name: string, slug: string}>();
      for (const data of authorMap.values()) {
         if (!existingSlugs.has(data.slug)) {
            missingAuthorsMap.set(data.slug, data);
         }
      }
      const missingAuthors = Array.from(missingAuthorsMap.values());
      
      if (missingAuthors.length > 0) {
        logger.info(`Creating ${missingAuthors.length} new authors...`);
        await this.prisma.author.createMany({
          data: missingAuthors.map(a => ({ name: a.name, slug: a.slug })),
          skipDuplicates: true
        });

        // 4. Fetch newly created author IDs
        const missingSlugs = missingAuthors.map(a => a.slug);
        const newlyCreatedAuthors = await this.prisma.author.findMany({
          where: { slug: { in: missingSlugs } },
          select: { id: true, slug: true }
        });

        const newSlugToId = new Map(newlyCreatedAuthors.map(a => [a.slug, a.id]));
        for (const [name, data] of authorMap.entries()) {
          if (newSlugToId.has(data.slug)) {
             data.id = newSlugToId.get(data.slug);
          }
        }
      }
    }

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
              sourceUrl: paper.sourceUrl,
              projectUrl: paper.projectUrl,
              githubUrl: paper.githubUrl,
              authors: {
                create: Array.from(new Set(paper.authors.filter(a => a && a.trim().length > 0)))
                  .map(authorName => {
                    const authorId = authorMap.get(authorName)?.id;
                    if (!authorId) {
                      throw new Error(`Author ID not found for name: ${authorName}`);
                    }
                    return {
                      author: {
                        connect: { id: authorId }
                      }
                    };
                  })
              }
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
