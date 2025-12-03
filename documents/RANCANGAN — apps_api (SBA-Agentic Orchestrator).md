RANCANGAN — SBA-Agentic Orchestrator API (apps/api)

Ringkasan
- Tujuan: API orkestra agent untuk mengelola sesi, run, dan eksekusi tool dengan observabilitas, multi-tenant, dan keamanan.
- Stack: Express, Zod, Winston, Vitest, Supabase.

Arsitektur
- Entry `src/index.ts` → `src/app.ts`.
- Routing `/api/v1` fokus ToolsController: list, health, get, execute.
- ToolRegistry: adapter dengan `name`, `schema`, `execute(ctx, params)`.
- Observabilitas: logger winston + telemetry sederhana; OTel dapat diaktifkan bertahap.

Endpoint
- `GET /health`.
- `GET /api/v1/tools`.
- `GET /api/v1/tools/health`.
- `GET /api/v1/tools/:toolName`.
- `POST /api/v1/tools/:toolName/execute`.

Validasi & Skema
- `src/orchestrator/schemas.ts` berisi zod untuk ToolExecuteSchema, ToolResultSchema.
- Helper `validateSchema` untuk payload.

Keamanan & UX
- Helmet, CORS, compression; Request-ID.
- Error handler terstruktur JSON.

Pengujian
- `pnpm build` untuk compile, `pnpm test` untuk vitest.

CI & Turbo konfigurasi
- Workflow CI khusus API di `.github/workflows/api-tests.yml`:
  - Install ter-filter `@sba/api`, build, dan test (unit + integrasi)
  - Trigger pada perubahan `apps/api/**` dan file workflow
- Turbo pipeline (`turbo.json`) sudah mengatur cache untuk build/test dan output (`dist/**`, `.next/**`) sehingga kompatibel dengan monorepo.

Catatan
- Kode Nest & queue disertakan namun belum di-wire ke Express baseline; aktifkan bertahap.
