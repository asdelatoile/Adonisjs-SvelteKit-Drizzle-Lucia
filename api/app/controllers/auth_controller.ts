import type { HttpContext } from '@adonisjs/core/http'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { Argon2id } from 'oslo/password'
import mail from '@adonisjs/mail/services/main'
import VerifyEmailNotification from '#mails/verify_email_notification'
import ResetPasswordNotification from '#mails/reset_password_notification'
import string from '@adonisjs/core/helpers/string'

import dayjs from 'dayjs'
import Utc from 'dayjs/plugin/utc.js'

dayjs.extend(Utc)

export default class AuthController {
  async register({ db, request, response }: HttpContext) {
    const data = await vine
      .compile(
        vine.object({
          email: vine.string().trim().email(),
          password: vine.string().minLength(8).confirmed(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
          'email.email': 'The email must be a valid email address.',
          'unique': 'The {{ field }} has already been taken.',
          'password.minLength': 'The password must be atleast 8 characters.',
          'password.confirmed': 'The password confirmation does not match.',
        }),
      })

    const user = await db
      .selectFrom('users')
      .where('email', '=', data.email)
      .selectAll()
      .executeTakeFirst()

    if (user) {
      return response.unprocessableEntity({ error: 'The email has already been taken.' })
    }
    const hashedPassword = await new Argon2id().hash(data.password)

    const newUser = await db
      .insertInto('users')
      .values({
        email: data.email,
        hashedPassword,
      })
      .returning(['id', 'email'])
      .executeTakeFirstOrThrow()

    await mail.send(
      new VerifyEmailNotification({
        id: newUser.id,
        email: newUser.email,
      })
    )

    return {
      success: 'Please check your email inbox (and spam) for an access link.',
    }
  }

  async login({ db, lucia, request, response }: HttpContext) {
    const data = await vine
      .compile(
        vine.object({
          email: vine.string().trim().email(),
          password: vine.string(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
          'email.email': 'The email must be a valid email address.',
        }),
      })

    const user = await db
      .selectFrom('users')
      .where('email', '=', data.email)
      .selectAll()
      .executeTakeFirst()

    if (!user) {
      return response.badRequest({ error: 'Invalid email or password.' })
    }

    const validPassword = await new Argon2id().verify(user.hashedPassword, data.password)
    if (!validPassword) {
      return response.badRequest({ error: 'Invalid email or password.' })
    }

    const session = await lucia.createSession(user.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)

    return {
      token: sessionCookie.value,
    }
  }

  async verifyEmail({ db, params, request, response }: HttpContext) {
    if (!request.hasValidSignature()) {
      return response.unprocessableEntity({ error: 'Invalid verification link.' })
    }

    const email = decodeURIComponent(params.email)

    const user = await db
      .selectFrom('users')
      .where('email', '=', email)
      .selectAll()
      .executeTakeFirst()

    if (!user) {
      return response.unprocessableEntity({ error: 'Invalid verification link.' })
    }

    if (!user.emailVerifiedAt) {
      user.emailVerifiedAt = dayjs().utc().toDate()
      await db
        .updateTable('users')
        .set({
          emailVerifiedAt: dayjs().utc().toDate(),
        })
        .where('id', '=', user.id)
        .executeTakeFirst()
    }

    return { success: 'Email verified successfully.' }
  }

  async user({ auth }: HttpContext) {
    return { user: auth.user }
  }

  async forgotPassword({ db, request, response }: HttpContext) {
    const data = await vine
      .compile(
        vine.object({
          email: vine.string().trim().email(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
          'email.email': 'The email must be a valid email address.',
        }),
      })

    const user = await db
      .selectFrom('users')
      .where('email', '=', data.email)
      .selectAll()
      .executeTakeFirst()

    if (!user) {
      return response.unprocessableEntity({
        error: "We can't find a user with that e-mail address.",
      })
    }

    const resetPassword = string.random(64)

    await db
      .updateTable('users')
      .set({
        resetPassword,
      })
      .where('id', '=', user.id)
      .executeTakeFirst()

    await mail.send(new ResetPasswordNotification(user, resetPassword))

    return { success: 'Please check your email inbox (and spam) for a password reset link.' }
  }

  async resetPassword({ db, params, request, response }: HttpContext) {
    if (!request.hasValidSignature()) {
      return response.unprocessableEntity({ error: 'Invalid reset password link.' })
    }

    const user = await db
      .selectFrom('users')
      .where('resetPassword', '=', params.token)
      .selectAll()
      .executeTakeFirst()

    if (!user) {
      return response.unprocessableEntity({ error: 'Invalid reset password link.' })
    }

    const data = await vine
      .compile(
        vine.object({
          password: vine.string().minLength(8).confirmed(),
        })
      )
      .validate(request.all(), {
        messagesProvider: new SimpleMessagesProvider({
          'required': 'The {{ field }} field is required.',
          'password.minLength': 'The password must be atleast 8 characters.',
          'password.confirmed': 'The password confirmation does not match.',
        }),
      })

    const hashedPassword = await new Argon2id().hash(data.password)

    await db
      .updateTable('users')
      .set({
        hashedPassword,
      })
      .where('id', '=', user.id)
      .executeTakeFirst()

    return { success: 'Password reset successfully.' }
  }

  async logout({ lucia, auth, response }: HttpContext) {
    await lucia.invalidateSession(auth.session?.id)

    return response.noContent()
  }

  async resendVerificationEmail({ auth, response }: HttpContext) {
    if (auth.user!.emailVerifiedAt) {
      return response.unprocessableEntity({ error: 'Your email is already verified.' })
    }

    await mail.send(
      new VerifyEmailNotification({
        id: auth.user.id.toString(),
        email: auth.user.email,
      })
    )

    return {
      success: 'Please check your email inbox (and spam) for an access link.',
    }
  }
}
