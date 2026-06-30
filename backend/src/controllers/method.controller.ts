import { Context } from 'hono';
import * as methodService from '../services/method.service.js';

export const getMethods = async (c: Context) => {
  const prisma = c.var.prisma;
  const sort = c.req.query('sort') || 'name';
  const search = c.req.query('search');
  const page = Number(c.req.query('page')) || 1;
  const limit = Number(c.req.query('limit')) || 20;

  try {
    const result = await methodService.getMethods(prisma, {
      sort,
      search,
      page,
      limit,
    });

    return c.json({
      status: "success",
      count: result.methods.length,
      data: result,
    }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const getMethodBySlug = async (c: Context) => {
  const prisma = c.var.prisma;
  const slug = c.req.param('slug') as string;

  try {
    const method = await methodService.getMethodBySlug(prisma, slug);
    if (!method) return c.json({ status: "error", message: "Method not found" }, 404);
    return c.json({ status: "success", data: method }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const createMethod = async (c: Context) => {
  const prisma = c.var.prisma;
  const body = await c.req.json();

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    return c.json({ status: "error", message: "Name is required" }, 400);
  }

  try {
    const method = await methodService.createMethod(prisma, { name: body.name.trim() });
    return c.json({ status: "success", data: method }, 201);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return c.json({ status: "error", message: "A method with this name already exists" }, 409);
    }
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const updateMethod = async (c: Context) => {
  const prisma = c.var.prisma;
  const slug = c.req.param('slug') as string;
  const body = await c.req.json();

  if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim().length === 0)) {
    return c.json({ status: "error", message: "Name must be a non-empty string" }, 400);
  }

  try {
    const method = await methodService.updateMethod(prisma, slug, {
      name: body.name ? body.name.trim() : undefined,
    });
    return c.json({ status: "success", data: method }, 200);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return c.json({ status: "error", message: "Method not found" }, 404);
    }
    if (error.code === 'P2002') {
      return c.json({ status: "error", message: "A method with this name already exists" }, 409);
    }
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const deleteMethod = async (c: Context) => {
  const prisma = c.var.prisma;
  const slug = c.req.param('slug') as string;

  try {
    await methodService.deleteMethod(prisma, slug);
    return c.json({ status: "success", message: "Method deleted" }, 200);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return c.json({ status: "error", message: "Method not found" }, 404);
    }
    return c.json({ status: "error", detail: error.message }, 500);
  }
};
