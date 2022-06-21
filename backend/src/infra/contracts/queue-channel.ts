export interface QueueChannel {
  send: (queue: string, content: Buffer) => Promise<void>
  closeAll: () => Promise<void>
}