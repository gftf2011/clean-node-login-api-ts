import {
  IUserRepository,
  UserDto,
} from '../../../../../../src/use-cases/ports';

interface FindUserByEmailFunction {
  email: string[];
  response: UserDto[];
}

interface CreateFunction {
  user: UserDto[];
  response: UserDto[];
}

interface Parameters {
  create: CreateFunction;
  findUserByEmail: FindUserByEmailFunction;
}

export class UserAlreadyExistsRepositorySpy implements IUserRepository {
  private parameters: Parameters = {
    create: {
      response: [],
      user: [],
    },
    findUserByEmail: {
      email: [],
      response: [],
    },
  };

  private findUserByEmailCalls = 0;

  private createCalls = 0;

  public getParameters(): Parameters {
    return this.parameters;
  }

  public countFindUserByEmailCalls(): number {
    return this.findUserByEmailCalls;
  }

  public countCreateCalls(): number {
    return this.createCalls;
  }

  create(user: UserDto): Promise<UserDto> {
    const size = this.parameters.create.response.length;
    this.createCalls++;
    this.parameters.create.user.push(user);
    this.parameters.create.response.push({
      ...user,
      id: `${size}`,
    } as any);
    return {
      ...user,
      id: `${size}`,
    } as any;
  }

  findUserByEmail(email: string): Promise<UserDto | undefined> {
    this.findUserByEmailCalls++;
    this.parameters.findUserByEmail.email.push(email);
    this.parameters.findUserByEmail.response.push({
      id: '0',
      email,
    } as any);
    return {
      id: '0',
      email,
    } as any;
  }
}
