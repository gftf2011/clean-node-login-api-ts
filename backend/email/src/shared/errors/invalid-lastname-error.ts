import { Error400 } from './error-400';

export class InvalidLastnameError extends Error400 {
  constructor(lastname: string) {
    super(`The lastname '${lastname}' is not valid`);
    this.name = InvalidLastnameError.name;
  }
}
