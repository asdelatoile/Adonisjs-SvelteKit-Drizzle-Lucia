import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('sessions')
    .addColumn('id', 'varchar(40)', (col) => col.primaryKey().notNull())
    .addColumn('user_id', 'uuid', (col) => col.references('users.id').onDelete('cascade').notNull())
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
    .execute()

  await db.schema.createIndex('sessions_user_id_index').on('sessions').column('user_id').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('sessions').execute()
}
