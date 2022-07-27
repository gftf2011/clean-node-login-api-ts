export interface Dao<T> {
  execute: (...args: any[]) => Promise<T>;
}
