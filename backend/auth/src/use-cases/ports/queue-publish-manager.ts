export interface QueuePublishManager {
  publish: (
    exchange: string,
    bindingKey: string,
    content: string,
  ) => Promise<void>;
  close: () => Promise<void>;
}
