## Tujuan
- Menyelesaikan middleware rute sensitif (/csp-report, /agui/chat, /health/metrics) dengan autentikasi, RBAC, validasi waktu, logging dan error handling.
- Menyempurnakan sistem Audit Webhook (retry/backoff, riwayat, rate limit, circuit breaker, tanda tangan digital/hash).
- Finalisasi Virtualized List Runs/Agents dengan windowing, lazy-loading, a11y penuh, dan performa optimal.
- Mengintegrasikan Gates Kualitas (unit coverage, static analysis, Lighthouse, Axe, kontrak API, security scanning) ke CI/CD.
- Menyiapkan dashboard & alerting (Grafana, Alertmanager, Slack/Email) dengan metrik dan threshold yang dapat disesuaikan.

## Ruang Lingkup & Lokasi File
- Middleware
  - /csp-report: `apps/web/src/app/api/csp-report/route.ts`
  - /agui/chat: `apps/web/src/app/api/agui/chat/route.ts`
  - /health/metrics: `apps/web/src/app/api/health/metrics/route.ts`
  - Util keamanan: `apps/web/src/app/api/_lib/security.ts` (validateTimestamp, verifyJwtHs256, header helpers)
  - RBAC guard: `packages/security/src/rbac.ts`; audit util: `packages/security/src/audit.ts`
- Audit Webhook
  - Penerima: `apps/web/src/app/api/audit/webhook/route.ts`
  - Sender util (baru): `apps/web/src/app/api/_lib/audit-sender.ts`
- Virtualized List
  - Runs: `apps/web/src/features/runs/components/RunsPanel.tsx`
  - State filter: `apps/web/src/features/runs/state/RunsFilterContext.tsx`
- Gates Kualitas
  - Workflows CI: `.github/workflows/ci.yml`, `.github/workflows/typecheck-weekly.yml`
  - Laporan: `tools/typecheck/report.js`; compliance artifacts folder
- Monitoring/Alerting
  - Prometheus: `monitoring/prometheus.yml`
  - Alertmanager: `monitoring/alertmanager.yml`
  - Grafana: `ops/grafana/sba-dashboard.json`

## Implementasi Middleware
1) /csp-report
- Validasi input: body JSON minimal `{csp-report:{...}}`; tolak jika invalid (400).
- Logging komprehensif: tulis event (ts UTC, userId dari header, endpoint, status) via audit util.
- Error handling: respon terstandar JSON dengan kode 4xx/5xx dan detail.
- RBAC: `withRBAC({resource:'analytics',action:'read'})`.
- Token: `verifyJwtHs256(Bearer token)` dan `validateTimestamp` ±5 menit.

2) /agui/chat
- Autentikasi JWT + RBAC `withRBAC({resource:'agent',action:'run'})`.
- Rate limiting: 100 req/min (in-memory atau upstash/redis jika tersedia).
- Pemantauan performa: ukur latency per request dan log ke observability SDK (client counter) + audit status.

3) /health/metrics
- Koleksi metrik: p95/p99 latency, error rate, throughput; format JSON/Prom standar.
- RBAC guard `analytics:read`, validasi timestamp + token.
- Integrasi monitoring: endpoint siap scrape oleh Prometheus; health JSON menyertakan quantiles.

## Audit Webhook
- Retry/backoff: exponential backoff (mis. 500ms, 1s, 2s; max 3x) di `audit-sender.ts`.
- Riwayat eksekusi: simpan `{payload, status, ts, attempt}` (lokal/log atau DB bila tersedia) dan endpoint ringkasan.
- Rate limit: 100 req/min; circuit breaker saat berturut-turut gagal (mis. 5 kali) → fail-fast 5 menit.
- Enkripsi payload in-transit: HMAC (sudah), HTTPS; opsional re-encryption.

## Virtualized List Runs/Agents
- Windowing: render subset visible + lazy-loading 50 item/batch.
- Cleanup: unmount item di luar viewport; cache per halaman.
- A11y: ARIA (`grid`, `row`, `gridcell`), keyboard (arrow/home/end), focus management, `role="status"` untuk loading.
- Performa: target render awal <100ms; scroll 60fps; memory <500MB untuk 10k item.

## Gates Kualitas CI/CD
- Unit coverage: >=80% untuk modul baru (security/rbac/audit/validator, middleware rute sensitif).
- Static analysis: ESLint (no unsafe-any), TS strict;
- Performance benchmark: Lighthouse CI (Performance/Accessibility/Best Practices ≥90).
- A11y: Axe (zero critical violations).
- Kontrak API: validasi respons terhadap OpenAPI 3.0 untuk `runs list/detail/status` + rute sensitif.
- Security scanning: dependency advisories, basic SAST rules; blok deploy pada critical.
- Compliance artifacts: upload Lighthouse/Axe/contract reports.

## Monitoring & Alerts
- Dashboard: error rate (>1%), latency p95 (>2s), RBAC_DENIED count, audit delivery status.
- Alerting: Slack/Email, escalation policy, history 90 hari; threshold configurable.
- Simulasi failure: injeksi kegagalan untuk verifikasi notifikasi dan menghindari false positives.

## Verifikasi & Uji
- Fungsional: allow/deny RBAC, validasi JWT/timestamp, rate limit, audit log; rute sensitif berfungsi.
- Kinerja: benchmark virtualized list (10k+ items), Lighthouse ≥90.
- Keamanan: OWASP Top 10 checks, negative webhook (signature mismatch, replay, tampering), rate limit tests.
- Kompatibilitas: regression e2e pada halaman utama & panel; type-check hijau lintas workspace.

## Acceptance Criteria
- Semua rute sensitif memakai middleware validasi token + RBAC + audit; timestamp wajib.
- Audit webhook memiliki retry/backoff, riwayat, rate limit; penerima memvalidasi signature HMAC.
- Runs/Agents memiliki virtualized list yang memenuhi performa & a11y target.
- CI/CD menegakkan gates; artifacts diunggah; blok deploy pada violations.
- Dashboard & alerts menampilkan metrik kunci dan mengirim notifikasi pada threshold.

## Kompatibilitas & Keamanan
- Backward compatibility tetap: kontrak API tidak berubah; mode dev mendukung cookie `__test_auth`.
- Tidak ada secrets di bundle; validasi token/signature; replay prevention; audit log terstruktur.

## Rencana Eksekusi
1) Lengkapi middleware `/csp-report`, `/agui/chat`, `/health/metrics`.
2) Implementasi `audit-sender.ts` (retry/backoff, riwayat, rate limit, circuit breaker).
3) Finalisasi virtualized list + a11y.
4) Tambah gates kualitas di CI/CD (Lighthouse, Axe, kontrak API, security scanning) dan compliance artifacts.
5) Konfigurasi dashboard dan alerting; jalankan simulasi failure.
6) Jalankan verifikasi menyeluruh (unit/integration/e2e, perf, security); dokumentasikan hasil.

## Pelaporan
- Laporan berkala: ringkasan pekerjaan, masalah & solusinya, hasil tes, rekomendasi langkah selanjutnya; disimpan di `/.trae/documents/`.
