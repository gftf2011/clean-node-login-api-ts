import { Error503 } from './error-503';

export class ServiceUnavailableError extends Error503 {
  constructor() {
    super('Resource is not available');
    this.name = ServiceUnavailableError.name;
  }
}
