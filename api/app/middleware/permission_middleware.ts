import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { eq } from 'drizzle-orm'

export default class PermissionMiddleware {
  async handle({ auth, response, drizzle }: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    if (!auth.isAuthenticated) {
      return response.unauthorized({ error: 'Forbidden' })
    }

    const userWithPermissions = await drizzle.query.users.findFirst({
      where: (users) => eq(users.email, auth.user?.email || ''),
      with: {
        roles: {
          columns: {},
          with: {
            role: {
              columns: { name: true },
              with: {
                permissions: {
                  columns: {},
                  with: {
                    permission: {
                      columns: { resource: true, action: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (userWithPermissions && auth.user) {
      auth.user.permissions = userWithPermissions?.roles
        .map((roles) => roles.role.permissions.map((permission) => permission.permission))
        .reduce((acc, current) => {
          return acc.concat(current)
        }, [])
        .filter(
          (perm, index, self) =>
            index ===
            self.findIndex((p) => p.resource === perm.resource && p.action === perm.action)
        )
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
