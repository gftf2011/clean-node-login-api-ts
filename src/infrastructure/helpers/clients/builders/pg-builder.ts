/**
 * Driver
 */
import { Pool } from 'pg'

/**
 * Domain | Data
 */
import { IDbClientBuilder } from '@/data/protocols/db/builder'

export class PgClientBuilder implements IDbClientBuilder {
  private host?: string

  private port?: number

  private user?: string

  private pass?: string

  private db?: string

  private max?: number

  public setHost (): void {
    this.host = process.env.POSTGRES_HOST
  }

  public setPort (): void {
    const entryPort = process.env.POSTGRES_PORT
    this.port = entryPort ? +entryPort : 5432
  }

  public setUser (): void {
    this.user = process.env.POSTGRES_USER
  }

  public setPass (): void {
    this.pass = process.env.POSTGRES_PASSWORD
  }

  public setDb (): void {
    this.db = process.env.POSTGRES_DB
  }

  public setMax (): void {
    const maxConnections = process.env.POSTGRES_MAX
    this.max = maxConnections ? +maxConnections : 1
  }

  public build (): Pool {
    const result = new Pool({
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.pass,
      database: this.db,
      max: this.max
    })
    return result
  }
}
