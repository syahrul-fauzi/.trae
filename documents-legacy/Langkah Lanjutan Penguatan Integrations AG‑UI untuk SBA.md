# Langkah Lanjutan Penguatan Integrations AG‑UI untuk SBA

## Integrasi OpenAI SDK
- Injeksi client SDK ke `OpenAIStreamingAdapter` untuk streaming delta.
- Konfigurasi env aman (server‑side), tanpa log secrets; gunakan `process.env.OPENAI_API_KEY`.
- Contoh kode disediakan di README paket.

## Observability Ringan
- Tambahkan tag `tenantId` pada event/metrik.
- Kumpulkan metrik dasar: jumlah event, durasi, error rate; expose di JSON dan header SSE.

## Idempotensi
- Gunakan `idempotencyKey` (default `runId`) yang dipropagasi ke setiap event untuk mencegah duplikasi side‑effect.
- Terapkan di jalur eksekusi tool/sinkronisasi.

## Pengujian
- Unit/integrasi untuk encoder, HttpAgent, adapters (termasuk SDK nyata).
- Route `agents/run`: SSE/JSON normal dan error.
- UI E2E: streaming SSE, fallback JSON, dan banner error.
- Kinerja: uji beban SSE (k6) untuk throughput & latensi.

## Keamanan
- Rate limiting ringan, retry/backoff.
- Sanitasi payload, batas ukuran body.
- Hindari logging secrets; gunakan env di server saja.

## Adopsi Produksi
- Dokumentasikan konfigurasi SDK & variabel env.
- Siapkan dashboard observability dasar.
- Review RBAC dan multi‑tenant tags.
