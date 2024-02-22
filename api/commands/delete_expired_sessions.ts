import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { KyselyAdapter } from '#services/kysely_adapter'
import { db } from '#services/db'

export default class DeleteExpiredSessions extends BaseCommand {
  static commandName = 'lucia:delete-expired-sessions'
  static description = 'Delete all expired sessions'

  static options: CommandOptions = {
    startApp: true,
  }

  async completed() {
    await db.destroy()
  }

  async run() {
    this.logger.info('Delete expired sessions...')
    try {
      const adapter = new KyselyAdapter(db)
      await adapter.deleteExpiredSessions()
      this.logger.success('Success')
    } catch (error) {
      this.logger.error('Failed')
      this.error = error
      this.exitCode = 1
    }
  }
}
