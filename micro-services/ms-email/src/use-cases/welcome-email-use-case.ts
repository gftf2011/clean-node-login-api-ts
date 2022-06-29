/**
 * Use Cases
 */
import {
  BasicUserDto,
  EmailOptions,
  EmailService,
  EmailTemplate,
  IUserRepository,
  IWelcomeEmailUseCase,
  OAuth2Service,
  UserDto,
} from './ports'

/**
 * Shared
 */
import { Either, left, right } from '../shared'
import { ServerError, UserAlreadyExistsError } from '../shared/errors'

/**
 * Entities
 */
import { UserEntity } from '../entities'

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Contains the logic to send an email after user sign up
 */
export class WelcomeEmailUseCase implements IWelcomeEmailUseCase {
  constructor(
    private readonly emailService: EmailService,
    private readonly emailTemplate: EmailTemplate,
    private readonly oAuthService: OAuth2Service,
    private readonly userRepository: IUserRepository
  ) {}

  /**
   * @desc Performs the main logic to send the user`s welcoming email
   * @param {BasicUserDto} request - user data from input
   * @returns {Promise<Either<Error, any>>} output from email service response
   */
  async perform(request: BasicUserDto): Promise<Either<Error, any>> {
    if (
      !process.env.NODEMAILER_OAUTH_CLIENT_ID ||
      !process.env.NODEMAILER_OAUTH_CLIENT_SECRET ||
      !process.env.NODEMAILER_OAUTH_REDIRECT_URL ||
      !process.env.NODEMAILER_OAUTH_REFRESH_TOKEN
    ) {
      return left(new ServerError())
    }

    const { email, lastname, name } = request

    const userOrError: Either<Error, UserEntity> = UserEntity.create(
      name,
      lastname,
      email
    )

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    const userExists = await this.userRepository.findUserByEmail(email)

    if (userExists) {
      return left(new UserAlreadyExistsError())
    }

    const user: UserDto = {
      email: userOrError.value.getEmail(),
      name: userOrError.value.getName(),
      lastname: userOrError.value.getLastname(),
    }

    const clientId = process.env.NODEMAILER_OAUTH_CLIENT_ID
    const clientSecret = process.env.NODEMAILER_OAUTH_CLIENT_SECRET
    const redirectUri = process.env.NODEMAILER_OAUTH_REDIRECT_URL
    const refreshToken = process.env.NODEMAILER_OAUTH_REFRESH_TOKEN

    const accessToken = await this.oAuthService.getAccessToken(
      clientId,
      clientSecret,
      redirectUri,
      refreshToken
    )

    const userCreated = await this.userRepository.create(user)

    if (!userCreated) {
      return left(new ServerError())
    }

    const mailOptions: EmailOptions = {
      from: 'Gabriel Ferrari Tarallo Ferraz | Acme <noreply@acme.com>',
      to: userCreated.email,
      subject: 'Welcome to Acme!',
      html: this.emailTemplate.html(request),
      attachments: this.emailTemplate.attachments(),
    }

    /**
     * The email service must be called after the repository call
     * to prevent the email will not be sent to the user after checking
     * he was created in the database
     */
    const response = await this.emailService.send(accessToken, mailOptions)

    return right(response)
  }
}
