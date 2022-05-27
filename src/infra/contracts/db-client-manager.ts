import { DbQuery } from './db-query'

export interface DbClientManager {
  query: () => DbQuery
  openTransaction: () => Promise<void>
  closeTransaction: () => Promise<void>
  commit: () => Promise<void>
  rollback: () => Promise<void>
}
