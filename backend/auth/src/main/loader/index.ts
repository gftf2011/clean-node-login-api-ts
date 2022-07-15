import { PostgresDbClientPool } from '../../infra/db';
import { RabbitmqQueueConnection } from '../../infra/queue';

export const loader = async (): Promise<any> => {
  await PostgresDbClientPool.connect();
  await RabbitmqQueueConnection.connect();
};
