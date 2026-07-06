import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "hono/adapter";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import authRoutes from "./routes/auth.routes.js";
import paperRoutes from "./routes/paper.routes.js";
import authorRoutes from "./routes/author.routes.js";
import modelRoutes from "./routes/model.routes.js";
import datasetRoutes from "./routes/dataset.routes.js";
import taskRoutes from "./routes/task.routes.js";
import discussionRoutes from "./routes/discussion.routes.js";
import methodRoutes from "./routes/method.routes.js";
import benchmarkRoutes from "./routes/benchmark.routes.js";


// 1. Define BOTH Environment Bindings and Context Variables
type Env = {
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    prisma: PrismaClient;
    userId: string;
  };
};

// Pass the full Env type to Hono
const app = new Hono<Env>();

// Configure CORS
app.use(
  "*",
  cors({
    origin: (origin) => origin || "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  }),
);

// 2. Per-Request Prisma Client Lifecycle Middleware
app.use("*", async (c, next) => {
  const DATABASE_URL = c.env.DATABASE_URL as string;

  // Strip quotes if they were included in the .dev.vars file
  const cleanUrl = DATABASE_URL ? DATABASE_URL.replace(/^"|"$/g, "") : "";

  const isNeon = cleanUrl.includes("neon.tech");
  let prisma: PrismaClient;
  let pool: Pool | null = null;

  if (isNeon) {
    // Configure WebSocket for Cloudflare Workers environment
    neonConfig.webSocketConstructor = WebSocket;

    // PrismaNeon v7.8 takes a PoolConfig object — it creates the Pool internally
    const adapter = new PrismaNeon({ connectionString: cleanUrl });
    prisma = new PrismaClient({ adapter });
  } else {
    // Use standard pg Pool for local PostgreSQL connection
    pool = new Pool({ connectionString: cleanUrl });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }

  c.set("prisma", prisma);

  try {
    await next();
  } finally {
    // Clean up Prisma connections and close local pools to avoid leaks
    await prisma.$disconnect();
    if (pool) {
      await pool.end();
    }
  }
});

// Register Routes
app.get("/health", (c) =>
  c.json({
    status: "ok",
    message: "FrontierAtlas V1 API is running perfectly! 🚀",
    bindings: Object.keys(c.env),
    dbUrl: c.env.DATABASE_URL,
  }),
);
app.route("/api/v1/auth", authRoutes);
app.route("/api/v1/research-papers", paperRoutes);
app.route("/api/v1/authors", authorRoutes);
app.route("/api/v1/models", modelRoutes);
app.route("/api/v1/datasets", datasetRoutes);
app.route("/api/v1/tasks", taskRoutes);
app.route("/api/v1/discussions", discussionRoutes);
app.route("/api/v1/methods", methodRoutes);
app.route("/api/v1/benchmarks", benchmarkRoutes);

export default app;
