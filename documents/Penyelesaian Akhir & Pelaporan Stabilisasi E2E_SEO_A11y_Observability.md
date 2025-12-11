## Identifikasi Tugas
- Tugas aktif pada daftar pelacakan: semua telah ditandai selesai (observability client, verifikasi meta/a11y, validasi /api/health, rerun subset E2E, finalisasi laporan).
- Verifikasi tambahan yang masih relevan untuk penutupan:
  - Konsistensi artefak pengujian terorganisir di `apps/app/test-results/*` (junit, json, html-report, screenshots, video, trace).
  - Konsistensi port lintas komponen (`PLAYWRIGHT_BASE_URL`, `NEXT_PUBLIC_APP_URL`) saat menjalankan ulang E2E penuh.

## Prioritas Penyelesaian
- Urgensi tinggi: final verifikasi artefak & ringkasan eksekusi; pastikan canonical/OG dan landmark a11y tetap konsisten.
- Dampak: memastikan bukti pengujian lengkap untuk audit; menjaga stabilitas observability.
- Kompleksitas: rendah–sedang (logistik artefak, konsistensi env, pengecekan lintas suite).

## Tinjau Persyaratan & Spesifikasi
- SEO/Metadata: canonical tanpa locale, OG/Twitter lengkap dan konsisten (`apps/app/src/shared/lib/metadata.ts:26–59`; heads di `apps/app/src/app/(authenticated)/integrations/head.tsx:11–16`, `monitoring/head.tsx:11–16`).
- A11y: landmark `header/nav/main/footer`, `h1` hadir; dashboard berat di Monitoring dibungkam a11y (`apps/app/src/app/(authenticated)/monitoring/page.tsx:44–47`).
- Observability: status umum, checks, dependencies tampil (auto-refresh & cleanup `apps/app/src/app/observability/ObservabilityClient.tsx:78–141`).
- Health: selalu 200 dan no-cache (`apps/app/src/app/api/health/route.ts:25–31`).
- E2E: reporter, artifacts, outputDir, snapshotDir sesuai (`apps/app/playwright.config.ts:31–53, 65–76`).

## Verifikasi Kemajuan & Penyelesaian Sisa
- Konfirmasi artefak lengkap di `apps/app/test-results/*` (junit.xml, results.json, html-report/, test-failed-*.png, video.webm, trace.zip).
- Jalankan ulang E2E dengan port seragam (3001 atau fallback 3002 bila 3001 terpakai), pekerja 1 untuk stabilitas, skip webServer jika dev server aktif.
- Pastikan skenario utama (meta/a11y Integrations & Monitoring, observability, smoke pages, auth) dieksekusi dan artefaknya tersimpan.

## Pengujian & Validasi
- E2E penuh: proyek chromium/firefox/webkit; gunakan `PLAYWRIGHT_BASE_URL` dan `NEXT_PUBLIC_APP_URL` seragam.
- Validasi manual SEO/a11y:
  - Integrations `apps/app/src/app/(authenticated)/integrations/page.tsx:20–51` dan Monitoring `apps/app/src/app/(authenticated)/monitoring/page.tsx:21–53`.
  - Periksa canonical/OG di halaman melalui HTTP.
- Observability: muat `/observability` dan cek kartu status (updatedAt, checks/deps), tanpa error konsol.

## Dokumentasi Hasil Akhir
- Perbarui `apps/app/docs/FINAL_REPORT.md` dengan:
  - Daftar pekerjaan selesai, waktu, masalah & solusi, tautan artefak.
  - Catatan port konsistensi dan langkah eksekusi ulang.

## Pelaporan Berkala
- Ringkas lulus/gagal per suite dari `results.json`/`junit.xml`.
- Catat isu koneksi atau flakiness bila muncul, dan solusinya (seragam env, workers=1, skip webServer saat server aktif).

## Standar Kualitas
- Memenuhi persyaratan fungsional (SEO lengkap, a11y landmarks/h1, observability auto-refresh stabil, health 200/no-cache).
- Sesuai standar kualitas (artefak lengkap, struktur direktorinya benar, referensi file jelas).
- Tepat waktu: eksekusi sekali jalan dengan verifikasi artefak segera setelah run.

Setujui rencana ini, dan saya akan mengeksekusi verifikasi akhir artefak, memastikan port seragam untuk run E2E, menjalankan ulang bila perlu, dan memperbarui laporan akhir beserta status berkala.