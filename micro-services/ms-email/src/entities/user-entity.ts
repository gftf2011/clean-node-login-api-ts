export class UserEntity {
  private readonly name: string;
  private readonly lastname: string;
  private readonly email: string;

  private constructor (
    name: string,
    lastname: string,
    email: string
  ) {
    this.name = name
    this.lastname = lastname
    this.email = email
    Object.freeze(this)
  }

  getName (): string {
    return this.name
  }

  getLastname (): string {
    return this.lastname
  }

  getEmail (): string {
    return this.email
  }
}
