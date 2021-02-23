import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '../../errors'
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
  validationStub: Validation
}

const makeSut = (): sutTypes => {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])
  return {
    sut,
    validationStub
  }
}

describe('CompareFields Validation', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('name'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('name'))
  })

  test('Should return null if all validation success', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
