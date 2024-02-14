import { drizzle } from 'drizzle-orm/postgres-js'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import drizzleConfig from '#config/drizzle'
import * as schema from '#database/schema'
import postgres from 'postgres'

export default class DeleteExpiredSessions extends BaseCommand {
  static commandName = 'lucia:delete-expired-sessions'
  static description = 'Delete all expired sessions'

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Delete expired sessions...')
    const queryClient = postgres(drizzleConfig.databaseUrl, { max: drizzleConfig.pool })
    const db = drizzle(queryClient, { schema })
    const adapter = new DrizzlePostgreSQLAdapter(db, schema.sessions, schema.users)
    await adapter.deleteExpiredSessions()
    queryClient.end()
    this.logger.info('Ok')
  }
}
