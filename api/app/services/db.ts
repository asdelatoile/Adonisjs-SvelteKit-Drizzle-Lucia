import { DB } from './types.js'
import pg from 'pg'
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import dbConfig from '#config/db'

export const pool = new pg.Pool({
  connectionString: dbConfig.databaseUrl,
  max: 10,
})

const dialect = new PostgresDialect({
  pool,
})

export const db = new Kysely<DB>({
  dialect,
  plugins: [new CamelCasePlugin()],
})
