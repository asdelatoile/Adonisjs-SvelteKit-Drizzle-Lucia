import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { db } from '#services/db'
import { Argon2id } from 'oslo/password'
import { dayjsUtc } from '#helpers/dayjs'

export default class KyselySeed extends BaseCommand {
  static commandName = 'kysely:seed'
  static description = 'Database seeding'

  static options: CommandOptions = {
    startApp: true,
  }

  /**
   * The complete lifecycle hook runs after the "run" method
   * and hence, we use it to close the data connection.
   */
  async completed() {
    await db.destroy()
  }

  async run() {
    try {
      await db.deleteFrom('rolesPermissions').execute()
      this.logger.success(`Truncate roles_permissions`)

      await db.deleteFrom('permissions').execute()
      this.logger.success(`Truncate permissions`)

      await db.deleteFrom('usersRoles').execute()
      this.logger.success(`Truncate users_roles`)

      await db.deleteFrom('roles').execute()
      this.logger.success(`Truncate roles`)

      await db.deleteFrom('sessions').execute()
      this.logger.success(`Truncate sessions`)

      await db.deleteFrom('users').execute()
      this.logger.success(`Truncate users`)

      const insertPermissions = await db
        .insertInto('permissions')
        .values([
          {
            resource: 'auth',
            action: '*',
          },
          {
            resource: 'users',
            action: '*',
          },
          {
            resource: 'users',
            action: 'list',
          },
        ])
        .returningAll()
        .execute()
      this.logger.success(`Add permissions`)

      const insertRoles = await db
        .insertInto('roles')
        .values([
          {
            name: 'Admin',
          },
          {
            name: 'Guest',
          },
        ])
        .returningAll()
        .execute()
      this.logger.success(`Add roles`)

      await db
        .insertInto('rolesPermissions')
        .values([
          {
            roleId: insertRoles[0].id,
            permissionId: insertPermissions[0].id,
          },
          {
            roleId: insertRoles[0].id,
            permissionId: insertPermissions[1].id,
          },
          {
            roleId: insertRoles[1].id,
            permissionId: insertPermissions[0].id,
          },
          {
            roleId: insertRoles[1].id,
            permissionId: insertPermissions[2].id,
          },
        ])
        .execute()
      this.logger.success(`Add roles_permissions`)

      const hashedPassword = await new Argon2id().hash('demo1234')
      const insertUsers = await db
        .insertInto('users')
        .values([
          {
            email: 'admin@test.com',
            hashedPassword,
            emailVerifiedAt: dayjsUtc().toDate(),
          },
          {
            email: 'test@test.com',
            hashedPassword,
            emailVerifiedAt: dayjsUtc().toDate(),
          },
        ])
        .returningAll()
        .execute()
      this.logger.success(`Add users`)

      await db
        .insertInto('usersRoles')
        .values([
          {
            userId: insertUsers[0].id,
            roleId: insertRoles[0].id,
          },
          {
            userId: insertUsers[1].id,
            roleId: insertRoles[1].id,
          },
        ])
        .execute()
      this.logger.success(`Add users_roles`)
    } catch (error) {
      this.logger.error('Failed to seed')
      this.error = error
      this.exitCode = 1
    }
  }
}
