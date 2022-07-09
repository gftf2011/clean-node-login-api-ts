import { Error400 } from './error-400';

export class MissingHeaderParamsError extends Error400 {
  constructor(parameters: string[]) {
    super(`Header parameters are missing: [${parameters.join(', ')}]`);
    this.name = MissingHeaderParamsError.name;
  }
}
