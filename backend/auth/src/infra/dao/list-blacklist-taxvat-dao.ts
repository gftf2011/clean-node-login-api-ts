/**
 * Infra
 */
import { DbClientManager, IListBlacklistTaxvatDao } from '../contracts';

interface Row {
  id: string;
  value: string;
}
/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Data persistence abstraction, lower to data storage system
 * It uses the {@link https://www.tutorialspoint.com/design_pattern/data_access_object_pattern.htm Data Access Object} Design Pattern
 */
export class ListBlacklistTaxvatDao implements IListBlacklistTaxvatDao {
  constructor(private readonly dbClientManager: DbClientManager) {}

  async execute(): Promise<string[]> {
    const statement = 'SELECT * FROM taxvats_schema.taxvat_blacklist';

    const values: any[] = [];

    const response = await this.dbClientManager.query(statement, values);
    const parsedResponse: string[] = response.rows[0]
      ? (response.rows as Row[]).map((item: Row) => item.value)
      : undefined;
    return parsedResponse;
  }
}
