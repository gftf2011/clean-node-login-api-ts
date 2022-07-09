/**
 * Drivers
 */
import { Document, Filter, MongoClient } from 'mongodb';

/**
 * Infra
 */
// eslint-disable-next-line sort-imports
import { DbClient, DbQueryRunner } from '../../../contracts';

export class MongoDbInsertOneQueryRunnerStrategy implements DbQueryRunner {
  constructor(private readonly client: DbClient) {}

  public async execute(
    tableOrCollection: string,
    documentsAndFilters: {
      filters?: Filter<Document>;
      documents?: Document[];
    },
  ): Promise<any> {
    const { documents } = documentsAndFilters;
    const newClient: MongoClient = this.client;

    return newClient.db().collection(tableOrCollection).insertOne(documents[0]);
  }
}
