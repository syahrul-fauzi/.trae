## Tujuan
- Menyelesaikan bagian pending secara berurutan: Rate Limiting → Retry/Backoff Audit Sender → Virtualized List → Gates Kualitas → Dashboard-Alerts, dengan verifikasi menyeluruh dan dokumentasi lengkap.

## 1) Implementasi Rate Limiting
- Strategi:
  - Middleware throttling berbasis tenant+endpoint (key: `${tenant}:${route}:${method}`) dengan window bergulir (sliding window atau token-bucket).
  - Default in-memory untuk dev; opsi Redis/Upstash untuk produksi.
- Konfigurasi:
  - Env: `RATE_LIMIT_WINDOW_MS` (mis. 60000), `RATE_LIMIT_MAX` (mis. 100), `RATE_LIMIT_BURST`.
  - Header respons: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`.
- Logging:
  - Audit entri deny (429) dan status allow dengan metadata: ts, userId, tenant, endpoint, action.
- Acceptance:
  - Semua rute sensitif dibatasi; pelanggaran menghasilkan 429 dengan header yang benar; audit tercatat.

## 2) Retry/Backoff Audit Sender
- Mekanisme:
  - Exponential backoff: 0.5s → 1s → 2s; `MAX_RETRY_ATTEMPTS=3`.
  - Jitter kecil (±100ms) untuk menghindari thundering herd.
- Riwayat & Pelaporan:
  - Simpan `{payload, status, ts, attempts, lastError}`; endpoint ringkasan riwayat untuk inspeksi.
  - Notifikasi kegagalan (opsional): webhook Slack/Email bila semua percobaan gagal.
- Keamanan:
  - HMAC signature atas payload; hash integritas; HTTPS.
- Acceptance:
  - Pengiriman audit berhasil atau dilaporkan sebagai gagal setelah 3 percobaan dengan riwayat tersimpan.

## 3) Virtualized List (Runs/Agents)
- Teknik:
  - Windowing manual dengan kontainer scroll dan indeks visible; lazy-loading per 50 item batch; cleanup DOM di luar viewport.
  - Fixed item-height (opsional sentinel untuk item tinggi dinamis).
- Aksesibilitas:
  - ARIA (`grid`, `row`, `gridcell`), keyboard nav (arrow/home/end), focus management, indikator loading (live region).
- Performa target:
  - Render awal <100ms, scroll 60fps stabil, memori <500MB untuk 10k item.
- Acceptance:
  - Benchmark mencapai target; tidak ada jank saat scroll; a11y checks hijau.

## 4) Gates Kualitas (CI/CD)
- Komponen:
  - Unit/Integrasi/E2E: coverage ≥80% untuk modul baru (security/middleware/list).
  - Static analysis: ESLint (no unsafe-any, security rules), TS strict.
  - Performance: Lighthouse CI (Performance/A11y/Best Practices ≥90) mobile & desktop.
  - A11y: Axe (zero critical violations) pada halaman kritis.
  - Kontrak API: validasi terhadap OpenAPI 3.0 spesifikasi untuk `runs list/detail/status` dan rute sensitif.
  - Security scanning: dependency advisories & SAST dasar.
- Artefak & Enforcement:
  - Upload laporan (JSON/HTML); blok deploy otomatis bila melanggar threshold; simpan tren historis.
- Acceptance:
  - Semua gate lulus; deploy tertahan pada pelanggaran; laporan tersedia.

## 5) Dashboard & Alerts
- Dashboard (Grafana/Prometheus):
  - Panel: error rate (>1%), latency p95 (>2s), RBAC_DENIED, audit delivery status, throughput.
  - Filter severity & tenant.
- Alerts (Alertmanager):
  - Slack/Email; escalation policy; retensi history 90 hari; threshold configurable.
- Acceptance:
  - Alerts terkirim saat threshold dilampaui; dashboard menampilkan metrik real-time & tren.

## Verifikasi & Staging
- Pengujian per tahap:
  - Fungsional: RBAC allow/deny, token & timestamp validasi, rate limit.
  - Kinerja: benchmark virtualized list (10k+ items), Lighthouse CI ≥90.
  - Keamanan: OWASP Top 10 (negative cases, replay prevention), webhook signature mismatch & tampering.
  - Kompatibilitas: regression e2e untuk halaman utama/panel; type-check hijau.
- Staging:
  - Validasi end-to-end di staging dengan logging & metrics aktif sebelum produksi.

## Dokumentasi & Deliverables
- Kode teruji & terdokumentasi per modul (middleware, audit-sender, list, gates, dashboard/alerts).
- Laporan pengujian (unit/integrasi/e2e/performa/a11y/security) per komponen.
- Dokumentasi teknis & user guide:
  - Aturan rate-limiting, alur retry/backoff, best practices list, kriteria kelulusan gates, konfigurasi dashboard & prosedur respon.

## Kompatibilitas & Keamanan
- Backward compatibility: kontrak API tidak diubah; mode dev cookie `__test_auth` tetap; fallback read-only saat policy tidak tersedia.
- Keamanan: tidak ada secrets di bundle; validasi token/signature; replay prevention; audit log terstruktur.

## Eksekusi Terurut
1) Rate limiting middleware rute sensitif.
2) Retry/backoff audit sender & riwayat + rate limiting.
3) Virtualized list windowing + lazy-loading + a11y.
4) Gates kualitas CI/CD & compliance artifacts.
5) Dashboard & alerts; simulasi failure & notifikasi.
6) Verifikasi menyeluruh & staging; dokumentasi & laporan disimpan di `/.trae/documents/`.
