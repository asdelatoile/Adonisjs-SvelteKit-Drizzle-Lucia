import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('roles')
    .addColumn('id', 'uuid', (col) =>
      col
        .primaryKey()
        .defaultTo(sql`gen_random_uuid()`)
        .notNull()
        .unique()
    )
    .addColumn('name', 'varchar(128)', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('roles').execute()
}
