import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users_roles')
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('no action').notNull()
    )
    .addColumn('role_id', 'uuid', (col) =>
      col.references('roles.id').onDelete('no action').notNull()
    )
    .execute()

  await db.schema
    .createIndex('users_roles_user_id_index')
    .on('users_roles')
    .column('user_id')
    .execute()
  await db.schema
    .createIndex('users_roles_role_id_index')
    .on('users_roles')
    .column('role_id')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users_roles').execute()
}
