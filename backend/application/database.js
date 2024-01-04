import { PrismaClient } from '@prisma/client'
import { logger } from './logging.js'

export const prismaClient = new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
})

prismaClient.$on('warn', (e) => {
  logger.warn(e)
})

prismaClient.$on('info', (e) => {
  logger.info(e)
})

prismaClient.$on('error', (e) => {
  logger.error(e)
})