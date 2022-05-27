import { DbClientManager } from './db-client-manager'

export interface DbClientPool {
  getClientManager: () => Promise<DbClientManager>
}
