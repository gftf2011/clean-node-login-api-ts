export interface ITaxvatBlacklistValidator {
  isValid: (taxvat: string) => Promise<boolean>;
}
