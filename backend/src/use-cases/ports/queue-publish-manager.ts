export interface QueuePublishManager {
  publish: (queue: string, content: string) => Promise<void>
  close: () => Promise<void>
}
