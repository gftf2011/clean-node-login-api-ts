/**
 * Infra
 */
import { DbClientManager, IListBlacklistTaxvatDao } from '../contracts';

interface Row {
  id: string;
  value: string;
}

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
