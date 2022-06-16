export interface IQueueBuilder {
  setHost: () => void
  setPort: () => void
  setUser: () => void
  setPass: () => void
  build: () => Promise<any>
}
