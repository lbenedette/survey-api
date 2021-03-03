import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 403 if not access token is provided', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            { image: 'http://image-name.com', answer: 'Answer 1' },
            { answer: 'Answer 2' }
          ]
        })
        .expect(403)
    })

    test('Should return 200 if valid access token and user is admin', async () => {
      const account = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        role: 'admin'
      })
      const id = account.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne(
        {
          _id: id
        },
        {
          $set: {
            accessToken
          }
        }
      )
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            { image: 'http://image-name.com', answer: 'Answer 1' },
            { answer: 'Answer 2' }
          ]
        })
        .expect(204)
    })
  })
})
