import request from 'supertest'
import app from '../src/index'

describe('GET /users', () => {
  it('returns list of users', async () => {
    const res = await request(app).get('/users?page=1&limit=2')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeLessThanOrEqual(2)
    expect(res.body[0]).toHaveProperty('id')
    expect(res.body[0]).toHaveProperty('email')
  })

  it('returns 400 for invalid params', async () => {
    const res = await request(app).get('/users?page=zero&limit=0')
    expect(res.status).toBe(400)
    expect(res.body.code).toBe('BAD_REQUEST')
  })
})
