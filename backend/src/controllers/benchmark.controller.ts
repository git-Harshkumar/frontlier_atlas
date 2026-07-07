import { Context } from 'hono';
import * as benchmarkService from '../services/benchmark.service.js';

export const getBenchmarks = async (c: Context) => {
  const prisma = c.var.prisma;
  const limit = Number(c.req.query('limit')) || 50;
  const skip = Number(c.req.query('skip')) || 0;

  try {
    const benchmarks = await benchmarkService.getBenchmarks(prisma, limit, skip);
    return c.json({ status: 'success', count: benchmarks.length, data: benchmarks }, 200);
  } catch (error: any) {
    console.error('Error in getBenchmarks controller:', error);
    return c.json({ status: 'error', detail: error.message }, 500);
  }
};

export const getBenchmarkBySlug = async (c: Context) => {
  const prisma = c.var.prisma;
  const slug = c.req.param('slug') as string;

  try {
    const benchmark = await benchmarkService.getBenchmarkBySlug(prisma, slug);
    if (!benchmark) return c.json({ status: 'error', message: 'Benchmark not found' }, 404);
    return c.json({ status: 'success', data: benchmark }, 200);
  } catch (error: any) {
    console.error('Error in getBenchmarkBySlug controller:', error);
    return c.json({ status: 'error', detail: error.message }, 500);
  }
};
