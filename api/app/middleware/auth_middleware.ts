import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    if (!auth.isAuthenticated) {
      response.unauthorized({ error: 'Forbidden' })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
