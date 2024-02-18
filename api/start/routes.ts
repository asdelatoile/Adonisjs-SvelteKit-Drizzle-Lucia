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
const AuthController = () => import('#controllers/auth_controller')

router.get('/test', [AuthController, 'test'])

router.post('/auth/login', [AuthController, 'login'])
router.post('/auth/register', [AuthController, 'register'])
router.get('/auth/email/verify/:email/:id', [AuthController, 'verifyEmail']).as('verifyEmail')
router.post('/auth/password/forgot', [AuthController, 'forgotPassword'])
router.post('/auth/password/reset/:token', [AuthController, 'resetPassword']).as('resetPassword')

router
  .group(() => {
    router.get('/auth/user', [AuthController, 'user']).use(middleware.perm())
    router.post('/auth/logout', [AuthController, 'logout'])
    router.post('/auth/email/verify/resend', [AuthController, 'resendVerificationEmail'])
    router
      .group(() => {
        // routes which require verified email
      })
      .use(middleware.verifiedEmail())
  })
  .use(middleware.auth())
router
  .get('/', async () => {
    return { message: 'It works!' }
  })
  .use(middleware.auth())
