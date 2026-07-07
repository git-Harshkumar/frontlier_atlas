import { PrismaClient } from '../generated/prisma/client';
import { QueryRouter } from '../routing/index.js';
import { QueryIntent, QueryType } from '../routing/types.js';

type GetMethodsQuery = {
  sort?: 'name' | 'papers' | string;
  search?: string;
  page?: number | string;
  limit?: number | string;
  skip?: number | string;
};

export const getMethods = async (
  queryRouter: QueryRouter,
  queryOrLimit: GetMethodsQuery | number = {},
  legacySkip: number = 0
) => {
  const query: GetMethodsQuery =
    typeof queryOrLimit === 'number'
      ? { limit: queryOrLimit, skip: legacySkip, page: Math.floor(legacySkip / queryOrLimit) + 1 }
      : queryOrLimit;

  const limit = Math.max(Number(query.limit) || 20, 1);
  const page = Math.max(Number(query.page) || 1, 1);
  const skip = Number(query.skip) || (page - 1) * limit;
  const sort = query.sort || 'name';
  const search = query.search || '';

  const where: any = {};
  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }

  const orderBy =
    sort === 'papers'
      ? { papers: { _count: 'desc' as const } }
      : { name: 'asc' as const };

  const intent: QueryIntent = {
    type: QueryType.READ,
    entity: 'method',
    operation: 'findMany',
    filters: { search, sort }
  };

  const routingResult = await queryRouter.routeQuery(intent, async (prisma) => {
    return Promise.all([
      prisma.method.findMany({
        where,
        orderBy,
        take: limit,
        skip,
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: { papers: true },
          },
        },
      }),
      prisma.method.count({ where }),
    ]);
  });

  const allMethods: any[] = [];
  const seenIds = new Set<string>();
  let total = 0;

  for (const result of routingResult.results) {
    for (const method of result[0]) {
      if (!seenIds.has(method.id)) {
        seenIds.add(method.id);
        allMethods.push(method);
      } else {
        // If the method already exists, add the paper count
        const existing = allMethods.find(m => m.id === method.id);
        if (existing) {
          existing._count.papers += method._count.papers;
        }
      }
    }
    total += result[1]; // Note: Total count won't be perfectly deduplicated without complex merging
  }

  if (sort === 'papers') {
    allMethods.sort((a, b) => b._count.papers - a._count.papers);
  } else {
    allMethods.sort((a, b) => a.name.localeCompare(b.name));
  }

  return {
    methods: allMethods.slice(0, limit).map(({ _count, ...rest }) => ({
      ...rest,
      paperCount: _count.papers,
    })),
    total,
    page,
    hasMore: skip + allMethods.length < total,
  };
};

const ICON_MAP: Record<string, string> = {
  "General": "Settings",
  "Language": "MessageSquare",
  "Vision": "Eye",
  "Audio & Speech": "Mic",
  "Agents": "Bot",
  "Reasoning": "Brain",
  "Training": "Activity",
  "Optimization": "TrendingUp",
  "Inference": "Zap",
  "Retrieval": "Search",
  "Reinforcement Learning": "Target",
  "Diffusion & Generation": "Sparkles",
  "Multimodal": "Layers",
  "Architectures": "Box",
  "Evaluation": "CheckSquare",
  "Embeddings": "Hash"
};

export const getGroupedMethods = async (queryRouter: QueryRouter) => {
  const intent: QueryIntent = {
    type: QueryType.READ,
    entity: 'method',
    operation: 'findMany',
  };

  const routingResult = await queryRouter.routeQuery(intent, async (prisma) => {
    return prisma.method.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        _count: { select: { papers: true } },
      },
      orderBy: { name: 'asc' },
    });
  });

  const allMethods: any[] = [];
  const seenIds = new Set<string>();

  for (const result of routingResult.results) {
    for (const method of result) {
      if (!seenIds.has(method.id)) {
        seenIds.add(method.id);
        allMethods.push({ ...method });
      } else {
        // sum paper counts from different shards
        const existing = allMethods.find(m => m.id === method.id);
        if (existing) {
          existing._count.papers += method._count.papers;
        }
      }
    }
  }

  allMethods.sort((a, b) => a.name.localeCompare(b.name));

  const grouped: Record<string, any[]> = {};
  for (const method of allMethods) {
    const category = method.category || 'Uncategorized';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push({
      id: method.id,
      name: method.name,
      slug: method.slug,
      paperCount: method._count.papers,
    });
  }

  return Object.entries(grouped).map(([category, items]) => ({
    id: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: category,
    iconName: ICON_MAP[category] || "Box",
    methods: items,
  }));
};

