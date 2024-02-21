import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { KyselyAdapter } from '#services/kysely_adapter'
import { db, pool } from '#services/db'

export default class DeleteExpiredSessions extends BaseCommand {
  static commandName = 'lucia:delete-expired-sessions'
  static description = 'Delete all expired sessions'

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Delete expired sessions...')
    const adapter = new KyselyAdapter(db)
    await adapter.deleteExpiredSessions()
    pool.end()
    this.logger.info('Ok')
  }
}
