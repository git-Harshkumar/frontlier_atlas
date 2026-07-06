import { PrismaClient } from "../generated/prisma/client";

type ModelPaperTaskRow = {
  task: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  };
};

type ModelPaperRow = {
  id: string;
  title: string;
  slug: string;
  citationCount: number | null;
  githubStars: number | null;
  publicationDate: Date | null;
  tasks: ModelPaperTaskRow[];
};

type ModelDetailTaskRow = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
};

type ModelDetailPaperRow = {
  citationCount: number | null;
  githubStars: number | null;
  tasks: ModelPaperTaskRow[];
};

type ModelRow = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  _count: { papers: number };
  papers: { paper: ModelPaperRow }[];
};

export const getModels = async (
  prisma: PrismaClient,
  limit: number = 50,
  skip: number = 0,
) => {
  const models = (await prisma.model.findMany({
    take: limit,
    skip,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      _count: { select: { papers: true } },
      papers: {
        select: {
          paper: {
            select: {
              title: true,
              slug: true,
              citationCount: true,
              githubStars: true,
              publicationDate: true,
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
            },
          },
        },
      },
    },
  })) as ModelRow[];

  return models.map((model) => {
    let citationCount = 0;
    let githubStars = 0;
    let latestPaperDate: string | null = null;
    let latestPaperTitle: string | null = null;
    let latestPaperSlug: string | null = null;

    const taskCounts = new Map<
      string,
      { task: ModelDetailTaskRow; count: number }
    >();

    for (const relation of model.papers) {
      citationCount += relation.paper.citationCount || 0;
      githubStars += relation.paper.githubStars || 0;

      for (const taskRelation of relation.paper.tasks) {
        const task = taskRelation.task;
        const existing = taskCounts.get(task.slug);
        if (existing) {
          existing.count += 1;
        } else {
          taskCounts.set(task.slug, { task, count: 1 });
        }
      }

      const publicationDate =
        relation.paper.publicationDate?.toISOString() ?? null;
      if (!publicationDate) continue;
      if (!latestPaperDate) {
        latestPaperDate = publicationDate;
        latestPaperTitle = relation.paper.title;
        latestPaperSlug = relation.paper.slug;
        continue;
      }

      if (
        new Date(publicationDate).getTime() >
        new Date(latestPaperDate).getTime()
      ) {
        latestPaperDate = publicationDate;
        latestPaperTitle = relation.paper.title;
        latestPaperSlug = relation.paper.slug;
      }
    }

    const topTasks = Array.from(taskCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
      .map((entry) => entry.task);

    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      createdAt: model.createdAt,
      paperCount: model._count.papers,
      citationCount,
      githubStars,
      latestPaperDate,
      latestPaperTitle,
      latestPaperSlug,
      tasks: topTasks,
    };
  });
};

export const getModelBySlug = async (prisma: PrismaClient, slug: string) => {
  const model = await prisma.model.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      _count: { select: { papers: true } },
    },
  });

  if (!model) return null;

  const taskPapers = (await prisma.paper.findMany({
    where: {
      models: {
        some: {
          model: { slug },
        },
      },
    },
    select: {
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
    },
  })) as ModelDetailPaperRow[];

  const tasksBySlug = new Map<string, ModelDetailTaskRow>();
  let citationCount = 0;
  let githubStars = 0;

  for (const paper of taskPapers) {
    citationCount += paper.citationCount || 0;
    githubStars += paper.githubStars || 0;

    for (const taskRelation of paper.tasks) {
      const task = taskRelation.task;
      if (!tasksBySlug.has(task.slug)) {
        tasksBySlug.set(task.slug, task);
      }
    }
  }

  return {
    id: model.id,
    name: model.name,
    slug: model.slug,
    createdAt: model.createdAt,
    paperCount: taskPapers.length,
    citationCount,
    githubStars,
    papers: [],
    tasks: Array.from(tasksBySlug.values()),
  };
};
