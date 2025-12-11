# Spesifikasi Teknis — Observability SDK

## Tujuan
- Konsumsi metrik otomatis dari App (provider) oleh Web (consumer)
- Injeksi `x-tenant-id` otomatis, autentikasi standar, format data konsisten
- Dukungan multi-tenant, isolasi data, dan dokumentasi API komprehensif

## Arsitektur & Alur Data
- Provider: App mengekspor `/api/metrics` (JSON) dan `/api/metrics/prometheus` (text)
- Consumer: Web menggunakan SDK untuk fetch, normalisasi, dan pelaporan ringan
- Normalisasi keluaran:
  - `latencyP95Ms`, `latencyP99Ms`, `errorRatePercent`, `throughputRps`
  - Counters: `sba_business_events_total`, `sba_business_errors_total`

## Mekanisme Sinkronisasi Provider↔Consumer
- Header `x-tenant-id` ditambahkan otomatis oleh SDK Web
- Autentikasi standar:
  - Dev: cookie `__test_auth=admin`
  - Prod: token/sesi tersentral
- Retry ringan dan fallback default metrics bila endpoint tidak tersedia

## API SDK
- Server:
  - `createObservability({ exporter })`
  - `metrics.counter(name).inc(value, labels)`
  - `metrics.histogram(name).observe(value, labels)`
  - `tracer.startSpan(name).end()`
- Web:
  - `fetchMetricsSummary(baseUrl, tenantId): string`
  - `fetchPrometheusText(baseUrl, tenantId): string`
  - `createWebObservability()`

## Multi-Tenant & Isolasi Data
- Label `tenant` wajib di semua metrik
- Konsumsi Web menambah `x-tenant-id` ke setiap request

## Dokumentasi Integrasi
- Konsumsi di Web:
  - Ganti fetch langsung di komponen dengan `fetchMetricsSummary` dan `fetchPrometheusText`
- Pelaporan klien:
  - Catat fetch dengan counter ringan `web_metrics_fetch_total`

## Validasi
- Unit: verifikasi normalisasi, label, dan counter/histogram lokal
- Integrasi: verifikasi output `/api/metrics` dan `/api/metrics/prometheus`
