import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('permissions')
    .addColumn('id', 'uuid', (col) =>
      col
        .primaryKey()
        .defaultTo(sql`gen_random_uuid()`)
        .notNull()
    )
    .addColumn('action', 'varchar(128)', (col) => col.notNull())
    .addColumn('resource', 'varchar(128)')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('permissions').execute()
}
