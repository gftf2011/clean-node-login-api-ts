export interface IQueueBuilder {
  setHost: (host: string) => void
  setPort: (port: string) => void
  setUser: (user: string) => void
  setPass: (pass: string) => void
  build: () => Promise<any>
}
