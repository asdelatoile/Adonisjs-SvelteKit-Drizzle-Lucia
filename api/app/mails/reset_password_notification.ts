// import { Users } from '#services/types'
import env from '#start/env'
import router from '@adonisjs/core/services/router'
import { BaseMail } from '@adonisjs/mail'

export default class ResetPasswordNotification extends BaseMail {
  from = env.get('MAIL_FROM')
  subject = 'Reset Password Notification'

  constructor(
    private user: {
      email: string
      resetPassword: string | null
    },
    private resetPassword: string
  ) {
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
      .params({ token: this.resetPassword })
      .makeSigned('resetPassword', {
        expiresIn: '30 minutes',
      })

    const url = `${env.get('PASSWORD_RESET_PAGE_URL')}?token=${encodeURIComponent(signedURL)}`

    this.message.to(this.user.email).htmlView('emails/reset_password', { url })
  }
}
