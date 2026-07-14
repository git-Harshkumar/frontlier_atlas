import { Context } from 'hono';
import * as modelService from '../services/model.service.js';
import { QueryRouter } from '../routing/index.js';
import { redisManager } from '../lib/redis.js';

export const getModels = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;

  const limit = Number(c.req.query('limit')) || 50;
  const skip = Number(c.req.query('skip')) || 0;
  const sort = c.req.query('sort') || 'name';

  const vendor = c.req.query('vendor');
  const modality = c.req.query('modality');
  const accessType = c.req.query('accessType');
  const opennessType = c.req.query('opennessType');

  const cacheKey = [
    'models:list',
    limit,
    skip,
    sort,
    vendor || 'all',
    modality || 'all',
    accessType || 'all',
    opennessType || 'all',
  ].join(':');

  try {
    const redis = redisManager.getClient();
    let cached = null;

    try {
      cached = await redis.get(cacheKey);
    } catch (err) {
      console.error('Redis GET failed:', err);
    }

    if (cached) {
      return c.json(cached as any, 200);
    }

    const models = await modelService.getModels(
      queryRouter,
      limit,
      skip,
      sort,
      vendor,
      modality,
      accessType,
      opennessType,
    );

    const response = {
      status: 'success',
      count: models.length,
      data: models,
    };

    try {
      await redis.set(cacheKey, response, { ex: 900 });
    } catch (err) {
      console.error('Redis SET failed:', err);
    }

    return c.json(response, 200);
  } catch (error: any) {
    console.error('Error in getModels controller:', error);

    return c.json(
      {
        status: 'error',
        detail: error.message,
      },
      500,
    );
  }
};

export const getModelFacets = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const cacheKey = 'models:facets';

  try {
    const redis = redisManager.getClient();
    let cached = null;

    try {
      cached = await redis.get(cacheKey);
    } catch (err) {
      console.error('Redis GET failed:', err);
    }

    if (cached) {
      return c.json(cached as any, 200);
    }

    const facets = await modelService.getModelFacets(queryRouter);

    const response = {
      status: 'success',
      data: facets,
    };

    try {
      await redis.set(cacheKey, response, { ex: 900 });
    } catch (err) {
      console.error('Redis SET failed:', err);
    }

    return c.json(response, 200);
  } catch (error: any) {
    console.error('Error in getModelFacets controller:', error);

    return c.json(
      {
        status: 'error',
        detail: error.message,
      },
      500,
    );
  }
};

export const getModelBySlug = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const slug = c.req.param('slug') as string;

  const cacheKey = `model:${slug}`;

  try {
    const redis = redisManager.getClient();
    let cached = null;

    try {
      cached = await redis.get(cacheKey);
    } catch (err) {
      console.error('Redis GET failed:', err);
    }

    if (cached) {
      return c.json(cached as any, 200);
    }

    const model = await modelService.getModelBySlug(queryRouter, slug);

    if (!model) {
      return c.json(
        {
          status: 'error',
          message: 'Model not found',
        },
        404,
      );
    }

    const response = {
      status: 'success',
      data: model,
    };

    try {
      await redis.set(cacheKey, response, { ex: 600 });
    } catch (err) {
      console.error('Redis SET failed:', err);
    }

    return c.json(response, 200);
  } catch (error: any) {
    return c.json(
      {
        status: 'error',
        detail: error.message,
      },
      500,
    );
  }
};