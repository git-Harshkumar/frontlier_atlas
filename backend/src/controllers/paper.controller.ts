import { Context } from "hono";
import * as paperService from "../services/paper.service.js";
import { redisManager } from "../lib/redis.js";
import { QueryRouter } from "../routing/index.js";

// ---------------------------------------------------------------------------
// Version-counter helpers
// Instead of redis.keys("papers:*") O(N) scan, we maintain a lightweight
// integer version in Redis. On any mutation, we INCR the version.
// All list cache keys embed the version, so old keys expire by TTL silently.
// ---------------------------------------------------------------------------

const getPapersVersion = async (): Promise<string> => {
  try {
    const redis = redisManager.getClient();
    const v = await redis.get("papers:version");
    return v ? String(v) : "0";
  } catch {
    return "0";
  }
};

const bumpPapersVersion = async (): Promise<void> => {
  try {
    const redis = redisManager.getClient();
    await redis.incr("papers:version");
  } catch (err) {
    console.error("Redis version bump failed:", err);
  }
};

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

export const ingestPaper = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const body = await c.req.json();

  const newPaper = await paperService.ingestPaper(queryRouter, body.content);

  // Invalidate list cache via version bump (replaces the old redis.keys scan)
  await bumpPapersVersion();
  try {
    const redis = redisManager.getClient();
    await redis.del(`paper:${newPaper.slug}`);
  } catch (err) {
    console.error("Redis cache invalidation failed:", err);
  }

  return c.json(
    {
      status: "success",
      message: "Paper successfully ingested",
      paper_id: newPaper.id,
      slug: newPaper.slug,
    },
    201,
  );
};

export const getPapers = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const sort = c.req.query("sort") || "trending";
  const task = c.req.query("task");
  const method = c.req.query("method");
  const model = c.req.query("model");
  const period = c.req.query("period") || "all";
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 20;
  const cursor = c.req.query("cursor");

  try {
    const redis = redisManager.getClient();

    // Read the current version — one fast Redis GET, prevents any O(N) scan on invalidation
    const version = await getPapersVersion();
    const cacheKey = `papers:v${version}:${JSON.stringify({ sort, task, method, model, period, page, limit, cursor })}`;

    let cached = null;
    try {
      cached = await redis.get(cacheKey);
    } catch (err) {
      console.error("Redis GET failed:", err);
    }

    if (cached) {
      return c.json(cached as any, 200);
    }

    const result = await paperService.getPapers(queryRouter, {
      sort,
      task,
      method,
      model,
      period,
      page,
      limit,
      cursor,
    });

    const response = {
      status: "success",
      count: result.papers.length,
      data: result,
    };

    try {
      await redis.set(cacheKey, response, { ex: 300 }); // 5 minutes
    } catch (err) {
      console.error("Redis SET failed:", err);
    }

    return c.json(response, 200);
  } catch (error: any) {
    console.error("Error in getPapers controller:", error);
    const message = error instanceof Error ? error.message : String(error);
    const status =
      message.startsWith("Invalid cursor") || message.includes("Cursor sort")
        ? 400
        : 500;
    return c.json(
      {
        status: "error",
        detail: message,
      },
      status,
    );
  }
};

