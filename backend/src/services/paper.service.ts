import { PrismaClient, Prisma } from "../generated/prisma/client";
import { QueryRouter } from "../routing/index.js";
import { QueryIntent, QueryType } from "../routing/types.js";
import { CursorManager } from "../pagination/CursorManager.js";
import { SortingEngine } from "../pagination/SortingEngine.js";

type GetPapersQuery = {
  sort?:
    | "latest"
    | "stars"
    | "citations"
    | "alphabetical"
    | "ranking"
    | "trending"
    | string;
  task?: string;
  method?: string;
  model?: string;
  period?: "today" | "week" | "month" | "all" | string;
  page?: number | string;
  limit?: number | string;
  skip?: number | string;
  cursor?: string;
};

const exposeThumbnailUrl = <T extends { thumbnailUrl?: string | null }>(
  paper: T,
) => {
  const { thumbnailUrl, ...rest } = paper;
  return {
    ...rest,
    thumbnailUrl: thumbnailUrl ?? null,
    thumbnail_url: thumbnailUrl ?? null,
  };
};

export const ingestPaper = async (queryRouter: QueryRouter, data: any) => {
  const safeTitle = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const slug = `${safeTitle.substring(0, 50)}-${Math.random().toString(36).substring(2, 10)}`;

  const intent: QueryIntent = {
    type: QueryType.WRITE,
    entity: "paper",
    operation: "create",
    data: { ...data, slug },
  };

  const routingResult = await queryRouter.routeQuery(
    intent,
    async (prisma, _shardId) => {
      return prisma.paper.create({
        data: {
          slug,
          title: data.title,
          paperUrl: data.paper_url,
          thumbnailUrl: data.thumbnail_url,
          projectUrl: data.github_url,
          citationCount: data.github_stars || 0,
        },
      });
    },
  );

  return routingResult.results[0];
};

// Define the specific select object
const paperSelect = {
  id: true,
  slug: true,
  title: true,
  abstract: true,
  thumbnailUrl: true,
  publicationDate: true,
  createdAt: true,
  updatedAt: true,
  arxivId: true,
  paperUrl: true,
  pdfUrl: true,
  githubUrl: true,
  githubStars: true,
  githubForks: true,
  citationCount: true,
  language: true,
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
} satisfies Prisma.PaperSelect;

// Infer the type from the select object
type PaperFindManyResult = Prisma.PaperGetPayload<{
  select: typeof paperSelect;
}>[];
type PaperQueryResult = PaperFindManyResult;
type PaperQueryItem = PaperFindManyResult[number];

const getPaperIdentity = (paper: PaperQueryItem): string =>
  paper.arxivId || paper.slug;

