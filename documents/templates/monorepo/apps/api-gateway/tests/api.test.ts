import request from 'supertest'
import app from '../src/index'

describe('API Gateway', () => {
  it('GET /gateway/health returns ok', async () => {
    const res = await request(app).get('/gateway/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})
