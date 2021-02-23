import { ValidationComposite } from './validation-composite'
import { InvalidParamError, MissingParamError } from '../../errors'
import { Validation } from './validation'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

interface sutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): sutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('CompareFields Validation', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('name'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('name'))
  })

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new InvalidParamError('email'))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('name'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should return null if all validation success', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
