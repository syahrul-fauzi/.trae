# Tujuan
- Membuat mekanisme pengujian yang memverifikasi kenaikan nilai numerik (khususnya `_count`) secara konsisten antar run dengan baseline snapshot.
- Mengintegrasikan hasil ke dashboard melalui widget visual yang menampilkan tren, status verifikasi, dan opsi menyimpan baseline baru.

# Ruang Lingkup
- E2E/Vitest: parser Prometheus, baseline storage, assertion delta, reporting.
- Web (Next.js): API baseline (GET/POST), widget dashboard, auto-refresh dan drill-down.
- CI: artefak baseline, opsi update baseline.
- Dokumentasi: dua dokumen `.trae/documents` + pembaruan spesifikasi yang disebutkan.

# Desain Teknis
- Parser Prometheus:
  - Buat util `parsePrometheus(text)` untuk mengekstrak nilai `_count`, `_sum`, `_bucket`, dan counter `_total` dari teks Prometheus.
  - Fokus metrik: `k6_http_req_duration_ms_count`, `k6_http_reqs_total`, `web_health_request_duration_seconds_count`.

- Baseline Storage:
  - File baseline: `apps/web/e2e/state/metrics-baseline.json` berisi struktur `{ metricName: { count: number, sum?: number, updatedAt: string } }`.
  - API baseline: `apps/web/src/app/api/metrics/baseline/route.ts`:
    - `GET`: kembalikan baseline saat ini (in-memory + fallback file).
    - `POST`: menyimpan snapshot baru sebagai baseline (opsional flag `overwrite=true`).

- Assertion Mekanisme (E2E):
  - Helper: `apps/web/e2e/helpers/metrics-baseline.ts` untuk:
    - Membaca baseline; jika belum ada, tulis baseline dari keadaan saat ini dan tandai sebagai "initial-run".
    - Menghitung `delta = current_count - baseline_count` per metrik; bandingkan dengan `expectedIncrement`.
    - `expectedIncrement` disesuaikan: operasi upload sukses menambah 3 sampel histogram (`avg`, `p(95)`, `p(99)`) sehingga `_count += 3` per ingest; error-case tetap menambah sampel durasi, dan counter total `k6_http_reqs_total += 1`.
    - Tulis laporan ke `apps/web/e2e/reports/metrics-delta.json` dan tampilkan ringkasan ke console.
    - Mendukung env `UPDATE_BASELINE=true` untuk memperbarui baseline setelah verifikasi.
  - Integrasi ke `apps/web/e2e/chat-upload.spec.ts`: setelah setiap ingestion dan verifikasi `GET /api/metrics/prometheus`, panggil helper untuk delta & reporting.
  - Tambahkan test khusus `metrics-baseline.spec.ts` untuk health route `web_health_request_duration_seconds_count` dengan baseline.

- Widget Dashboard
  - Komponen: `apps/web/src/features/metrics/MetricsBaselineWidget.tsx` (client component) menampilkan:
    - Tren perubahan `_count` (mini sparkline dari 20 titik terakhir) berdasarkan polling `GET /api/metrics/prometheus` setiap 10 detik.
    - Status verifikasi (ikon/warna): hijau bila `current_count >= baseline_count + expectedIncrement`, merah bila tidak.
    - Tombol "Simpan baseline" (POST `/api/metrics/baseline`) dan "Refresh".
    - Drill-down: membuka panel detail berisi tabel metrik, delta, dan tautan raw Prometheus.
  - Penempatan: render di halaman dashboard `apps/web/src/app/dashboard/page.tsx` dalam area `dashboard-metrics`.

- Auto-Refresh & Alert
  - Polling 10 detik pada widget; test e2e tidak perlu WebSocket.
  - Bila verifikasi gagal, tampilkan alert UI; opsional integrasi API notifikasi jika telah tersedia.

- CI Integrasi
  - Langkah download artefak baseline: `actions/download-artifact` bernama `baseline-metrics.json` (jika ada), salin ke `apps/web/e2e/state/metrics-baseline.json`.
  - Opsi update baseline: jalankan dengan `UPDATE_BASELINE=true` pada langkah e2e untuk memperbarui artefak; upload baseline baru via `actions/upload-artifact`.

- Dokumen `.trae/documents` (dibuat/diupdate):
  - `Baseline Metrics Assertions dan Dashboard Widget.md`: arsitektur, alur, struktur baseline, aturan expectedIncrement, prosedur update, failure handling.
  - `Rencana Eksekusi Mendalam_ Use Case + ReFactory Arsitektur SBA-Agentic.md`: skenario pemakaian baseline assertions + refactor ringan observability.
  - Update spesifikasi yang telah disebut: menambahkan bagian Observability QA & Visual Verification.

# Validasi
- Jalankan unit/integration untuk parser & health metrics delta.
- Jalankan e2e upload; verifikasi delta dan laporan.
- Pastikan widget menampilkan nilai dan respon tombol baseline.

# Dampak & Keamanan
- Tidak mengubah kontrak API metrik yang ada; menambah endpoint baseline non-kritis.
- Baseline file hanya untuk dev/CI; hindari penyimpanan rahasia.
- UI mengikuti a11y (aria-live untuk status, kontras warna memadai).

# Deliverables
- Helper + test E2E/Vitest untuk baseline.
- API baseline dan widget dashboard.
- CI steps untuk artefak baseline.
- Dokumen `.trae/documents` sesuai daftar pengguna.
