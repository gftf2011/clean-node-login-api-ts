export interface IUseCase {
  perform: (request: any) => Promise<any>
}
