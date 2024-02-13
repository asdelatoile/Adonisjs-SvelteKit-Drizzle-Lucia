import { pgTable, unique, uuid, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    email: text('email').notNull(),
    hashedPassword: text('hashed_password').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true, mode: 'date' }),
  },
  (table) => {
    return {
      usersEmailKey: unique('users_email_key').on(table.email),
    }
  }
)

export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 40 }).primaryKey().notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
})
