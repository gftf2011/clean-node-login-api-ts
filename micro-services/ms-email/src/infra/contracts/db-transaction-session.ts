import { DbSession } from './db-session'

export interface DbTransactionSession {
  getSession: () => Promise<DbSession>
}
