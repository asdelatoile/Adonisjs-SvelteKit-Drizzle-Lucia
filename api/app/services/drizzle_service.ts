import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import drizzleConfig from '#config/drizzle'
import * as schema from '#database/schema'

const queryClient = postgres(drizzleConfig.databaseUrl, { max: drizzleConfig.pool })
export const db = drizzle(queryClient, { schema })
