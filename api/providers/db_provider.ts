import { db } from '#services/db'
import { DB } from '#database/types'
import { HttpContext } from '@adonisjs/core/http'
import type { ApplicationService } from '@adonisjs/core/types'
import { Kysely } from 'kysely'

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    db: Kysely<DB>
  }
}

export default class DbProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    HttpContext.getter(
      'db',
      function (this: HttpContext) {
        return db
      },
      true
    )
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
