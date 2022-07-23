import { QueuePublishManager } from '../../../../../../src/use-cases/ports';

export class SendMessageToQueuePublishManagerStub
  implements QueuePublishManager
{
  publish(
    _exchange: string,
    _bindingKey: string,
    _content: string,
  ): Promise<void> {
    return {} as any;
  }

  close: () => Promise<void>;
}
