import env from '#start/env'

const dbConfig = {
  databaseUrl: env.get('DATABASE_URL'),
  pool: 1,
}

export default dbConfig
