import { PrismaClient } from '@prisma/client';

type GetPapersQuery = {
  sort?: 'latest' | 'stars' | 'trending' | string;
  task?: string;
  method?: string;
  period?: 'today' | 'week' | 'month' | 'all' | string;
  page?: number | string;
  limit?: number | string;
  skip?: number | string;
};

export const ingestPaper = async (prisma: PrismaClient, data: any) => {
  const safeTitle = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const slug = `${safeTitle.substring(0, 50)}-${Math.random().toString(36).substring(2, 10)}`;
  return prisma.paper.create({
    data: {
      slug,
      title: data.title,
      paperUrl: data.paper_url,
      projectUrl: data.github_url,
      citationCount: data.github_stars || 0
    }
  });
};

export const getPapers = async (
  prisma: PrismaClient,
  queryOrLimit: GetPapersQuery | number = {},
  legacySkip: number = 0
): Promise<any> => {
  const query: GetPapersQuery =
    typeof queryOrLimit === 'number'
      ? {
          limit: queryOrLimit,
          skip: legacySkip,
          page: Math.floor(legacySkip / queryOrLimit) + 1,
        }
      : queryOrLimit;

  const limit = Math.max(Number(query.limit) || 20, 1);
  const page = Math.max(Number(query.page) || 1, 1);
  const skip = Number(query.skip) || (page - 1) * limit;
  const sort = query.sort || 'trending';
  const period = query.period || 'all';

  const where: any = {};

  if (query.task) {
    where.tasks = {
      some: {
        task: {
          slug: query.task,
        },
      },
    };
  }

  if (query.method) {
    where.methods = {
      some: {
        method: {
          slug: query.method,
        },
      },
    };
  }

  if (period !== 'all') {
    const publicationDate = new Date();

    if (period === 'today') {
      publicationDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      publicationDate.setDate(publicationDate.getDate() - 7);
    } else if (period === 'month') {
      publicationDate.setDate(publicationDate.getDate() - 30);
    }

    if (period === 'today' || period === 'week' || period === 'month') {
      where.publicationDate = {
        gte: publicationDate,
      };
    }
  }

  const orderBy =
    sort === 'latest'
      ? [{ publicationDate: 'desc' as const }, { githubStars: 'desc' as const }]
      : [{ githubStars: 'desc' as const }, { publicationDate: 'desc' as const }];

  const [papers, total] = await Promise.all([
    prisma.paper.findMany({
      where,
      orderBy,
      take: limit,
      skip,
      select: {
        id: true,
        slug: true,
        title: true,
        abstract: true,
        publicationDate: true,
        arxivId: true,
        paperUrl: true,
        pdfUrl: true,
        githubUrl: true,
        githubStars: true,
        githubForks: true,
        authors: {
          select: {
            author: {
              select: {
                name: true,
              },
            },
          },
        },
        tasks: {
          select: {
            task: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        methods: {
          select: {
            method: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        sotaClaims: {
          select: {
            benchmark: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        rankings: {
          select: {
            rank: true,
            benchmark: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    }),
    prisma.paper.count({ where }),
  ]);

  return {
    papers: papers.map((paper) => ({
      ...paper,
      authors: paper.authors.map(({ author }) => author),
      tasks: paper.tasks.map(({ task }) => task),
      methods: paper.methods.map(({ method }) => method),
    })),
    total,
    page,
    hasMore: skip + papers.length < total,
  };
};

export const getPaperBySlug = async (prisma: PrismaClient, slug: string) => {
  return prisma.paper.findUnique({
    where: { slug },
    include: {
      authors: { include: { author: true } },
      models: { include: { model: true } },
      datasets: { include: { dataset: true } },
      tasks: { include: { task: true } }
    }
  });
};

export const updatePaper = async (prisma: PrismaClient, slug: string, data: any) => {
  return prisma.paper.update({
    where: { slug },
    data
  });
};

export const deletePaper = async (prisma: PrismaClient, slug: string) => {
  return prisma.paper.delete({
    where: { slug }
  });
};
