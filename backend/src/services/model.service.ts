import { QueryRouter } from "../routing/index.js";
import { QueryIntent, QueryType } from "../routing/types.js";

export const getModels = async (
  queryRouter: QueryRouter,
  limit: number = 50,
  skip: number = 0,
) => {
  const intent: QueryIntent = {
    type: QueryType.READ,
    entity: "model",
    operation: "findMany",
  };

  const routingResult = await queryRouter.routeQuery(intent, async (prisma) => {
    return prisma.model.findMany({
      take: limit,
      skip,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        vendor: true,
        releaseDate: true,
        parameterCount: true,
        modality: true,
        accessType: true,
        opennessType: true,
        description: true,
        benchmark_score: true,
        createdAt: true,
        _count: {
          select: {
            papers: true,
          },
        },
      },
    });
  });

  const modelsById = new Map<string, any>();

  for (const result of routingResult.results) {
    for (const model of result) {
      if (!modelsById.has(model.id)) {
        modelsById.set(model.id, model);
      } else {
        const existing = modelsById.get(model.id);

        if (existing) {
          existing._count.papers += model._count.papers;
        }
      }
    }
  }

  return Array.from(modelsById.values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, limit)
    .map((model) => ({
      id: model.id,
      name: model.name,
      slug: model.slug,
      vendor: model.vendor,
      releaseDate: model.releaseDate,
      parameterCount: model.parameterCount,
      modality: model.modality,
      accessType: model.accessType,
      opennessType: model.opennessType,
      description: model.description,
      benchmarkScore: model.benchmark_score,
      createdAt: model.createdAt,
      paperCount: model._count.papers,
    }));
};

export const getModelBySlug = async (
  queryRouter: QueryRouter,
  slug: string,
) => {
  const intent: QueryIntent = {
    type: QueryType.READ,
    entity: "model",
    operation: "findUnique",
    filters: { slug },
  };

  const routingResult = await queryRouter.routeQuery(intent, async (prisma) => {
    return Promise.all([
      prisma.model.findUnique({
        where: { slug },
        select: {
          id: true,
          name: true,
          slug: true,
          vendor: true,
          releaseDate: true,
          parameterCount: true,
          modality: true,
          accessType: true,
          opennessType: true,
          description: true,
          benchmark_score: true,
          createdAt: true,
          _count: {
            select: {
              papers: true,
            },
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
                  githubStars: true,
                },
              },
            },
            orderBy: { paper: { githubStars: "desc" } },
          },
        },
      }),

      prisma.paper.findMany({
        take: 200,
        where: {
          models: {
            some: {
              model: { slug },
            },
          },
        },
        select: {
          id: true,
          citationCount: true,
          githubStars: true,
          tasks: {
            select: {
              task: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  color: true,
                },
              },
            },
          },
          methods: {
            select: {
              method: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  category: true,
                },
              },
            },
          },
          datasets: {
            select: {
              dataset: {
                select: {
                  id: true,
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
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      }),

      prisma.model.findMany({
        take: 6,
        where: {
          slug: {
            not: slug,
          },
          papers: {
            some: {
              paper: {
                models: {
                  some: {
                    model: { slug },
                  },
                },
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: {
              papers: true,
            },
          },
        },
      }),
    ]);
  });

  let baseModel: any = null;
  let paperCount = 0;

  const allPapers: any[] = [];
  const allModelPapers: any[] = [];

  const relatedModelsById = new Map<string, any>();

  for (const result of routingResult.results) {
    const [model, modelPapers, relatedModels] = result;

    if (model) {
      paperCount += model._count.papers;

      if (!baseModel) {
        const { papers, ...rest } = model;
        baseModel = { ...rest };
      }

      allPapers.push(...model.papers);
    }

    allModelPapers.push(...modelPapers);

    for (const relatedModel of relatedModels) {
      if (!relatedModelsById.has(relatedModel.id)) {
        relatedModelsById.set(relatedModel.id, relatedModel);
      }
    }
  }

  if (!baseModel) return null;

  const seenPaperIds = new Set<string>();
  const dedupPapers = [];

  for (const paperRelation of allPapers) {
    if (!seenPaperIds.has(paperRelation.paper.id)) {
      seenPaperIds.add(paperRelation.paper.id);
      dedupPapers.push(paperRelation);
    }
  }

  const seenModelPaperIds = new Set<string>();

  const tasksBySlug = new Map<string, any>();
  const methodsBySlug = new Map<string, any>();
  const datasetsBySlug = new Map<string, any>();
  const benchmarksBySlug = new Map<string, any>();

  let citationCount = 0;
  let githubStars = 0;

  for (const paper of allModelPapers) {
    if (seenModelPaperIds.has(paper.id)) continue;

    seenModelPaperIds.add(paper.id);

    citationCount += paper.citationCount || 0;
    githubStars += paper.githubStars || 0;

    for (const taskRelation of paper.tasks) {
      const task = taskRelation.task;

      if (!tasksBySlug.has(task.slug)) {
        tasksBySlug.set(task.slug, task);
      }
    }

    for (const methodRelation of paper.methods) {
      const method = methodRelation.method;

      if (!methodsBySlug.has(method.slug)) {
        methodsBySlug.set(method.slug, method);
      }
    }

    for (const datasetRelation of paper.datasets) {
      const dataset = datasetRelation.dataset;

      if (!datasetsBySlug.has(dataset.slug)) {
        datasetsBySlug.set(dataset.slug, dataset);
      }
    }

    for (const ranking of paper.rankings) {
      const benchmark = ranking.benchmark;

      if (!benchmarksBySlug.has(benchmark.slug)) {
        benchmarksBySlug.set(benchmark.slug, {
          ...benchmark,
          rank: ranking.rank,
        });
      }
    }
  }

  dedupPapers.sort((a, b) => {
    const scoreA = Math.max(
      a.paper.githubStars || 0,
      a.paper.citationCount || 0,
    );

    const scoreB = Math.max(
      b.paper.githubStars || 0,
      b.paper.citationCount || 0,
    );

    return scoreB - scoreA;
  });

  return {
    id: baseModel.id,
    name: baseModel.name,
    slug: baseModel.slug,
    vendor: baseModel.vendor,
    releaseDate: baseModel.releaseDate,
    parameterCount: baseModel.parameterCount,
    modality: baseModel.modality,
    accessType: baseModel.accessType,
    opennessType: baseModel.opennessType,
    description: baseModel.description,
    benchmarkScore: baseModel.benchmark_score,
    createdAt: baseModel.createdAt,
    paperCount,
    citationCount,
    githubStars,
    papers: dedupPapers.slice(0, 100),
    tasks: Array.from(tasksBySlug.values()),
    methods: Array.from(methodsBySlug.values()),
    datasets: Array.from(datasetsBySlug.values()),
    benchmarks: Array.from(benchmarksBySlug.values()),
    relatedModels: Array.from(relatedModelsById.values()).map((model) => ({
      id: model.id,
      name: model.name,
      slug: model.slug,
      paperCount: model._count.papers,
    })),
  };
};