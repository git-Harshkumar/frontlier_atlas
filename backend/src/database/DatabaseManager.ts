import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

export enum ShardId {
  SHARD_1 = 1,
  SHARD_2 = 2,
  SHARD_3 = 3,
  SHARD_4 = 4,
  SHARD_5 = 5,
}

export interface DatabaseUrls {
  SHARD_1_DATABASE_URL: string;
  SHARD_2_DATABASE_URL: string;
  SHARD_3_DATABASE_URL: string;
  SHARD_4_DATABASE_URL: string;
  SHARD_5_DATABASE_URL: string;
}

export class DatabaseManager {
  private readonly urls: DatabaseUrls;

  constructor(urls: DatabaseUrls) {
    this.urls = urls;

    neonConfig.webSocketConstructor = WebSocket;
  }

  private getConnectionString(shard: ShardId): string {
    switch (shard) {
      case ShardId.SHARD_1:
        return this.urls.SHARD_1_DATABASE_URL;

      case ShardId.SHARD_2:
        return this.urls.SHARD_2_DATABASE_URL;

      case ShardId.SHARD_3:
        return this.urls.SHARD_3_DATABASE_URL;

      case ShardId.SHARD_4:
        return this.urls.SHARD_4_DATABASE_URL;

      case ShardId.SHARD_5:
        return this.urls.SHARD_5_DATABASE_URL;

      default:
        throw new Error(`Invalid shard: ${shard}`);
    }
  }

  public getShardUrl(shard: ShardId): string {
    return this.getConnectionString(shard);
  }

  public getClient(shard: ShardId): PrismaClient {
    const adapter = new PrismaNeon({
      connectionString: this.getConnectionString(shard),
    });

    return new PrismaClient({
      adapter,
    });
  }

  public async checkShard(shard: ShardId): Promise<boolean> {
    const prisma = this.getClient(shard);

    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    } finally {
      await prisma.$disconnect();
    }
  }

  public async getHealthStatus() {
    return {
      shard1: await this.checkShard(ShardId.SHARD_1),
      shard2: await this.checkShard(ShardId.SHARD_2),
      shard3: await this.checkShard(ShardId.SHARD_3),
      shard4: await this.checkShard(ShardId.SHARD_4),
      shard5: await this.checkShard(ShardId.SHARD_5),
    };
  }

  public async disconnect(client: PrismaClient): Promise<void> {
    await client.$disconnect();
  }
}