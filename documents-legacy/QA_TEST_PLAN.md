# Rencana QA & Pengujian SBA

## Tujuan
- Memastikan kualitas fungsional, aksesibilitas, integrasi, dan performa sesuai KPI.

## Lingkup
- UI (komponen inti), API, alur end‑to‑end.

## Unit Testing
- Target coverage ≥ 80% paket inti.
- Tools: Vitest/Jest + Testing Library.
  - Apps Web: jalankan `npm run test:run` di `apps/web` (pool forks, single worker). Untuk CI gunakan `npm run test:ci` (reporter dot). Coverage jalankan terpisah dengan `npm run test:coverage`.

## Integration Testing
- Mock jaringan (MSW) / Testcontainers untuk service.
- Verifikasi kontrak API (schema/DTO, zod).

## UAT
- Skenario: chat → tool call → render → task; onboarding tenant.
- Checklist a11y: roles/ARIA/keyboard/focus/kontras.

## Performance Testing
- Web: Lighthouse (LCP p75 ≤ 2.5s; INP p75 ≤ 200ms; CLS p75 ≤ 0.1).
- API: k6 (p95 latency ≤ 300ms; error rate ≤ 0.5%; streaming connect p95 ≤ 1s). Lihat `apps/api/tests/perf/k6-smoke.js` dan gunakan `API_BASE_URL` dari `.env`.

## CI/CD
- Gating lint/typecheck/test/build; publish coverage; optional Turbo remote cache.
  - Konfigurasi Vitest Web: `pool=forks`, `maxConcurrency=1`, `NODE_OPTIONS=--max-old-space-size=4096` pada script.

## Pelaporan
- Laporan test hasil dan rekomendasi per fase.
