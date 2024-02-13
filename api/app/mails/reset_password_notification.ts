import env from '#start/env'
import router from '@adonisjs/core/services/router'
import { BaseMail } from '@adonisjs/mail'
import { users } from '#database/schema'

export default class ResetPasswordNotification extends BaseMail {
  from = env.get('MAIL_FROM')
  subject = 'Reset Password Notification'

  constructor(private user: typeof users.$inferSelect) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    const signedURL = router
      .builder()
      .prefixUrl(env.get('API_URL'))
      .params({ id: this.user.id, token: encodeURIComponent(this.user.hashedPassword) })
      .makeSigned('resetPassword', {
        expiresIn: '30 minutes',
      })

    const url = `${env.get('PASSWORD_RESET_PAGE_URL')}?token=${encodeURIComponent(signedURL)}`

    this.message.to(this.user.email).htmlView('emails/reset_password', { url })
  }
}
