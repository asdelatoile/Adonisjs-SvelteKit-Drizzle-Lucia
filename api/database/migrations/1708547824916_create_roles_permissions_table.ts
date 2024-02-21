import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('roles_permissions')
    .addColumn('role_id', 'uuid', (col) =>
      col.references('roles.id').onDelete('no action').notNull()
    )
    .addColumn('permission_id', 'uuid', (col) =>
      col.references('permissions.id').onDelete('no action').notNull()
    )
    .execute()

  await db.schema
    .createIndex('roles_permissions_permission_id_index')
    .on('roles_permissions')
    .column('permission_id')
    .execute()
  await db.schema
    .createIndex('roles_permissions_role_id_index')
    .on('roles_permissions')
    .column('role_id')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('roles_permissions').execute()
}
