import { Postgres } from '@/infra/db'

export const loader = async (): Promise<any> => {
  Postgres.connect()
}
