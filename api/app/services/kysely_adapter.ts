import { DB } from '#services/types'
import { Kysely } from 'kysely'
import type {
  Adapter,
  DatabaseSession,
  RegisteredDatabaseSessionAttributes,
  DatabaseUser,
  RegisteredDatabaseUserAttributes,
} from 'lucia'

export class KyselyAdapter implements Adapter {
  private db: Kysely<DB>

  constructor(db: Kysely<DB>) {
    this.db = db
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.db.deleteFrom('sessions').where('sessions.id', '=', sessionId).execute()
  }

  async deleteUserSessions(userId: string): Promise<void> {
    await this.db.deleteFrom('sessions').where('userId', '=', userId).execute()
  }

  async getSessionAndUser(
    sessionId: string
  ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
    const [databaseSession, databaseUser] = await Promise.all([
      this.getSession(sessionId),
      this.getUserFromSessionId(sessionId),
    ])
    return [databaseSession, databaseUser]
  }

  async getUserSessions(userId: string): Promise<DatabaseSession[]> {
    const result = await this.db
      .selectFrom('sessions')
      .selectAll()
      .where('userId', '=', userId)
      .execute()
    return result.map((val) => {
      return transformIntoDatabaseSession(val)
    })
  }

  async setSession(databaseSession: DatabaseSession): Promise<void> {
    const value: SessionSchema = {
      id: databaseSession.id,
      userId: databaseSession.userId,
      expiresAt: databaseSession.expiresAt,
      ...databaseSession.attributes,
    }
    await this.db.insertInto('sessions').values(value).execute()
  }

  async updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void> {
    await this.db
      .updateTable('sessions')
      .set({
        expiresAt: expiresAt,
      })
      .where('id', '=', sessionId)
      .execute()
  }

  async deleteExpiredSessions(): Promise<void> {
    await this.db.deleteFrom('sessions').where('expiresAt', '<=', new Date()).execute()
  }

  private async getSession(sessionId: string): Promise<DatabaseSession | null> {
    const result = await this.db
      .selectFrom('sessions')
      .selectAll()
      .where('id', '=', sessionId)
      .executeTakeFirst()
    if (!result) return null
    return transformIntoDatabaseSession(result)
  }

  private async getUserFromSessionId(sessionId: string): Promise<DatabaseUser | null> {
    const result = await this.db
      .selectFrom('sessions')
      .innerJoin('users', 'users.id', 'sessions.userId')
      .selectAll('users')
      .where('sessions.id', '=', sessionId)
      .executeTakeFirst()
    if (!result) return null
    return transformIntoDatabaseUser(result)
  }
}

interface SessionSchema extends RegisteredDatabaseSessionAttributes {
  id: string
  userId: string
  expiresAt: Date
}

interface UserSchema extends RegisteredDatabaseUserAttributes {
  id: string
}

function transformIntoDatabaseSession(raw: SessionSchema): DatabaseSession {
  const { id, userId: userId, expiresAt: expiresAt, ...attributes } = raw
  return {
    userId,
    id,
    expiresAt,
    attributes,
  }
}

function transformIntoDatabaseUser(raw: UserSchema): DatabaseUser {
  const { id, ...attributes } = raw
  return {
    id,
    attributes,
  }
}
