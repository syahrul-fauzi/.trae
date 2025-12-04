# Troubleshooting SBA Agentic

## Login Bounce / Preview
- Set `NEXT_PUBLIC_PREVIEW_ALLOW_GUEST=true` untuk guest preview.
- Pastikan halaman kritis menggunakan `export const dynamic = 'force-static'`.

## SSE/WS Koneksi
- Klien SSE otomatis fallback ke long‑poll saat error.
- Cek endpoint: `/api/runs/{runId}/events` dan `/api/test/sse`.

## Metadata & Hydration
- Hindari metadata duplikat (gunakan `generateMetadata` pada halaman bersamaan dengan `metadata` global).
- Gunakan `server-only` pada env parsing.

## Crypto & Pub/Sub
- AES‑GCM fallback ke `json:` bila key salah.
- Pub/Sub menggunakan `kv.publish` dengan payload JSON.

## Observability
- Prometheus: `/api/metrics`, `/api/metrics/prometheus`.
- UI ringkas: `/observability`.

