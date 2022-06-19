export interface IEmailTransporterBuilder {
  setHost: () => void
  setPort: () => void
  setUser: () => void
  setPass: () => void
  build: () => any
}
