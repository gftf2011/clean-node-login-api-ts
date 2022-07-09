import { Error400 } from './error-400';

export class InvalidTaxvatError extends Error400 {
  constructor(taxvat: string) {
    super(`The taxvat '${taxvat}' is not valid`);
    this.name = InvalidTaxvatError.name;
  }
}
