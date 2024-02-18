import { relations } from 'drizzle-orm'
import {
  pgTable,
  unique,
  uuid,
  text,
  timestamp,
  varchar,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    email: text('email').notNull(),
    hashedPassword: text('hashed_password').notNull(),
    resetPassword: text('reset_password'),
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

export const roles = pgTable(
  'roles',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name: text('name'),
  },
  (table) => {
    return {
      rolesNameKey: unique('roles_name_key').on(table.name),
    }
  }
)

export const permissions = pgTable(
  'permissions',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    action: varchar('action', { length: 50 }),
    resource: varchar('resource', { length: 50 }),
  },
  (table) => {
    return {
      permKey: unique('permissions_action_resource').on(table.action, table.resource),
    }
  }
)

export const usersRoles = pgTable(
  'users_roles',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id),
  },
  (table) => {
    return {
      userIdx: index('usersRoles_userId').on(table.userId),
      roleIdx: index('usersRoles_roleId').on(table.roleId),
      pk: primaryKey({ columns: [table.userId, table.roleId] }),
    }
  }
)

export const rolesPermissions = pgTable(
  'roles_permissions',
  {
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissions.id),
  },
  (table) => {
    return {
      roleIdx: index('rolesPermissions_roleId').on(table.roleId),
      permissionIdx: index('rolesPermissions_permissionId').on(table.permissionId),
      pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
    }
  }
)

export const usersRelations = relations(users, ({ many }) => ({
  roles: many(usersRoles),
}))
export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(usersRoles),
  permissions: many(rolesPermissions),
}))
export const usersRolesRelations = relations(usersRoles, ({ one }) => ({
  role: one(roles, {
    fields: [usersRoles.roleId],
    references: [roles.id],
  }),
  user: one(users, {
    fields: [usersRoles.userId],
    references: [users.id],
  }),
}))
export const permissionsRelations = relations(permissions, ({ many }) => ({
  roles: many(rolesPermissions),
}))
export const rolesPermissionsRelations = relations(rolesPermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolesPermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolesPermissions.permissionId],
    references: [permissions.id],
  }),
}))
