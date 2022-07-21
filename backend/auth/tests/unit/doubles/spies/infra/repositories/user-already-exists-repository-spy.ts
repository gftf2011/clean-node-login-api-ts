import {
  IUserRepository,
  UserDto,
} from '../../../../../../src/use-cases/ports';

export class UserAlreadyExistsRepositorySpy implements IUserRepository {
  private email: string;

  private user: UserDto;

  private findUserByEmailCalls = 0;

  private createCalls = 0;

  public getEmail(): string {
    return this.email;
  }

  public getUser(): UserDto {
    return this.user;
  }

  public countFindUserByEmailCalls(): number {
    return this.findUserByEmailCalls;
  }

  public countCreateCalls(): number {
    return this.createCalls;
  }

  create(user: UserDto): Promise<UserDto> {
    this.createCalls++;
    this.user = user;
    return {} as any;
  }

  async findUserByEmail(email: string): Promise<UserDto | undefined> {
    this.findUserByEmailCalls++;
    this.email = email;
    return {} as any;
  }
}
