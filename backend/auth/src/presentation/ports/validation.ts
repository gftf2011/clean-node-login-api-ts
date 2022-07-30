export interface Validation {
  validate: (input: any) => Promise<void>;
}
