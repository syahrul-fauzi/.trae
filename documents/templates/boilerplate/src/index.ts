import express from 'express'
import { z } from 'zod'

const app = express()
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

const usersQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
})

app.get('/users', (req, res) => {
  const parsed = usersQuerySchema.safeParse(req.query)
  if (!parsed.success) {
    return res.status(400).json({ code: 'BAD_REQUEST', message: 'Invalid query params', details: parsed.error.flatten() })
  }
  const { page = '1', limit = '10' } = parsed.data
  const p = Math.max(1, parseInt(page as string, 10))
  const l = Math.min(100, Math.max(1, parseInt(limit as string, 10)))
  res.json([
    { id: 'u-1', email: 'alice@example.com' },
    { id: 'u-2', email: 'bob@example.com' },
  ].slice(0, l))
})

export default app

if (require.main === module) {
  const port = process.env.SERVICE_PORT ? parseInt(process.env.SERVICE_PORT, 10) : 3000
  app.listen(port, () => {})
}