export const getPaperBySlug = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const slug = c.req.param("slug") as string;
  const cacheKey = `paper:${slug}`;

  try {
    const redis = redisManager.getClient();
    let cached = null;

    try {
      cached = await redis.get(cacheKey);
    } catch (err) {
      console.error("Redis GET failed:", err);
    }

    if (cached) {
      if ((cached as any).is404) {
        return c.json(cached as any, 404);
      }
      return c.json(cached as any, 200);
    }

    const paper = await paperService.getPaperBySlug(queryRouter, slug);
    if (!paper) {
      const response404 = { status: "error", message: "Paper not found", is404: true };
      try {
        await redis.set(cacheKey, response404, { ex: 60 }); // Cache 404 for 60 seconds
      } catch (err) {
        console.error("Redis SET 404 failed:", err);
      }
      return c.json(response404, 404);
    }

    const response = { status: "success", data: paper };

    try {
      await redis.set(cacheKey, response, { ex: 300 });
    } catch (err) {
      console.error("Redis SET failed:", err);
    }

    return c.json(response, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const getPaperById = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const id = c.req.param("id");

  if (!id) {
    return c.json({ status: "error", message: "ID is required" }, 400);
  }

  // Cache the full paper response.
  const cacheKey = `paper:id:${id}`;

  try {
    const redis = redisManager.getClient();

    let cached = null;
    try {
      cached = await redis.get(cacheKey);
    } catch (err) {
      console.error("Redis GET failed:", err);
    }

    if (cached) {
      if ((cached as any).is404) {
        return c.json(cached as any, 404);
      }
      return c.json(cached as any, 200);
    }

    const paper = await paperService.getPaperById(queryRouter, id);
    if (!paper) {
      const response404 = { status: "error", message: "Paper not found", is404: true };
      try {
        await redis.set(cacheKey, response404, { ex: 60 }); // Cache 404 for 60 seconds
      } catch (err) {
        console.error("Redis SET 404 failed:", err);
      }
      return c.json(response404, 404);
    }

    const response = { status: "success", data: paper };

    try {
      await redis.set(cacheKey, response, { ex: 300 }); // 5 minutes
    } catch (err) {
      console.error("Redis SET failed:", err);
    }

    return c.json(response, 200);
  } catch (error: any) {
    console.error("[getPaperById] Error:", error);
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const updatePaper = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const slug = c.req.param("slug") as string;
  const body = await c.req.json();

  try {
    const updatedPaper = await paperService.updatePaper(
      queryRouter,
      slug,
      body,
    );

    if (!updatedPaper) {
      return c.json({ status: "error", message: "Paper not found" }, 404);
    }

    // Bump version (invalidates all versioned list keys silently via TTL)
    await bumpPapersVersion();
    try {
      const redis = redisManager.getClient();
      await redis.del(`paper:${slug}`);
      // Also invalidate the by-id cache if we know the id
      if ((updatedPaper as any).id) {
        await redis.del(`paper:id:${(updatedPaper as any).id}`);
      }
    } catch (err) {
      console.error("Cache invalidation failed:", err);
    }

    return c.json({ status: "success", data: updatedPaper }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const deletePaper = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const slug = c.req.param("slug") as string;

  try {
    await paperService.deletePaper(queryRouter, slug);

    // Bump version (invalidates all versioned list keys silently via TTL)
    await bumpPapersVersion();
    try {
      const redis = redisManager.getClient();
      await redis.del(`paper:${slug}`);
    } catch (err) {
      console.error("Cache invalidation failed:", err);
    }

    return c.json({ status: "success", message: "Paper deleted" }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const searchPapers = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;

  const q = c.req.query("q")?.trim() || "";
  const sort = c.req.query("sort") || "relevance";
  const page = c.req.query("page") ? Number(c.req.query("page")) : 1;
  const limit = c.req.query("limit") ? Number(c.req.query("limit")) : 20;

  const searchQuery = { q, sort, page, limit };

  // Only attempt caching for non-empty queries
  if (q) {
    const normalizedQ = q.toLowerCase();
    const cacheKey = `search:${normalizedQ}:${sort}:${page}:${limit}`;

    try {
      const redis = redisManager.getClient();

      let cached = null;
      try {
        cached = await redis.get(cacheKey);
      } catch (err) {
        console.error("Redis GET failed:", err);
      }

      if (cached) {
        return c.json(cached as any, 200);
      }

      const result = await paperService.searchPapers(queryRouter, searchQuery);
      const response = { status: "success", data: result };

      // Only cache results that actually returned data (avoid caching empty hits)
      if (result.papers.length > 0) {
        try {
          await redis.set(cacheKey, response, { ex: 300 }); // 5 minutes
        } catch (err) {
          console.error("Redis SET failed:", err);
        }
      }

      return c.json(response, 200);
    } catch (error: any) {
      console.error("Search error:", error);
      return c.json(
        { status: "error", message: error.message || "Search failed" },
        500,
      );
    }
  }

  // Empty query path — skip cache entirely
  try {
    const result = await paperService.searchPapers(queryRouter, searchQuery);
    return c.json({ status: "success", data: result }, 200);
  } catch (error: any) {
    console.error("Search error:", error);
    return c.json(
      { status: "error", message: error.message || "Search failed" },
      500,
    );
  }
};
