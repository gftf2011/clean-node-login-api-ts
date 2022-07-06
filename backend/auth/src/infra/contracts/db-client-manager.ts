export interface DbClientManager {
  query: (statement: string, values: any[]) => Promise<any>
  createClient: () => Promise<void>
  openTransaction: () => Promise<void>
  closeTransaction: () => Promise<void>
  commit: () => Promise<void>
  rollback: () => Promise<void>
}