const getConflictTimestamp = (paper: PaperQueryItem): number => {
  const timestamp = paper.updatedAt ?? paper.publicationDate ?? paper.createdAt;
  if (!timestamp) return 0;

  const time =
    timestamp instanceof Date
      ? timestamp.getTime()
      : new Date(timestamp).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const getCompletenessScore = (paper: PaperQueryItem): number => {
  const fields: unknown[] = [
    paper.abstract,
    paper.thumbnailUrl,
    paper.paperUrl,
    paper.pdfUrl,
    paper.githubUrl,
    paper.language,
    paper.authors.length,
    paper.tasks.length,
    paper.methods.length,
    paper.sotaClaims.length,
    paper.rankings.length,
  ];

  return fields.reduce<number>((score, value) => score + (value ? 1 : 0), 0);
};

const resolvePaperConflict = (
  current: PaperQueryItem,
  incoming: PaperQueryItem,
): PaperQueryItem => {
  const currentTimestamp = getConflictTimestamp(current);
  const incomingTimestamp = getConflictTimestamp(incoming);

  if (incomingTimestamp > currentTimestamp) return incoming;
  if (incomingTimestamp < currentTimestamp) return current;

  const currentScore = getCompletenessScore(current);
  const incomingScore = getCompletenessScore(incoming);

  if (incomingScore > currentScore) return incoming;
  if (incomingScore < currentScore) return current;

  return incoming.id.localeCompare(current.id) < 0 ? incoming : current;
};

const deduplicatePapers = (papers: PaperQueryItem[]): PaperFindManyResult => {
  const deduplicated = new Map<string, PaperQueryItem>();

  for (const paper of papers) {
    const key = getPaperIdentity(paper);
    const existing = deduplicated.get(key);
    deduplicated.set(
      key,
      existing ? resolvePaperConflict(existing, paper) : paper,
    );
  }

  return Array.from(deduplicated.values());
};

export const getPapers = async (
  queryRouter: QueryRouter,
  queryOrLimit: GetPapersQuery | number = {},
  legacySkip: number = 0,
): Promise<any> => {
  const query: GetPapersQuery =
    typeof queryOrLimit === "number"
      ? {
          limit: queryOrLimit,
          skip: legacySkip,
          page: Math.floor(legacySkip / queryOrLimit) + 1,
        }
      : queryOrLimit;

  const limit = Math.max(Number(query.limit) || 20, 1);
  const page = Math.max(Number(query.page) || 1, 1);
  const skip = Number(query.skip) || (page - 1) * limit;
  const perShardTake = Math.max(skip + limit + 1, limit + 1);
  const sort = SortingEngine.normalizeSort(query.sort || "trending");
  const period = query.period || "all";

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

  if (query.model) {
    where.models = {
      some: {
        model: {
          slug: query.model,
        },
      },
    };
  }

  if (period !== "all") {
    const publicationDate = new Date();

    if (period === "today") {
      publicationDate.setHours(0, 0, 0, 0);
    } else if (period === "week") {
      publicationDate.setDate(publicationDate.getDate() - 7);
    } else if (period === "month") {
      publicationDate.setDate(publicationDate.getDate() - 30);
    }

    if (period === "today" || period === "week" || period === "month") {
      where.publicationDate = {
        gte: publicationDate,
      };
    }
  }

  const orderBy =
    sort === "latest"
      ? [
          { publicationDate: "desc" as const },
          { githubStars: "desc" as const },
          { slug: "asc" as const },
        ]
      : sort === "citations"
        ? [
            { citationCount: "desc" as const },
            { githubStars: "desc" as const },
            { publicationDate: "desc" as const },
            { slug: "asc" as const },
          ]
        : sort === "alphabetical"
          ? [{ title: "asc" as const }, { slug: "asc" as const }]
          : [
              { githubStars: "desc" as const },
              { citationCount: "desc" as const },
              { publicationDate: "desc" as const },
              { slug: "asc" as const },
            ];

  const intent: QueryIntent = {
    type: QueryType.READ,
    entity: "paper",
    operation: "findMany",
    filters: {
      sort,
      task: query.task,
      method: query.method,
      model: query.model,
      period,
    },
  };

  const routingResult = await queryRouter.routeQuery<PaperQueryResult>(
    intent,
    async (prisma, _shardId) => {
      return prisma.paper.findMany({
        where,
        orderBy,
        take: perShardTake,
        select: paperSelect,
      });
    },
  );

  const mergedPapers = SortingEngine.nWayMerge<PaperQueryItem>(
    routingResult.results,
    sort,
  );
  const deduplicatedPapers = deduplicatePapers(mergedPapers);
  const globallySortedPapers = SortingEngine.sort<PaperQueryItem>(
    deduplicatedPapers,
    sort,
  );
  const total = globallySortedPapers.length;

  const decodedCursor = query.cursor
    ? CursorManager.decodeCursor(query.cursor)
    : null;
  if (decodedCursor) {
    CursorManager.validateCursorSort(decodedCursor, sort);
  }

  const cursorIndex = decodedCursor
    ? SortingEngine.findCursorIndex(globallySortedPapers, decodedCursor)
    : -1;
  if (decodedCursor && cursorIndex === -1) {
    throw new Error("Invalid cursor: cursor position was not found");
  }

  const startIndex = decodedCursor ? cursorIndex + 1 : skip;
  const safeStartIndex = Math.max(startIndex, 0);
  const pagePapers = globallySortedPapers.slice(
    safeStartIndex,
    safeStartIndex + limit,
  );
  const hasMore = safeStartIndex + pagePapers.length < total;
  const lastPaper = pagePapers[pagePapers.length - 1];
  const nextCursor =
    hasMore && lastPaper
      ? CursorManager.encodeCursor(
          SortingEngine.getCursorPayload(lastPaper, sort),
        )
      : null;

  return {
    papers: pagePapers.map((paper) => ({
      ...exposeThumbnailUrl(paper),
      authors: paper.authors.map(({ author }) => author),
      tasks: paper.tasks.map(({ task }) => task),
      methods: paper.methods.map(({ method }) => method),
    })),
    total,
    page,
    hasMore,
    nextCursor,
  };
};

export const getPaperBySlug = async (
  queryRouter: QueryRouter,
  slug: string,
) => {
  const intent: QueryIntent = {
    type: QueryType.READ,
    entity: "paper",
    operation: "findUnique",
    filters: { slug },
  };

  const routingResult = await queryRouter.routeQuery(
    intent,
    async (prisma, _shardId) => {
      return prisma.paper.findUnique({
        where: { slug },
        include: {
          authors: { include: { author: true } },
          models: { include: { model: true } },
          datasets: { include: { dataset: true } },
          tasks: { include: { task: true } },
          methods: { include: { method: true } },
          conferences: { include: { conference: true } },
          rankings: {
            include: {
              benchmark: true,
            },
          },
          sotaClaims: {
            include: {
              benchmark: true,
            },
          },
        },
      });
    },
  );

  // Find the first non-null result
  const paper = routingResult.results.find((p) => p !== null);
  return paper ? exposeThumbnailUrl(paper) : null;
};

export const updatePaper = async (
  queryRouter: QueryRouter,
  slug: string,
  data: any,
) => {
  const intent: QueryIntent = {
    type: QueryType.UPDATE,
    entity: "paper",
    operation: "update",
    filters: { slug },
    data,
  };

  const routingResult = await queryRouter.routeQuery(
    intent,
    async (prisma, _shardId) => {
      const { thumbnail_url, ...rest } = data;
      return prisma.paper.update({
        where: { slug },
        data: {
          ...rest,
          ...(thumbnail_url !== undefined
            ? { thumbnailUrl: thumbnail_url }
            : {}),
        },
      });
    },
  );

  const paper = routingResult.results[0];
  return exposeThumbnailUrl(paper);
};

export const deletePaper = async (queryRouter: QueryRouter, slug: string) => {
  const intent: QueryIntent = {
    type: QueryType.DELETE,
    entity: "paper",
    operation: "delete",
    filters: { slug },
  };

  const routingResult = await queryRouter.routeQuery(
    intent,
    async (prisma, _shardId) => {
      return prisma.paper.delete({
        where: { slug },
      });
    },
  );

  return routingResult.results[0];
};
