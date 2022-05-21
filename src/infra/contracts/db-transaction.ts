export interface DbTransaction {
  client: () => Promise<any>
  openTransaction: (client: any) => Promise<void>
  transaction: (client: any, statement: string, values: any[]) => Promise<any>
  closeTransaction: (client: any) => Promise<void>
  commit: (client: any) => Promise<void>
  rollback: (client: any) => Promise<void>
}

export type DbClient = DbTransaction
