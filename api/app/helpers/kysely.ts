import { DB } from '#database/types'
import { ExpressionBuilder } from 'kysely'
import { jsonArrayFrom } from 'kysely/helpers/postgres'

export const getRolesPermissionsFromUsers = (
  qb: ExpressionBuilder<DB, 'users' | 'roles' | 'usersRoles' | 'rolesPermissions'>
) =>
  jsonArrayFrom(
    qb
      .selectFrom('usersRoles')
      .select((qb2) => [
        jsonArrayFrom(
          qb2
            .selectFrom('roles')
            .select((qb3) => [
              'roles.name',
              jsonArrayFrom(
                qb3
                  .selectFrom('rolesPermissions')
                  .select((qb4) => [
                    jsonArrayFrom(
                      qb4
                        .selectFrom('permissions')
                        .select(['permissions.action', 'permissions.resource'])
                        .whereRef('rolesPermissions.permissionId', '=', 'permissions.id')
                    ).as('permission'),
                  ])
                  .whereRef('rolesPermissions.roleId', '=', 'roles.id')
              ).as('permissions'),
            ])
            .whereRef('usersRoles.roleId', '=', 'roles.id')
        ).as('role'),
      ])
      .whereRef('usersRoles.userId', '=', 'users.id')
  ).as('roles')

export const getSessionsFromUsers = (
  qb: ExpressionBuilder<DB, 'users' | 'roles' | 'usersRoles' | 'rolesPermissions'>
) =>
  jsonArrayFrom(
    qb
      .selectFrom('sessions')
      .select(['sessions.id', 'sessions.expiresAt'])
      .whereRef('sessions.userId', '=', 'users.id')
      .orderBy('sessions.id')
  ).as('sessions')
