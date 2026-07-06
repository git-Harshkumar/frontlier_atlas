import { Context } from 'hono';
import * as datasetService from '../services/dataset.service.js';
import { QueryRouter } from '../routing/index.js';

export const getDatasets = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const limit = Number(c.req.query('limit')) || 50;
  const skip = Number(c.req.query('skip')) || 0;

  try {
    const datasets = await datasetService.getDatasets(queryRouter, limit, skip);
    return c.json({ status: "success", count: datasets.length, data: datasets }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const getDatasetBySlug = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const slug = c.req.param('slug') as string;

  try {
    const dataset = await datasetService.getDatasetBySlug(queryRouter, slug);
    if (!dataset) return c.json({ status: "error", message: "Dataset not found" }, 404);
    return c.json({ status: "success", data: dataset }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};
