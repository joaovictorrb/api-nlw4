import request from 'supertest'
import { getConnection } from 'typeorm'
import { app } from '../app'

import createConnection from '../config/database/db'

describe('Survey', () => {
  beforeAll(async () => {
    const connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async() => {
    const connection = getConnection()
    await connection.dropDatabase()
    await connection.close() 
  })
  
  it('Should be able to create a new survey', async () => {
    const response = await request(app).post('/survey').send({
      title: "titleExample",
      description: "Example"
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it('Should be able to get all surveys!', async() => {
    await request(app).post('/survey').send({
      title: "titleExample",
      description: "Example"
    })

    const response = await request(app).get('/survey')
    expect(response.body.lenght).toBe(2)
  })
})