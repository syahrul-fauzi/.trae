import express from 'express'

const app = express()
app.get('/gateway/health', (_req, res) => res.json({ status: 'ok' }))

export default app

if (require.main === module) {
  app.listen(3001)
}
