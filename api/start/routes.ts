/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { db } from '#services/db'
import { getRolesPermissionsFromUsers, getSessionsFromUsers } from '#helpers/kysely'
const AuthController = () => import('#controllers/auth_controller')

router
  .group(() => {
    router.get('/', async () => {
      return { message: 'It works!' }
    })

    router.post('/auth/login', [AuthController, 'login'])
    router.post('/auth/register', [AuthController, 'register'])
    router.get('/auth/email/verify/:email/:id', [AuthController, 'verifyEmail']).as('verifyEmail')
    router.post('/auth/password/forgot', [AuthController, 'forgotPassword'])
    router
      .post('/auth/password/reset/:token', [AuthController, 'resetPassword'])
      .as('resetPassword')

    router
      .group(() => {
        // router.get('/auth/user', [AuthController, 'user'])
        router.post('/auth/logout', [AuthController, 'logout'])
        router.post('/auth/email/verify/resend', [AuthController, 'resendVerificationEmail'])
        router
          .group(() => {
            // routes which require verified email
            router.get('/auth/user', [AuthController, 'user'])
          })
          .use(middleware.verifiedEmail())
      })
      .use(middleware.auth())
    router
      .get('/test', async () => {
        return {
          message: 'Ok',
        }
      })
      .use([
        middleware.auth(),
        middleware.checkperm({
          resource: 'auth',
          action: 'me',
        }),
      ])
    router
      .get('/test2', async () => {
        const records = await db
          .selectFrom('users')
          .select((qb) => [
            'id',
            'email',
            'createdAt',
            'updatedAt',
            getSessionsFromUsers(qb),
            getRolesPermissionsFromUsers(qb),
          ])
          .execute()

        return {
          message: 'It works!',
          records,
        }
      })
      .use([
        middleware.auth(),
        middleware.checkperm({
          resource: 'users',
          action: 'list',
        }),
      ])
  })
  .prefix('/api')
