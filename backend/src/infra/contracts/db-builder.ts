export interface IDbClientBuilder {
  setHost: (host: string) => void
  setPort: (port: string) => void
  setUser: (user: string) => void
  setPass: (pass: string) => void
  setDb: (db: string) => void
  setMax: (max: string) => void
}
