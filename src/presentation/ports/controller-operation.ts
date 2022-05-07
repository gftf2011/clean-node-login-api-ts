import { HttpRequest } from './http-request'
import { HttpResponse } from './http-response'

export interface ControllerOperation {
  readonly requiredParams: string[]
  readonly requiredHeaderParams: string[]
  operation: (request: HttpRequest) => Promise<HttpResponse>
}
