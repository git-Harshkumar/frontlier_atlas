import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "hono/adapter";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

import authRoutes from "./routes/auth.routes.js";
import paperRoutes from "./routes/paper.routes.js";
import authorRoutes from "./routes/author.routes.js";
import modelRoutes from "./routes/model.routes.js";
import datasetRoutes from "./routes/dataset.routes.js";
import taskRoutes from "./routes/task.routes.js";

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

  // Configure WebSocket for Cloudflare Workers environment
  neonConfig.webSocketConstructor = WebSocket;

  // PrismaNeon v7.8 takes a PoolConfig object — it creates the Pool internally
  const adapter = new PrismaNeon({ connectionString: cleanUrl });
  const prisma = new PrismaClient({ adapter });

  c.set("prisma", prisma);

  await next();
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

export default app;
