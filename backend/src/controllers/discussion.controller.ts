import { Context } from "hono";
import * as discussionService from "../services/discussion.service.js";



export const getDiscussions = async (c: Context) => {
  try {
    const discussions = await discussionService.getDiscussions();

    return c.json({
      status: "success",
      count: discussions.length,
      data: discussions,
    });
  } catch (error: any) {
    return c.json(
      {
        status: "error",
        detail: error.message,
      },
      500
    );
  }
};