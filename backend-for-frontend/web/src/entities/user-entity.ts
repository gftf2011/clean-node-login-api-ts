/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Creates the User Entity responsible to handle all user related logic from an object that can be complex
 *
 * It uses the {@link https://refactoring.guru/pt-br/design-patterns/builder Builder} design pattern
 *
 * @obs The User Entity now is a {@link https://www.baeldung.com/java-pojo-class P.O.J.O.} - Plain Old Java Object.
 * It does not have any businnes logic for now. The decision was made dealing with the {@link https://developer.ibm.com/patterns/create-backend-for-frontend-application-architecture/ B.F.F.} - Backend For Frontend context
 */
export class UserEntity {
  private readonly name: string
  private readonly lastname: string
  private readonly taxvat: string
  private readonly email: string
  private readonly password: string

  private constructor(
    name: string,
    lastname: string,
    taxvat: string,
    email: string,
    password: string
  ) {
    this.name = name
    this.lastname = lastname
    this.taxvat = taxvat
    this.email = email
    this.password = password
    Object.freeze(this)
  }

  getName(): string {
    return this.name
  }

  getLastname(): string {
    return this.lastname
  }

  getTaxvat(): string {
    return this.taxvat
  }

  getEmail(): string {
    return this.email
  }

  getPassword(): string {
    return this.password
  }

  static create(
    name: string,
    lastname: string,
    taxvat: string,
    email: string,
    password: string
  ): UserEntity {
    return new UserEntity(name, lastname, taxvat, email, password)
  }
}
