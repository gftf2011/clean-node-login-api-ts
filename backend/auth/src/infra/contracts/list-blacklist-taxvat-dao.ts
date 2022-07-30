/**
 * Infra
 */
import { Dao } from './dao';

export interface IListBlacklistTaxvatDao extends Dao<string[]> {
  execute: () => Promise<string[]>;
}
