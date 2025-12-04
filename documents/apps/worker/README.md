# RANCANGAN LENGKAP & MENDALAM — `apps/worker` (Background Workers)

## Tujuan & Fungsi
- Memproses job latar belakang: ETL, sinkronisasi integrasi, pengiriman notifikasi, housekeeping.

## Fitur Utama
- Retry mekanisme (eksponensial backoff), idempotensi, error handling terstruktur, logging komprehensif, metrik throughput & latensi.

## Prasyarat Sistem
- Node.js 20+, PNPM 9+, queue backend (Redis/SQS), akses API.

## Instalasi & Konfigurasi
- Instal: `pnpm install`, jalankan: `pnpm dev:worker`.
- Env: `QUEUE_URL`, `WORKER_CONCURRENCY`, `RETRY_POLICY`.

## Penggunaan Dasar
- Enqueue job dari API; worker memproses sesuai jenis tugas; pantau metrik.

## Struktur Direktori
```
apps/worker/
├─ src/jobs/{etl,crmSync,notify}
├─ src/lib/{queue,logger,retry}
├─ src/config/{concurrency,policy}
└─ index.ts
```

## Keandalan & Skalabilitas
- Auto-scaling berdasarkan kedalaman antrian; idempotensi; dead-letter queue.

## Observability
- Logs terstruktur; tracing job lifecycle; metrik `processed/s`, p95 latensi.

## Pengujian
- Unit untuk job & libs; integration untuk queue; perf smoke.

## Kontribusi & Lisensi
- PR dengan lint/test hijau; lisensi MIT.

