import { Context } from 'hono';
import * as paperService from '../services/paper.service.js';

export const ingestPaper = async (c: Context) => {
  const prisma = c.var.prisma;
  const body = await c.req.json();

  try {
    const newPaper = await paperService.ingestPaper(prisma, body.content);
    return c.json({
      status: "success",
      message: "Paper successfully written via Prisma Neon Adapter",
      paper_id: newPaper.id,
      slug: newPaper.slug
    }, 201);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const getPapers = async (c: Context) => {
  const prisma = c.var.prisma;
  const limit = Number(c.req.query('limit')) || 50;
  const skip = Number(c.req.query('skip')) || 0;

  try {
    const papers = await paperService.getPapers(prisma, limit, skip);
    return c.json({
      status: "success",
      count: papers.length,
      data: papers
    }, 200);
  } catch (error: any) {
    return c.json({ 
      status: "error", 
      detail: error.message, 
      dbUrl: (c.env as any).DATABASE_URL,
      bindings: Object.keys(c.env || {})
    }, 500);
  }
};

export const getPaperBySlug = async (c: Context) => {
  const prisma = c.var.prisma;
  const slug = c.req.param('slug') as string;

  try {
    const paper = await paperService.getPaperBySlug(prisma, slug);
    if (!paper) {
      return c.json({ status: "error", message: "Paper not found" }, 404);
    }
    return c.json({ status: "success", data: paper }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const updatePaper = async (c: Context) => {
  const prisma = c.var.prisma;
  const slug = c.req.param('slug') as string;
  const body = await c.req.json();

  try {
    const updatedPaper = await paperService.updatePaper(prisma, slug, body);
    return c.json({ status: "success", data: updatedPaper }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const deletePaper = async (c: Context) => {
  const prisma = c.var.prisma;
  const slug = c.req.param('slug') as string;

  try {
    await paperService.deletePaper(prisma, slug);
    return c.json({ status: "success", message: "Paper deleted" }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};
