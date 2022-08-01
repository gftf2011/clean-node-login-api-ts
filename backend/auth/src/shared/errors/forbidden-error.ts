import { Error403 } from './error-403';

export class ForbiddenError extends Error403 {
  constructor() {
    super('Forbidden to access resource');
    this.name = ForbiddenError.name;
  }
}
