export interface DbQueryRunner {
  execute: (tableOrCollection: string, ...args: any) => Promise<any>
}
