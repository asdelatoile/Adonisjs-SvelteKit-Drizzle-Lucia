import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { Argon2id } from 'oslo/password'
import { db, queryClient } from '#services/drizzle_service'
import { users, roles, permissions, rolesPermissions, usersRoles } from '#database/schema'
import dayjs from 'dayjs'
import Utc from 'dayjs/plugin/utc.js'
import { sql } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
dayjs.extend(Utc)

export default class DbSeed extends BaseCommand {
  static commandName = 'db:seed'
  static description = 'Custom seeding'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Start seeding')

    // Truncate all tables
    const listTablesQuery = sql.raw(
      `SELECT tablename FROM pg_tables WHERE tablename NOT LIKE'pg_%' AND tablename NOT LIKE'sql_%' AND schemaname = 'public'`
    )
    const records = await db.execute(listTablesQuery)
    await records.reduce(async (a, element) => {
      const deleteUsersTable = sql.raw(`TRUNCATE ${element.tablename} CASCADE;`)
      await db.execute(deleteUsersTable)
      this.logger.info(`Truncate ${element.tablename}`)
      await a
    }, Promise.resolve())

    // Add Users
    const hashedPassword = await new Argon2id().hash('demo1234')
    const emailVerifiedAt = dayjs().utc().toDate()
    const newUser = await db
      .insert(users)
      .values([
        {
          email: 'test@test.com',
          hashedPassword,
          emailVerifiedAt,
        },
      ])
      .returning()
    this.logger.info(`Add Users (${newUser.length})`)

    // Add Roles
    const rolesInsert = await db
      .insert(roles)
      .values([
        {
          id: randomUUID(),
          name: 'ADMIN',
        },
        {
          id: randomUUID(),
          name: 'GUEST',
        },
      ])
      .returning()
    this.logger.info(`Add Roles (${rolesInsert.length})`)

    // Add Permissions
    const permissionsInsert = await db
      .insert(permissions)
      .values([
        {
          id: randomUUID(),
          resource: 'auth',
          action: 'me',
        },
        {
          id: randomUUID(),
          resource: 'users',
          action: 'list',
        },
      ])
      .returning()
    this.logger.info(`Add Permissions (${permissionsInsert.length})`)

    // Add Relations
    await db
      .insert(rolesPermissions)
      .values({ roleId: rolesInsert[0].id, permissionId: permissionsInsert[0].id })
    await db
      .insert(rolesPermissions)
      .values({ roleId: rolesInsert[0].id, permissionId: permissionsInsert[1].id })
    await db
      .insert(rolesPermissions)
      .values({ roleId: rolesInsert[1].id, permissionId: permissionsInsert[0].id })
    await db.insert(usersRoles).values([
      {
        roleId: rolesInsert[0].id,
        userId: newUser[0].id,
      },
      {
        roleId: rolesInsert[1].id,
        userId: newUser[0].id,
      },
    ])
    this.logger.info(`Add Relations`)

    queryClient.end()
    this.logger.info('Ok')
  }
}
