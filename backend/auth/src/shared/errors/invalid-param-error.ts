import { Error400 } from './error-400';

export class InvalidParamError extends Error400 {
  constructor(parameter: string) {
    super(`Parameter: ${parameter} is invalid`);
    this.name = InvalidParamError.name;
  }
}
