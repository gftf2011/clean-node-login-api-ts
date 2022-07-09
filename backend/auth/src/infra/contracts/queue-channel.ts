export interface QueueChannel {
  send: (
    exchange: string,
    bindingKey: string,
    content: Buffer,
  ) => Promise<void>;
  close: () => Promise<void>;
}
