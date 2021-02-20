import { HttpRequest } from './http'

export interface Controller {
  handle: (httpRequest: HttpRequest) => any
}
