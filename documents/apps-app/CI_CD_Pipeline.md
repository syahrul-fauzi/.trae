# CI/CD Pipeline dan Artefak Kualitas

## Tahapan Pipeline
- Lint: `biome lint`
- Typecheck: `tsc --noEmit`
- Unit/Integration: `vitest` dengan coverage V8
- E2E: `playwright test`
- Build: `next build`
- Artefak: coverage HTML, laporan a11y, OpenAPI JSON

## Kriteria Kelulusan
- Coverage minimal 80% (unit/integration)
- E2E kritis lulus (auth, runs, SSE proxy)
- Build Next sukses tanpa error metadata/hydration

## Publikasi Artefak
- Coverage: `coverage/`
- A11y/E2E report: `playwright-report/` bila diaktifkan
- OpenAPI: `GET /api/openapi`, UI: `/api-docs`

## Rilis & Versi
- Versi semantik, changelog otomatis
- Canary untuk fitur real‑time sebelum produksi

