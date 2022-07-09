export interface DbClientManager {
  query: (
    operation: 'INSERT_ONE' | 'FIND_ONE',
    tableOrCollection: string,
    ...args: any
  ) => Promise<any>;
  createClient: () => Promise<void>;
  openTransaction: () => Promise<void>;
  closeTransaction: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
}
