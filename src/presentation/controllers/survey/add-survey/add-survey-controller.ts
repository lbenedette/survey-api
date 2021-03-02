import { Controller, HttpRequest, HttpResponse, Validation } from '../../../protocols'
import { badRequest } from '../../../helpers/http/http-helper'
import { AddSurvey } from '../../../../domain/use-cases/add-survey'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation, private readonly addSurvey: AddSurvey) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return badRequest(error)
    }
    await this.addSurvey.add(httpRequest.body)
    // @ts-expect-error
    return null
  }
}
