## Topik/Konteks
- Melanjutkan penguatan endpoint `api/alerts` dengan: batas ukuran payload berbasis konten, skenario standar (HIGH_PRIORITY/BULK/DEFAULT) + fallback, dan laporan performa per skenario.
- Integrasi tetap kompatibel dengan retry/backoff, rate-limit uji, audit logging, dan E2E yang sudah ada.

## Poin-Poin Penting
- Pengukuran ukuran: gunakan `Buffer.byteLength(JSON.stringify(payload))` pada wrapper lengkap `{ type, payload, ts }`.
- Skenario standar: `HIGH_PRIORITY`, `BULK`, `DEFAULT`; skenario tidak dikenal → fallback otomatis ke `DEFAULT` + `console.warn`.
- Konfigurasi granular: `ALERTS_MAX_PAYLOAD_BYTES_<SCENARIO>` meng-override `ALERTS_MAX_PAYLOAD_BYTES` (default 1MB).
- Laporan performa: JSON di `artifacts/performance-reports/{timestamp}-{scenario}.json` berisi `averageLatencyMs`, `attempts`, `successRate`, `errorRate`, `payloadBytes`, `webhookUrl`, `at`.

## Tujuan/Hasil
- Validasi payload limit per skenario berjalan konsisten dan dapat dikonfigurasi tanpa perubahan kode pemanggil.
- Setiap eksekusi skenario menghasilkan laporan performa yang akurat dan mudah dikonsumsi alat analitik.
- Tidak ada regresi pada fungsionalitas yang sudah ada (retry/backoff, rate-limit headers, audit logging, E2E).

## Batasan/Persyaratan
- Backward compatibility wajib: field `scenario` opsional dan tidak mengubah antarmuka lain.
- Overhead runtime minimal: normalisasi skenario dan pembacaan env dilakukan ringan.
- Keamanan: tidak menyimpan data sensitif dalam laporan; batasi ukuran payload sesuai kebijakan.

## Langkah Eksekusi
- Konfigurasi env contoh:
  - Global: `ALERTS_MAX_PAYLOAD_BYTES=1048576`
  - Per skenario: `ALERTS_MAX_PAYLOAD_BYTES_HIGH_PRIORITY=262144`, `ALERTS_MAX_PAYLOAD_BYTES_BULK=2097152`, `ALERTS_MAX_PAYLOAD_BYTES_DEFAULT=1048576`
- Permintaan contoh:
  - `{ "scenario":"BULK", "type":"bulk", "payload":{...}, "webhookUrl":"http://localhost:4010/webhook?status=200" }`
- Validasi otomatis:
  - Jika `actualBytes > maxBytes` → response 413 `{ ok:false, error:'payload_too_large', scenario, maxBytes, actualBytes }`
  - Jika skenario tidak dikenal → gunakan batas `DEFAULT` dan log warning.

## Pengujian & Verifikasi
- Unit tests:
  - Payload limit global dan per skenario (`413`, nilai `maxBytes/actualBytes`, `scenario`).
  - Fallback skenario tidak dikenal memicu warning dan batas `DEFAULT`.
  - Rate-limit headers tetap berfungsi (429 + `X-RateLimit-*`).
- E2E:
  - Jalankan `pnpm -C apps/app e2e:webhook`; verifikasi `artifacts/performance-reports/*.json` dan `mock-events.json`.
- Benchmark ringan:
  - Uji beberapa ukuran payload (256KB, 1MB, 2MB) untuk ketiga skenario; catat `averageLatencyMs` dan `attempts`.

## Dokumentasi
- Tambahkan bagian "Skenario & Batas Payload" pada dokumen E2E:
  - Daftar skenario, format env, contoh request, penjelasan error `payload_too_large`.
- Tambahkan "Laporan Performa" dengan struktur file dan contoh isi JSON.

## Rencana Rollout
- Dev/QA: aktifkan env per skenario, jalankan unit/E2E, review artifacts.
- Staging: validasi performa dan memory; sesuaikan batas sesuai profil beban.
- Produksi: aktifkan batas konservatif; monitor laporan performa untuk tuning.

## Risiko & Mitigasi
- Payload besar memicu lonjakan memori → gunakan batas konservatif dan pantau `averageLatencyMs`.
- Skenario salah konfigurasi → validator fallback `DEFAULT` + warning.
- Flaky jaringan → pertahankan retry/backoff dan laporan attempts/latency untuk diagnosis.
