import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import * as paperController from '../controllers/paper.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const paperIngestSchema = z.object({
  schemaVersion: z.string().optional(),
  recordType: z.literal("RESEARCH_PAPER").optional(),
  content: z.object({
    title: z.string(),
    paper_url: z.string().url().optional(),
    thumbnail_url: z.string().url().optional(),
    github_url: z.string().url().optional(),
    github_stars: z.number().default(0)
  })
});

const paperUpdateSchema = z.object({
  title: z.string().optional(),
  abstract: z.string().optional(),
  paperUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
  projectUrl: z.string().url().optional()
});

const paperRoutes = new Hono();

paperRoutes.post('/ingest', zValidator('json', paperIngestSchema), paperController.ingestPaper as any);
paperRoutes.get('/', paperController.getPapers as any);
paperRoutes.get('/:slug', paperController.getPaperBySlug as any);
paperRoutes.put('/:slug', authMiddleware, zValidator('json', paperUpdateSchema), paperController.updatePaper as any);
paperRoutes.delete('/:slug', authMiddleware, paperController.deletePaper as any);

export default paperRoutes;
