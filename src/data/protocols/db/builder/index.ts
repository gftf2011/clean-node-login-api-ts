export interface IDbClientBuilder {
  setHost: () => void
  setPort: () => void
  setUser: () => void
  setPass: () => void
  setDb: () => void
  setMax: () => void
}

export interface IDbDirector {
  setBuilder: (builder: IDbClientBuilder) => void
  build: () => void
}
