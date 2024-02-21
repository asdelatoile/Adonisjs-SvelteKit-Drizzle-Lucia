import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (col) =>
      col
        .primaryKey()
        .defaultTo(sql`gen_random_uuid()`)
        .notNull()
    )
    .addColumn('email', 'varchar(255)', (col) => col.unique().notNull())
    .addColumn('hashed_password', 'varchar(255)', (col) => col.notNull())
    .addColumn('reset_password', 'varchar(255)')
    .addColumn('email_verified_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute()
}
