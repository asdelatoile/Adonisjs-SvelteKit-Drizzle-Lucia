import type { ApplicationService } from '@adonisjs/core/types'
import { HttpContext } from '@adonisjs/core/http'
import { db } from '#services/drizzle_service'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '#database/schema'

// (alias) drizzle<typeof schema>(client: postgres.Sql<{}>, config?: DrizzleConfig<typeof schema> | undefined): PostgresJsDatabase<typeof schema>
// import drizzle

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    drizzle: PostgresJsDatabase<typeof schema>
    models: typeof schema
  }
}

export default class DrizzleProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    HttpContext.getter(
      'drizzle',
      function (this: HttpContext) {
        return db
      },
      true
    )
    HttpContext.getter(
      'models',
      function (this: HttpContext) {
        return schema
      },
      true
    )
  }

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
