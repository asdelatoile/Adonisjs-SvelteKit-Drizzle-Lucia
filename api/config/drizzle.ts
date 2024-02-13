import env from '#start/env'

const drizzleConfig = {
  databaseUrl: env.get('DATABASE_URL'),
  pool: 1,
}

export default drizzleConfig
