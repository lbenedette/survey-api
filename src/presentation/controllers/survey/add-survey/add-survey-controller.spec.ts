import { AddSurveyController } from './add-survey-controller'
import { HttpRequest, Validation } from '../../../protocols'
import { MissingParamError } from '../../../errors'
import { badRequest } from '../../../helpers/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      { image: 'any_image', answer: 'any_answer' }
    ]
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

interface sutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

const makeSut = (): sutTypes => {
  const validationStub = makeValidation()
  const sut = new AddSurveyController(validationStub)
  return {
    sut,
    validationStub
  }
}

describe('AddSurvey Controller', () => {
  test('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