export const getMethodBySlug = async (queryRouter: QueryRouter, slug: string) => {
  const intent: QueryIntent = {
    type: QueryType.READ,
    entity: 'method',
    operation: 'findUnique',
    filters: { slug }
  };

  const routingResult = await queryRouter.routeQuery(intent, async (prisma) => {
    return prisma.method.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { papers: true },
        },
        papers: {
          take: 100,
          include: {
            paper: {
              select: {
                id: true,
                title: true,
                slug: true,
                citationCount: true,
                publicationDate: true,
                githubStars: true,
                thumbnailUrl: true,
                arxivId: true,
                isOfficialCode: true,
                pdfUrl: true,
                paperUrl: true,
                githubUrl: true,
                authors: {
                  select: {
                    author: {
                      select: { name: true },
                    },
                  },
                },
                sotaClaims: {
                  select: {
                    benchmark: { select: { name: true, slug: true } }
                  }
                }
              },
            },
          },
          orderBy: { paper: { githubStars: 'desc' } }
        },
      },
    });
  });

  let baseMethod: any = null;
  const allPapers: any[] = [];
  let totalPaperCount = 0;

  for (const result of routingResult.results) {
    if (result) {
      if (!baseMethod) {
        const { _count, papers, ...rest } = result;
        baseMethod = { ...rest };
      }
      totalPaperCount += result._count.papers;
      allPapers.push(...result.papers);
    }
  }

  if (!baseMethod) return null;

  // Deduplicate papers across shards
  const seenPaperIds = new Set<string>();
  const dedupPapers = [];
  for (const p of allPapers) {
    if (!seenPaperIds.has(p.paper.id)) {
      seenPaperIds.add(p.paper.id);
      dedupPapers.push(p);
    }
  }

  // Sort by githubStars and take 100
  dedupPapers.sort((a, b) => (b.paper.githubStars || 0) - (a.paper.githubStars || 0));
  const topPapers = dedupPapers.slice(0, 100);

  return {
    ...baseMethod,
    paperCount: totalPaperCount,
    papers: topPapers.map(({ paper }) => ({
      ...paper,
      authors: paper.authors.map((a: any) => a.author),
      sotaClaims: paper.sotaClaims?.map((c: any) => c.benchmark) || [],
    })),
  };
};

export const createMethod = async (queryRouter: QueryRouter, data: { name: string }) => {
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100);

  const intent: QueryIntent = {
    type: QueryType.WRITE,
    entity: 'method',
    operation: 'create',
  };

  const routingResult = await queryRouter.routeQuery(intent, async (prisma) => {
    return prisma.method.create({
      data: {
        name: data.name,
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: { papers: true },
        },
      },
    });
  });

  const { _count, ...rest } = routingResult.results[0];
  return { ...rest, paperCount: _count.papers };
};

export const updateMethod = async (queryRouter: QueryRouter, slug: string, data: { name?: string }) => {
  const updateData: any = {};

  if (data.name) {
    updateData.name = data.name;
    updateData.slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 100);
  }

  const intent: QueryIntent = {
    type: QueryType.UPDATE,
    entity: 'method',
    operation: 'update',
    filters: { slug }
  };

  const routingResult = await queryRouter.routeQuery(intent, async (prisma) => {
    return prisma.method.update({
      where: { slug },
      data: updateData,
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: { papers: true },
        },
      },
    });
  });

  const { _count, ...rest } = routingResult.results[0];
  return { ...rest, paperCount: _count.papers };
};

export const deleteMethod = async (queryRouter: QueryRouter, slug: string) => {
  const intent: QueryIntent = {
    type: QueryType.DELETE,
    entity: 'method',
    operation: 'delete',
    filters: { slug }
  };

  const routingResult = await queryRouter.routeQuery(intent, async (prisma) => {
    return prisma.method.delete({
      where: { slug },
    });
  });

  return routingResult.results[0];
};
