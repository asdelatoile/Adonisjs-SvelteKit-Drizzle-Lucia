import type { HttpContext } from '@adonisjs/core/http'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { eq } from 'drizzle-orm'
import { Argon2id } from 'oslo/password'
import { takeUniqueOrNull } from '#helpers/database'
import mail from '@adonisjs/mail/services/main'
import VerifyEmailNotification from '#mails/verify_email_notification'
import ResetPasswordNotification from '#mails/reset_password_notification'
import string from '@adonisjs/core/helpers/string'

import dayjs from 'dayjs'
import Utc from 'dayjs/plugin/utc.js'
dayjs.extend(Utc)

export default class AuthController {
  async register({ request, response, drizzle, models }: HttpContext) {
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

    const user = await drizzle
      .select()
      .from(models.users)
      .where(eq(models.users.email, data.email))
      .then(takeUniqueOrNull)

    if (user) {
      return response.unprocessableEntity({ error: 'The email has already been taken.' })
    }
    const hashedPassword = await new Argon2id().hash(data.password)

    const newUser = await drizzle
      .insert(models.users)
      .values({
        email: data.email,
        hashedPassword,
      })
      .returning()

    await mail.send(new VerifyEmailNotification(newUser[0]))

    return {
      success: 'Please check your email inbox (and spam) for an access link.',
    }
  }

  async login({ lucia, drizzle, request, response, models }: HttpContext) {
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

    const user = await drizzle
      .select()
      .from(models.users)
      .where(eq(models.users.email, data.email))
      .then(takeUniqueOrNull)

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

  async verifyEmail({ drizzle, models, params, request, response }: HttpContext) {
    if (!request.hasValidSignature()) {
      return response.unprocessableEntity({ error: 'Invalid verification link.' })
    }

    const email = decodeURIComponent(params.email)
    const user = await drizzle
      .select()
      .from(models.users)
      .where(eq(models.users.email, email))
      .then(takeUniqueOrNull)

    if (!user) {
      return response.unprocessableEntity({ error: 'Invalid verification link.' })
    }

    if (!user.emailVerifiedAt) {
      user.emailVerifiedAt = dayjs().utc().toDate()
      await drizzle
        .update(models.users)
        .set({ emailVerifiedAt: dayjs().utc().toDate() })
        .where(eq(models.users.id, user.id))
    }

    return { success: 'Email verified successfully.' }
  }

  async user({ auth }: HttpContext) {
    return { user: auth.user }
  }

  async forgotPassword({ request, response, drizzle, models }: HttpContext) {
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

    const user = await drizzle
      .select()
      .from(models.users)
      .where(eq(models.users.email, data.email))
      .then(takeUniqueOrNull)

    if (!user) {
      return response.unprocessableEntity({
        error: "We can't find a user with that e-mail address.",
      })
    }

    const resetPassword = string.random(64)
    await drizzle.update(models.users).set({ resetPassword }).where(eq(models.users.id, user.id))

    await mail.send(new ResetPasswordNotification(user, resetPassword))

    return { success: 'Please check your email inbox (and spam) for a password reset link.' }
  }

  async resetPassword({ params, request, response, drizzle, models }: HttpContext) {
    if (!request.hasValidSignature()) {
      return response.unprocessableEntity({ error: 'Invalid reset password link.' })
    }

    const user = await drizzle
      .select()
      .from(models.users)
      .where(eq(models.users.resetPassword, params.token))
      .then(takeUniqueOrNull)

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
    await drizzle.update(models.users).set({ hashedPassword }).where(eq(models.users.id, user.id))

    return { success: 'Password reset successfully.' }
  }
}
