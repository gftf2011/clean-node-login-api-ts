import { Request } from './request';

export interface Controller {
  handle: (request: Request) => Promise<boolean | Error>;
}
