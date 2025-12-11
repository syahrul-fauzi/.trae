## Ruang Lingkup
- Aplikasi web (`apps/web`, Next.js/React) dan API (`apps/api`, NestJS) disiapkan end-to-end untuk produksi.
- Fokus: perbaikan bug, fitur dev pendukung, pengujian lengkap (unit/integration/UAT), kualitas produksi (performa/keamanan/skalabilitas), dokumentasi, dan pipeline deploy.

## 1) Triage & Perbaikan Bug
- Audit error log: Playwright (E2E), Vitest (unit/integration), logger API dan browser console; kelompokkan tinggi/medium/rendah.
- Perbaiki stabilitas komponen observability di web: penyelarasan polling, race conditions, dan fallbacks pada `MetricsBaselineWidget` dan `AlertSystem`.
- Keras-kan validasi query & respons pada endpoint admin (history metrics pekerja) dan tambahkan rate-limit + cache policy defensif.
- Hilangkan ketergantungan test-only (filter console noise) dari build produksi.
- Tuntaskan 404/500 edge-cases: parsing konten, ukuran payload, timeouts, dan unhandled rejections.

## 2) Fitur Development Pendukung
- Observability lanjutan:
  - Lengkapi panel Alerting (delivery status, pending, failure ratio) dan Workers (queue depth, throughput, timeout rate) pada dashboard.
  - Ekspor riwayat metrik pekerja (JSON/CSV) untuk analisis offline.
- Feature flags: konfigurasi berbasis environment untuk mengaktif/nonaktif modul observability dan eksperimen UI.
- Admin tools: halaman Health & Metrics Overview, kontrol dasar job queue (pause/resume) terproteksi RBAC.

## 3) Pengujian Menyeluruh
- Unit (API): guards/interceptors/services/controller inti (JWT/Roles, http-metrics, WorkerMetricsService, HealthService). Gunakan Vitest + Supertest.
- Integration (API): alur autentikasi, RBAC admin, `GET /metrics`, `GET /metrics/workers`, `GET /metrics/workers/history` termasuk pagination, cache_policy.
- Unit/Integration (Web): komponen kritikal (baseline widget, alert system, chat/agentic widgets) dengan React Testing Library + Vitest.
- UAT/E2E (Web): Playwright di perangkat desktop & mobile; skenario login → dashboard observability → simulasikan baseline gagal → verifikasi alert visual & webhook.
- A11y: integrasi axe-core; cek ARIA, kontrast, fokus; toleransi noise di dev hanya untuk mode test.
- Performa: uji p95/p99 latensi endpoint utama, RPS, memory CPU proses; gunakan k6 skenario smoke/stress/soak dengan threshold.

## 4) Kualitas Produksi
- Performa: HTTP compression, caching header, CDN edge untuk aset; optimasi queries/indeks DB; connection pooling; kurangi overfetching; optimalkan rendering dan splitting bundle pada web.
- Keamanan: RBAC/JWT konsisten; secure headers (Helmet), CORS ketat, rate limiting, input validation kuat; secrets via env; admin metrics di balik TLS reverse proxy; audit logging.
- Skalabilitas: skala horizontal API & pekerja; atur concurrency BullMQ; backpressure & retry policies; pemantauan queue; siap canary/hotfix.
- Kesiapan layanan: liveness/readiness endpoints; graceful shutdown; timeouts default; circuit breaker dasar untuk downstream.

## 5) Dokumentasi
- Teknis: arsitektur (web+api+workers), observability & metrics, endpoint API (admin/ publik), security hardening & RBAC, konfigurasi proxy TLS, runbooks & troubleshooting.
- Panduan Pengguna: penggunaan dashboard observability, menyimpan/meninjau baseline, respon terhadap alert.
- CI Artefak: cara membaca laporan konsolidasi (HTML/PDF), kriteria sign-off, dan proses rollback.

## 6) Pipeline Deployment Produksi
- GitHub Actions:
  - Build → lint → typecheck → unit & integration → Playwright E2E.
  - Validasi observability: `promtool` rules, `amtool` Alertmanager config.
  - k6 smoke/stress/soak (gate dengan threshold).
  - Generate Laporan Konsolidasi (HTML) + PDF auto-orient; unggah sebagai artefak.
  - Staging deploy + verifikasi scrape TLS via reverse proxy.
  - Manual approval gate → Production deploy.
  - Rollback otomatis (versi artefak/konfigurasi tersimpan), branch-aware artifacts & concurrency guard.
  - Tambah keamanan: SCA (dependency vuln), CodeQL/semgrep (opsional), container image scan.

## 7) Kriteria Penerimaan & Sign-off
- Semua test hijau; E2E UAT lulus pada resolusi desktop & mobile.
- SLO terpenuhi: p95 latensi di bawah ambang, error rate rendah, memory stabil.
- Alerting end-to-end berfungsi (Slack/Email) dan dashboard menampilkan metrik kritikal.
- Laporan konsolidasi HTML/PDF terhasil; tanda tangan digital HMAC valid; pipeline siap rollback.

## Rencana Implementasi (Urutan)
1. Triage & perbaikan bug prioritas tinggi pada web/API (observability & admin endpoints).
2. Tambah/memperkuat unit & integration tests web/API; stabilkan UAT/E2E.
3. Lengkapi fitur dev pendukung (dashboard alerting & workers panels, CSV export, admin tools).
4. Hardening kualitas produksi (performa/keamanan/skalabilitas) dan readiness.
5. Finalisasi dokumentasi teknis & panduan pengguna.
6. Rakitan dan penyempurnaan pipeline produksi dengan gates dan laporan.

Silakan konfirmasi. Setelah disetujui, saya akan mengeksekusi perubahan, memverifikasi dengan test, dan menyiapkan artefak siap produksi.