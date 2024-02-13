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

router.post('/auth/login', [AuthController, 'login'])
router.post('/auth/register', [AuthController, 'register'])
router.get('/auth/email/verify/:email/:id', [AuthController, 'verifyEmail']).as('verifyEmail')

router
  .group(() => {
    router.get('/auth/user', [AuthController, 'user'])
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
