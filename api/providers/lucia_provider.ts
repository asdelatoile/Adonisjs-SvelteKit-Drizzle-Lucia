import type { ApplicationService } from '@adonisjs/core/types'
import { HttpContext } from '@adonisjs/core/http'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { Lucia } from 'lucia'
import { users, sessions } from '#database/schema'
import { db } from '#services/drizzle_service'
import globalApp from '@adonisjs/core/services/app'

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    lucia: any
  }
}
declare module 'lucia' {
  interface Register {
    Lucia: typeof Lucia
    DatabaseUserAttributes: Omit<typeof users, 'id'>
  }
}

export default class LuciaProvider {
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
      'lucia',
      function (this: HttpContext) {
        const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users)

        return new Lucia(adapter, {
          sessionCookie: {
            attributes: {
              secure: globalApp.inProduction ? true : false,
            },
          },
          getUserAttributes: (attributes) => {
            return {
              // we don't need to expose the hashed password!
              email: attributes.email,
              createdAt: attributes.createdAt,
              updatedAt: attributes.updatedAt,
            }
          },
        })
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
