import { getRolesPermissionsFromUsers } from '#helpers/kysely'
import { hasPermission } from '#helpers/permissions'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CheckpermMiddleware {
  async handle(
    { db, response, auth }: HttpContext,
    next: NextFn,
    options: { resource: string; action: string }
  ) {
    /**
     * Middleware logic goes here (before the next call)
     */
    if (!auth.isAuthenticated) {
      return response.forbidden({ error: 'Forbidden' })
    }

    const userWPerm = await db
      .selectFrom('users')
      .select((qb) => ['id', getRolesPermissionsFromUsers(qb)])
      .where('id', '=', auth.user.id)
      .executeTakeFirstOrThrow()
    if (!hasPermission(userWPerm, options.resource, options.action)) {
      return response.unauthorized({ error: 'Unauthorized' })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
