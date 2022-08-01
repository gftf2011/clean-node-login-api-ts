export interface IValidator {
  isValid: (...args: any[]) => Promise<any>;
}
