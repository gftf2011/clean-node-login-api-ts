/**
 * Presentation
 */
import { HttpRequest, HttpResponse } from '../../ports';

/**
 * Use Cases
 */
import { ISignUpUseCase, UserDto } from '../../../use-cases/ports';

/**
 * Validation
 */
import {
  IValidator,
  TaxvatBlacklistValidation,
  Validation,
} from '../../../validation';

/**
 * Presentation
 */
import { WebController } from './web-controller';
import { created } from '../../helpers/http-helper';

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Contains the base algorithm and the concrete implementation from the perform method
 * It uses the {@link https://refactoring.guru/design-patterns/template-method Template Method} design pattern
 */
export class SignUpController extends WebController {
  private readonly signUpUseCase: ISignUpUseCase;

  private readonly validators: IValidator[];

  /**
   * @desc values overrides - ['host']
   */
  public override requiredHeaderParams: string[] = ['host'];

  /**
   * @desc values overrides - ['email', 'password', 'taxvat', 'name', 'lastname']
   */
  public override requiredParams: string[] = [
    'email',
    'password',
    'taxvat',
    'name',
    'lastname',
  ];

  constructor(signUpUseCase: ISignUpUseCase, validators: IValidator[]) {
    super();
    this.signUpUseCase = signUpUseCase;
    this.validators = validators;
  }

  /**
   * @desc loads sign-up fields validation
   * @param {UserDto} data - user data transfer object
   * @returns {Validation[]} array of validation objects
   */
  public override buildValidators(data: UserDto): Validation[] {
    const taxvatBlacklistValidation = new TaxvatBlacklistValidation(
      data.taxvat,
      this.validators[0],
    );
    return [taxvatBlacklistValidation];
  }

  /**
   * @desc performs an sign-up action
   * @param {HttpRequest} request - request that contains information about the 'client'
   * @returns {Promise<HttpResponse>} data output after sign-up operation
   */
  public async perform(request: HttpRequest): Promise<HttpResponse> {
    const response = await this.signUpUseCase.perform(
      request.body,
      request.headers.host,
    );

    if (response.isLeft()) {
      throw response.value;
    }

    return created(response.value);
  }
}
