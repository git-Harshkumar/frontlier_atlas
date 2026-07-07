import { PrismaClient } from '../generated/prisma/client';
import { QueryRouter } from '../routing/index.js';
import { QueryIntent, QueryType } from '../routing/types.js';

export const getModels = async (queryRouter: QueryRouter, limit: number = 50, skip: number = 0) => {
  const intent: QueryIntent = {
    type: QueryType.READ,
    entity: 'model',
    operation: 'findMany',
  };

  const routingResult = await queryRouter.routeQuery(intent, async (prisma) => {
    return prisma.model.findMany({
      take: limit,
      skip: skip,
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true, createdAt: true }
    });
  });

  const allModels: any[] = [];
  const seenIds = new Set<string>();

  for (const result of routingResult.results) {
    for (const model of result) {
      if (!seenIds.has(model.id)) {
        seenIds.add(model.id);
        allModels.push(model);
      }
    }
  }

  allModels.sort((a, b) => a.name.localeCompare(b.name));
  return allModels.slice(0, limit);
};

export const getModelBySlug = async (queryRouter: QueryRouter, slug: string) => {
  const intent: QueryIntent = {
    type: QueryType.READ,
    entity: 'model',
    operation: 'findUnique',
    filters: { slug }
  };

  const routingResult = await queryRouter.routeQuery(intent, async (prisma) => {
    return prisma.model.findUnique({
      where: { slug },
      include: {
        papers: {
          take: 100, // Capped to prevent frontend freeze
          include: { paper: { select: { id: true, title: true, slug: true, citationCount: true, githubStars: true } } },
          orderBy: { paper: { githubStars: 'desc' } }
        }
      }
    });
  });

  let baseModel: any = null;
  const allPapers: any[] = [];

  for (const result of routingResult.results) {
    if (result) {
      if (!baseModel) {
        const { papers, ...rest } = result;
        baseModel = { ...rest };
      }
      allPapers.push(...result.papers);
    }
  }

  if (!baseModel) return null;

  const seenPaperIds = new Set<string>();
  const dedupPapers = [];
  for (const p of allPapers) {
    if (!seenPaperIds.has(p.paper.id)) {
      seenPaperIds.add(p.paper.id);
      dedupPapers.push(p);
    }
  }

  dedupPapers.sort((a, b) => {
     const scoreA = Math.max(a.paper.githubStars || 0, a.paper.citationCount || 0);
     const scoreB = Math.max(b.paper.githubStars || 0, b.paper.citationCount || 0);
     return scoreB - scoreA;
  });

  return {
    ...baseModel,
    papers: dedupPapers.slice(0, 100)
  };
};
