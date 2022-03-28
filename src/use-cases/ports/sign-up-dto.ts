export interface SignUpDto {
  user: {
    name: string
    lastname: string
    taxvat: string
    email: string
    password: string
  }
  hashedPassword: string
  hash: string
}
