import { Context } from 'hono';
import * as authorService from '../services/author.service.js';
import { QueryRouter } from '../routing/index.js';

export const getAuthors = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const limit = Number(c.req.query('limit')) || 50;
  const skip = Number(c.req.query('skip')) || 0;

  try {
    const authors = await authorService.getAuthors(queryRouter, limit, skip);
    return c.json({ status: "success", count: authors.length, data: authors }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const getAuthorBySlug = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const slug = c.req.param('slug') as string;

  try {
    const author = await authorService.getAuthorBySlug(queryRouter, slug);
    if (!author) return c.json({ status: "error", message: "Author not found" }, 404);
    return c.json({ status: "success", data: author }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};
