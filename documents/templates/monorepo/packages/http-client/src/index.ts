import { request } from 'undici'
import { z } from 'zod'

export async function getJson<T>(url: string, schema?: z.ZodType<T>): Promise<T> {
  const res = await request(url, { method: 'GET' })
  const data = await res.body.json()
  if (schema) {
    return schema.parse(data)
  }
  return data as T
}

export async function postJson<T, B>(url: string, body: B, schema?: z.ZodType<T>): Promise<T> {
  const res = await request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.body.json()
  if (schema) {
    return schema.parse(data)
  }
  return data as T
}
