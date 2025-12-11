## Tujuan
- Menstandarkan keamanan, RBAC, rate‑limiting, audit, observability dan kualitas lintas `apps/app` dan `apps/web`.
- Menyelaraskan dokumentasi, KPI dan praktik operasional agar konsisten.

## Standardisasi Lintas Platform
### Konsolidasi Guard/Middleware
- RBAC terpusat:
  - Buat shared package `packages/security` mengekspor `withRBAC` + model role/permission.
  - Refactor rute sensitif di `apps/app` dan `apps/web` untuk konsumsi dari shared package.
- Validasi tenant header:
  - Shared util `ensureTenantHeader(req)` di `packages/shared` dengan fallback dev.
  - Tegakkan header `x-tenant-id` di semua rute API + propagasi ke metrics.
- Rate‑limiting unifikasi:
  - Shared rate‑limit util (token‑bucket/sliding window) dengan konfigurasi per‑tenant/per‑route.
  - Konfigurasi konsisten via env: `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`, header `X-RateLimit-*`.

### Harmonisasi Sistem
- Schema audit seragam (JSON log terstruktur):
  - `ts`, `tenantId`, `userId`, `endpoint`, `action`, `status`, `resource`, `ip`, `origin`, `meta`.
  - Shared writer/validator; endpoint storage/query konsisten (Supabase).
- Format error response:
  - Standar payload: `{ status, code, message, details?, traceId?, ts }`.
  - HTTP status map + kode aplikasi; shared helper untuk konsistensi.

### Observability & KPI
- Label & format metrik:
  - Normalisasi route/method/status/tenant; metrik latensi ke detik; P95/P99 konsisten.
- KPI dashboard terpusat:
  - P95/P99 latensi, error rate, throughput, rate‑limit events, audit volume.
  - Real‑time visualisasi (Grafana/Alertmanager) + tren mingguan.

## Roadmap Implementasi Bertahap
### Fase 1 (0–3 bulan)
- Finalisasi audit schema + dokumentasi API (Supabase tabel/index + retention).
- Implementasi rate‑limiting standard (shared util + headers + env).
- Pengembangan shared utilities library (RBAC, tenant, errors, metrics helpers).
- Sinkronisasi dokumentasi (README/docs/workspace `_xref.md`, RACI + checklist).

### Fase 2 (3–6 bulan)
- Observability alignment (exporter/SDK, label, format, sampling).
- Definisi alert rules berdasarkan SLA (p95 ≤500ms, error ≤0.5%).
- KPI dashboard terpusat (Grafana + Slack/Email alerts).
- UAT menyeluruh: rute sensitif, audit, rate‑limit, RBAC, a11y.

### Fase 3 (6–9 bulan)
- Canary rollout staging (5–10% traffic), monitoring intensif 2 minggu.
- Iterasi berdasarkan metrik performa & feedback; hardening & docs final.

## Spesifikasi Teknis Tambahan
- Sumber metrik:
  - App sebagai primary metric provider; Web konsumsi via SDK dengan auto‑injection `x-tenant-id`.
- Keamanan:
  - Harmonisasi RBAC guard untuk operasi sensitif di Web + audit trail untuk semua akses kritis.
- User Experience:
  - UI konsisten untuk kontrol runs/agents; deep‑link Web ↔ App.
- Kualitas:
  - Target KPI lintas platform; pipeline otomatis a11y (Axe/Lighthouse) & performa.

## Roadmap Kuartalan
- Q1: Konsolidasi observability SDK + shared helpers metrics.
- Q2: Harmonisasi RBAC dan permission model + error format.
- Q3: Penyelarasan kontrol eksekusi (rate‑limit, audit) antar platform.
- Q4: Penguatan a11y compliance & performance benchmark; dokumentasi operasional.

## Kriteria Kesuksesan
- Reduksi 40% inconsistency error antar platform.
- Peningkatan 30% mean time to detect (MTTD) insiden.
- 95% a11y compliance score (baseline Axe/Lighthouse ≥ 90/95).
- 100% milestone setiap fase tepat waktu.

## Eksekusi & Dependensi
- Tim lintas fungsi (App, Web, Security, Observability, Docs) dengan RACI di workspace.
- Env & secrets tersanitasi; gating CI untuk type‑check/tests/coverage/a11y/perf.
- Risiko: regresi fitur; mitigasi via UAT + canary + rollback plan.

## Output Setelah Persetujuan
- Dokumen Rekomendasi & Roadmap terstruktur di `docs/`.
- Issue tracker & matriks tugas per fase.
- KPI dashboard & alert rules draft.

## Permintaan Konfirmasi
- Konfirmasi untuk mulai menulis dokumen Rekomendasi & Roadmap terperinci, membuat shared utilities awal, dan menyusun KPI dashboard draft sesuai rencana ini.