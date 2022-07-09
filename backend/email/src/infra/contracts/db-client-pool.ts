import { DbClient } from './db-client';

export interface DbClientPool {
  getClient: () => Promise<DbClient>;
}
