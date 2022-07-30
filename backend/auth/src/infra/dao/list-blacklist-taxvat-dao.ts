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
    /**
     * TODO: Create Taxvat Schema
     */
    const statement = 'SELECT * FROM taxvat_schema.blacklist';

    const values: any[] = [];

    const response = await this.dbClientManager.query(statement, values);
    const parsedResponse: string[] = response.rows[0]
      ? (response.rows as Row[]).map((item: Row) => item.value)
      : undefined;
    return parsedResponse;
  }
}
