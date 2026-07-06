import { Context } from 'hono';
import * as taskService from '../services/task.service.js';
import { QueryRouter } from '../routing/index.js';

export const getTasks = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const limit = Number(c.req.query('limit')) || 50;
  const skip = Number(c.req.query('skip')) || 0;

  try {
    const tasks = await taskService.getTasks(queryRouter, limit, skip);
    return c.json({ status: "success", count: tasks.length, data: tasks }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const getTaskPaperCounts = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;

  try {
    const counts = await taskService.getTaskPaperCounts(queryRouter);
    return c.json(counts, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const getTaskBySlug = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const slug = c.req.param('slug') as string;

  try {
    const task = await taskService.getTaskBySlug(queryRouter, slug);
    if (!task) return c.json({ status: "error", message: "Task not found" }, 404);
    return c.json({ status: "success", data: task }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};
