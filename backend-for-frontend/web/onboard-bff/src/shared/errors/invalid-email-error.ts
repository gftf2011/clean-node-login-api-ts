import { Error400 } from './error-400';

export class InvalidEmailError extends Error400 {
  constructor(email: string) {
    super(`The email '${email}' is not valid`);
    this.name = InvalidEmailError.name;
  }
}
