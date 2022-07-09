import { MongoDbClientPool } from '../../infra/db';

export const loader = async (): Promise<any> => {
  await MongoDbClientPool.connect();
};
