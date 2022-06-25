export interface IDbClientBuilder {
  setHost: () => void
  setPort: () => void
  setUser: () => void
  setPass: () => void
  setDb: () => void
  setMax: () => void
  build: () => any
}
