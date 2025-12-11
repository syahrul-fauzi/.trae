## Tujuan
- Menyelesaikan fitur pending, memastikan stabilitas dan performa.
- Menjalankan pengujian menyeluruh (unit, integration, UAT, performance).
- Menyiapkan pipeline deployment berlapis (build → test → staging → approval → produksi).
- Memastikan aspek keamanan terpenuhi (enkripsi, hardening, audit akses).
- Melengkapi dokumentasi operasional dan recovery.
- Melakukan verifikasi produksi sebelum membuka akses end user.

## Implementasi Fitur
- Inventaris fitur pending sesuai dokumen requirement; prioritas: kritikal → high → medium.
- Konsolidasi kontrak API dan UI; pastikan kompatibilitas antar modul (auth, uploads, workflows, meta‑events, notifications, metrics).
- Lengkapi observability: API `/metrics`, Web `/api/metrics/prometheus`, Workers `/metrics/workers`.

## Pengujian Menyeluruh
- Unit: cakup semua modul (controllers, services, utils). Target coverage ≥80%.
- Integration: alur antar komponen (Web ↔ API ↔ Workers ↔ DB/Redis). Validasi skema dan error codes.
- UAT: skenario pengguna utama (login→dashboard, uploads, workflows, alerts). Checklist acceptance.
- Performance: k6 smoke/stress/soak dengan thresholds (p95<300ms, error rate<1%). Analisis p95/p99 dan bottleneck.

## Pipeline Deployment
- Build otomatis: lint, type‑check, unit/integration, build artefak.
- Testing otomatis: E2E Playwright, k6 smoke; simpan laporan/artefak.
- Deploy ke staging: rollout terkontrol, health checks, scrape Prometheus, dashboard Grafana aktif.
- Final approval: gate manual berdasarkan hasil test/monitoring; kemudian deploy produksi.

## Keamanan
- Enkripsi data sensitif (at rest via DB/Cloud KMS; in transit TLS). Hindari hard‑code secrets.
- Proteksi CVE umum: input validation, rate limiting, CORS, headers keamanan, dependency audit.
- Audit permission/akses: RBAC untuk endpoint admin (`/metrics`, `/metrics/workers`), log akses, review least privilege.
- Update dokumen `docs/SECURITY_ENDPOINTS.md`: guard, role, contoh konfigurasi proxy aman.

## Dokumentasi
- Panduan instalasi: prasyarat, setup env, per layanan.
- Konfigurasi sistem: Prometheus/Grafana/k6/proxy, variabel lingkungan.
- Troubleshooting: 401/403 auth, 5xx upstream, panel kosong, scrape gagal.
- Backup/recovery: snapshot DB, strategi rollback, restore procedure, verifikasi integritas.

## Verifikasi Produksi
- Health & readiness: API/Web/Workers hijau, scrape stabil.
- Dashboard Grafana menampilkan metrik kunci dan alert berfungsi.
- UAT di produksi terbatas (account internal), tanpa data sensitif.
- Rencana rollback disiapkan; monitoring pasca‑deploy ≥24 jam.

## Kriteria Penerimaan
- Semua tes lulus (unit/integration/E2E/k6 smoke); tidak ada blocker.
- Alerting berfungsi; tidak ada kebocoran secrets; rate limiting aktif.
- Dokumentasi lengkap dan akurat; pipeline otomatis berjalan mulus.

Setujui rencana ini, lalu saya akan langsung mengeksekusi implementasi, pengujian, pipeline, hardening keamanan, serta dokumentasi sesuai poin di atas.