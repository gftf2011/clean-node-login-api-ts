import { QueuePublishManager } from '../../../../../../src/use-cases/ports';

export class SendMessageToQueuePublishManagerSpy
  implements QueuePublishManager
{
  private countMessagesSent = 0;

  public getCountMessagesSent(): number {
    return this.countMessagesSent;
  }

  publish(
    _exchange: string,
    _bindingKey: string,
    _content: string,
  ): Promise<void> {
    this.countMessagesSent++;
    return {} as any;
  }

  close: () => Promise<void>;
}
