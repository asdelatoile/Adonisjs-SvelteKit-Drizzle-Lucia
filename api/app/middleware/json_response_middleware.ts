import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class JsonResponseMiddleware {
  async handle({ request }: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const headers = request.headers()
    headers.accept = 'application/json'
    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
