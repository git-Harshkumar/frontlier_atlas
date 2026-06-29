import { prisma } from '../src/lib/prisma';
import { config } from '../src/ingestion/config/index';
import { logger } from '../src/ingestion/logger/index';
import { fetchPapers } from '../src/ingestion/scheduler/fetch';
import { processPapers } from '../src/ingestion/scheduler/process';
import { syncPapers } from '../src/ingestion/scheduler/sync';
import { defaultHttpClient } from '../src/ingestion/http/client';


async function runDailySync(customStartTime?: Date, customEndTime?: Date) {
  logger.info('--- DAILY SYNC STARTED ---');
  
  const endTime = customEndTime || new Date();
  let startTime = customStartTime;
  
  if (!startTime) {
    startTime = new Date(endTime.getTime() - config.sync.lookbackHours * 60 * 60 * 1000);
  }

  try {
    const rawPapers = await fetchPapers(startTime, endTime);
    
    const newPapers = await processPapers(rawPapers, prisma);
    
    const insertedCount = await syncPapers(newPapers, prisma);

    logger.info('--- DAILY SYNC COMPLETED SUCCESSFULLY ---');
    logger.info(`Stats:
      Window: ${startTime.toISOString()} to ${endTime.toISOString()}
      Raw Valid Fetched: ${rawPapers.length}
      New Unique Papers Inserted: ${insertedCount}
    `);
  } catch (error) {
    logger.error('--- DAILY SYNC FAILED ---', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    defaultHttpClient.stop();
  }
}

const args = process.argv.slice(2);
let customStart: Date | undefined;
let customEnd: Date | undefined;

if (args.length >= 1) {
  customStart = new Date(args[0]);
  if (isNaN(customStart.getTime())) {
    logger.error(`Invalid start date provided: ${args[0]}`);
    process.exit(1);
  }
}
if (args.length >= 2) {
  customEnd = new Date(args[1]);
  if (isNaN(customEnd.getTime())) {
    logger.error(`Invalid end date provided: ${args[1]}`);
    process.exit(1);
  }
}

runDailySync(customStart, customEnd);
