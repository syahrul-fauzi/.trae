# Tracing Policy

Kebijakan pelacakan (distributed tracing) untuk alur kerja agen.

## 1. Tracing Standard
- Menggunakan OpenTelemetry (OTel) sebagai standar.
- Setiap request wajib memiliki `trace_id` yang unik.
- Span harus mencakup metadata `tenant_id` dan `agent_type`.

## 2. Hierarki Span
- `request.root`: Span induk untuk seluruh alur.
- `rule.evaluate`: Span untuk proses pengecekan aturan.
- `agent.reasoning`: Span untuk proses berpikir LLM.
- `action.execute`: Span untuk pemanggilan tool/API.

## 3. Propagasi Konteks
`trace_id` harus diteruskan melalui header HTTP atau metadata pesan (Queue) agar alur asinkron tetap dapat dilacak secara utuh.

---
*Gunakan `@sba/observability` untuk instrumentasi otomatis.*
