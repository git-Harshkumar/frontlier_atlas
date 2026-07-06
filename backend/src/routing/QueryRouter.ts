import { PrismaClient } from "../generated/prisma/client.js";
import { DatabaseManager } from "../database/DatabaseManager.js";
import { ShardId, CategoryShardMap } from "../database/shard-config.js";
import {
  QueryIntent,
  QueryPlan,
  QueryType,
  RoutingResult,
  RoutingStrategy,
  TargetShard,
} from "./types.js";

export class QueryRouter {
  private readonly databaseManager: DatabaseManager;

  constructor(databaseManager: DatabaseManager) {
    this.databaseManager = databaseManager;
  }

  /**
   * Main entry point for routing queries
   * @param intent The query intent to route
   * @param executeQuery The function that executes the query on a single PrismaClient
   * @returns RoutingResult with merged results
   */
  async routeQuery<T>(
    intent: QueryIntent,
    executeQuery: (prisma: PrismaClient, shardId: ShardId) => Promise<T>
  ): Promise<RoutingResult<T>> {
    try {
      const plan = await this.createQueryPlan(intent);
      const failedShards: ShardId[] = [];
      const results: T[] = [];

      // Execute queries on all target shards
      const queryPromises = plan.targetShards.map(async (targetShard) => {
        try {
          const prisma = this.databaseManager.getClient(targetShard.id);
          const result = await executeQuery(prisma, targetShard.id);
          return { shardId: targetShard.id, result };
        } catch (error) {
          console.error(`Query failed on shard ${targetShard.id}`, error);
          failedShards.push(targetShard.id);
          return null;
        }
      });

      // Wait for all queries to settle
      const settledResults = await Promise.allSettled(queryPromises);

      // Process results
      for (const settled of settledResults) {
        if (settled.status === "fulfilled" && settled.value !== null) {
          results.push(settled.value.result);
        }
      }

      // TODO: Add global sorting
      // TODO: Add ranking
      // TODO: Add pagination
      // TODO: Add deduplication
      // TODO: Add aggregation

      return {
        plan,
        success: true,
        results,
        failedShards,
      };
    } catch (error) {
      const fallbackPlan: QueryPlan = {
        intent,
        strategy: RoutingStrategy.PRIMARY_ONLY,
        targetShards: [],
      };

      return {
        plan: fallbackPlan,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        results: [],
        failedShards: [],
      };
    }
  }

  /**
   * Gets all shards as TargetShard objects
   * @returns Array of all TargetShard
   */
  private getAllShards(): TargetShard[] {
    return Object.values(ShardId)
      .filter((id): id is ShardId => typeof id === "number")
      .map((id) => ({ id, type: "primary" }));
  }

  /**
   * Checks if intent has any filters (task, method, model)
   * @param intent QueryIntent
   * @returns boolean
   */
  private hasAnyFilters(intent: QueryIntent): boolean {
    const filters = intent.filters || {};
    return !!(filters.task || filters.method || filters.model);
  }

  /**
   * Resolves which target shards should handle this query
   * @param intent The query intent
   * @returns Array of TargetShard
   */
  async resolveTargetShards(intent: QueryIntent): Promise<TargetShard[]> {
    // Case 1: Paper details - check if we have shard info in intent.filters, otherwise return empty for lookup required
    if (intent.entity === "paper" && intent.operation === "findUnique") {
      // For now, return general archive as fallback if no shard info
      return [{ id: ShardId.SHARD_5, type: "primary" }];
    }

    // Case 2: Category page (has intent.category)
    if (intent.category && CategoryShardMap[intent.category]) {
      return [{ id: CategoryShardMap[intent.category], type: "primary" }];
    }

    // Case 3: Has filters (task, method, model) but no category - use scatter-gather
    if (this.hasAnyFilters(intent)) {
      return this.getAllShards();
    }

    // Case 4: Homepage feed (no category, no filters) - scatter-gather
    return this.getAllShards();
  }

  /**
   * Creates a full query plan from an intent
   * @param intent The query intent
   * @returns QueryPlan
   */
  async createQueryPlan(intent: QueryIntent): Promise<QueryPlan> {
    const targetShards = await this.resolveTargetShards(intent);

    let strategy: RoutingStrategy;

    // Determine strategy
    if (targetShards.length === 1) {
      strategy = RoutingStrategy.SHARD_KEY;
    } else {
      strategy = RoutingStrategy.LOAD_BALANCED; // Or another appropriate strategy for scatter-gather
    }

    // Paper details special case (placeholder for lookup required)
    if (intent.entity === "paper" && intent.operation === "findUnique" && targetShards.length === 0) {
      strategy = RoutingStrategy.PRIMARY_ONLY;
    }

    return {
      intent,
      strategy,
      targetShards,
      fallbackShards: [
        {
          id: ShardId.SHARD_5,
          type: "primary",
        },
      ],
    };
  }
}

export default QueryRouter;
