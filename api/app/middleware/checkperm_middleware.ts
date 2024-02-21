import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CheckpermMiddleware {
  async handle({ response, auth }: HttpContext, next: NextFn, options: { r: string; a: string }) {
    /**
     * Middleware logic goes here (before the next call)
     */
    if (!auth.isAuthenticated) {
      return response.unauthorized({ error: 'Forbidden' })
    }

    console.log('options', options)

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
