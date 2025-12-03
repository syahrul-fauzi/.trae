# Test Plan
- Unit: vitest/jest per package
- Integration: API + DB containers
- Contract: OpenAPI/Pact
- E2E: Playwright (Chat, Document, Tenant)
- Perf: k6, token & latency KPIs
 
## Acceptance Criteria (MVP)
- Chat: pengguna bertanya → agent menstream jawaban berbasis BaseHub
- Document: render template → artefak tersedia (URL) dan tercatat
- Workflow: createTask menghasilkan tugas dengan metadata & idempotency
- Multi-tenant: isolasi data (RLS) lulus uji positif/negatif
- Observability: traces dan metrics muncul dengan tag `tenantId`
 
## Security & Compliance
- RLS policies diuji untuk tabel tenant-scoped
- RBAC: akses endpoint dibatasi per role
- Secrets tidak tercatat/log; audit trail untuk side-effect tools
 
## UI/UX & A11y verifikasi (Chat)
- Landmark: `banner`, `main[aria-label="Chat messages"]`, `form[aria-label="Chat input"]` terlihat.
- Live regions: `role="status" aria-live="polite"` saat streaming.
- Pesan user muncul segera setelah kirim (optimistic UI) dan pesan asisten mengikuti.
- Kontrol go-to-latest tampil saat scroll keluar; keyboard shortcut `g` mengembalikan ke bawah.
