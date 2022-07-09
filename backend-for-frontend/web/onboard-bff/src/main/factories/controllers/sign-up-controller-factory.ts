/**
 * Infra
 */
import { AxiosHttpAuthService } from '../../../infra/services';

/**
 * Presentation
 */
import { Controller } from '../../../presentation/ports';
import { SignUpController } from '../../../presentation/controllers';

/**
 * Use Cases
 */
import { SignUpUseCase } from '../../../use-cases';

export const makeSignUpController = (): Controller => {
  const axiosHttpAuthService = new AxiosHttpAuthService();

  const signUpUseCase = new SignUpUseCase(axiosHttpAuthService);

  const signUpController = new SignUpController(signUpUseCase);

  return signUpController;
};
