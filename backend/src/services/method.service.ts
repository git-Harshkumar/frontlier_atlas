import { PrismaClient } from '../generated/prisma/client';

type GetMethodsQuery = {
  sort?: 'name' | 'papers' | string;
  search?: string;
  page?: number | string;
  limit?: number | string;
  skip?: number | string;
};

export const getMethods = async (
  prisma: PrismaClient,
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

  const [methods, total] = await Promise.all([
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

  return {
    methods: methods.map(({ _count, ...rest }) => ({
      ...rest,
      paperCount: _count.papers,
    })),
    total,
    page,
    hasMore: skip + methods.length < total,
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

export const getGroupedMethods = async (prisma: PrismaClient) => {
  const methods = await prisma.method.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      _count: { select: { papers: true } },
    },
    orderBy: { name: 'asc' },
  });

  const grouped: Record<string, any[]> = {};
  for (const method of methods) {
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

export const getMethodBySlug = async (prisma: PrismaClient, slug: string) => {
  const method = await prisma.method.findUnique({
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

  if (!method) return null;

  const { _count, papers, ...rest } = method;
  return {
    ...rest,
    paperCount: _count.papers,
    papers: papers.map(({ paper }) => ({
      ...paper,
      authors: paper.authors.map(({ author }) => author),
      sotaClaims: paper.sotaClaims?.map(c => c.benchmark) || [],
    })),
  };
};

export const createMethod = async (prisma: PrismaClient, data: { name: string }) => {
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100);

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
  }).then(({ _count, ...rest }) => ({
    ...rest,
    paperCount: _count.papers,
  }));
};

export const updateMethod = async (prisma: PrismaClient, slug: string, data: { name?: string }) => {
  const updateData: any = {};

  if (data.name) {
    updateData.name = data.name;
    updateData.slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 100);
  }

  const method = await prisma.method.update({
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

  const { _count, ...rest } = method;
  return { ...rest, paperCount: _count.papers };
};

export const deleteMethod = async (prisma: PrismaClient, slug: string) => {
  return prisma.method.delete({
    where: { slug },
  });
};
