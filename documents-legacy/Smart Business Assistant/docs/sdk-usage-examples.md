SDK Usage Examples — Tools API

Tujuan
- Contoh konsumsi endpoint `getDocument`, `renderDocument`, `createTask` berbasis OpenAPI dengan penanganan `ErrorModel`.

Contoh TypeScript (fetch) — langsung
```
type ErrorModel = {
  success: boolean
  code: 'TOOL_ERROR' | 'RATE_LIMIT' | 'NOT_FOUND' | 'BAD_REQUEST' | 'CONFLICT' | 'UNAVAILABLE'
  message: string
  retryable?: boolean
  payload?: Record<string, unknown>
}

async function call<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const json = await res.json()
  if (!res.ok || json?.success === false) throw json as ErrorModel
  return json as T
}

export async function getDocument(tenantId: string, query: string) {
  return call<{ hits: Array<{ id: string; title: string; snippet: string; score: number }> }>(
    '/tools/getDocument',
    { tenantId, query }
  )
}

export async function renderDocument(templateId: string, data: Record<string, unknown>) {
  return call<{ url: string; commitId?: string }>(
    '/tools/renderDocument',
    { templateId, data }
  )
}

export async function createTask(tenantId: string, title: string, assignee?: string, metadata?: Record<string, unknown>, idempotencyKey?: string) {
  return call<{ taskId: string; status: string }>(
    '/tools/createTask',
    { tenantId, title, assignee, metadata, idempotencyKey }
  )
}

export async function safeCall<T>(fn: () => Promise<T>) {
  try {
    return await fn()
  } catch (err) {
    const e = err as ErrorModel
    if (e.code === 'RATE_LIMIT' && e.retryable) {
      // backoff & retry
      await new Promise(r => setTimeout(r, 500))
      return await fn()
    }
    throw e
  }
}
```

Contoh menggunakan @sba/sdk
```
import { getDocument, renderDocument, createTask, safeCall } from '@sba/sdk'

async function run(tenantId: string) {
  const docs = await safeCall(() => getDocument(tenantId, 'SOP Cuti'))
  const render = await safeCall(() => renderDocument('tmpl_hr_contract', { name: 'Alice' }))
  const task = await safeCall(() => createTask(tenantId, 'Approve contract', 'manager-1', { due: '2025-12-31' }, 'idem-001'))
  console.log(docs, render, task)
}
```

Catatan
- Validasi parameter di sisi klien mengikuti skema dari SDK (Zod) yang dihasilkan dari OpenAPI.
- `retryable` mengindikasikan kapan retry aman untuk dilakukan.
