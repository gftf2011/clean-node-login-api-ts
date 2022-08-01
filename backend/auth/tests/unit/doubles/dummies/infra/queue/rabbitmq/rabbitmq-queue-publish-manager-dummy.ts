import { QueuePublishManager } from '../../../../../../../src/use-cases/ports';

export class RabbitmqQueuePublishManagerDummy implements QueuePublishManager {
  publish: (
    exchange: string,
    bindingKey: string,
    content: string,
  ) => Promise<void>;

  close: () => Promise<void>;
}
