import { QueueChannel } from './queue-channel';

export interface QueueConnection {
  getChannel: () => QueueChannel;
}
