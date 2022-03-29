export class InvalidTaxvatError extends Error {
  constructor (taxvat: string) {
    super(`The taxvat '${taxvat}' is not valid`)
    this.name = InvalidTaxvatError.name
  }
}
