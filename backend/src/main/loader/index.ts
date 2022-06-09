import { PostgresDbClientPool } from '@/infra/db'

export const loader = async (): Promise<any> => {
  PostgresDbClientPool.connect()
}
