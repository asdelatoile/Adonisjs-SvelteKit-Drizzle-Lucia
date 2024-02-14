import scheduler from 'adonisjs-scheduler/services/main'
import deleteExpiredSessions from '../commands/delete_expired_sessions.js'

scheduler.command(deleteExpiredSessions).daily()
