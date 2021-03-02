import { DbAddSurvey } from './db-add-survey'
import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'

const makeFakeSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image', answer: 'any_answer'
  }]
})

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddAccountRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new AddAccountRepositoryStub()
}

interface sutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): sutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey UseCase', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(makeFakeSurvey())
    expect(addSpy).toHaveBeenCalledWith(makeFakeSurvey())
  })
})
