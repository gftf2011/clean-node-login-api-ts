export type QueueChannel = {
  send: (queue: string, content: Buffer) => void
}
