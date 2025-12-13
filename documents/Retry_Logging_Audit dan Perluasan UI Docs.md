## Tujuan
- Menambah reliability SyncStorageAdapter (retry + timeout + circuit breaker).
- Membangun logging modular terstruktur dan audit trail untuk dev.
- Meningkatkan coverage Application Service Dokumen ≥90% dan UI integration.
- Memperluas halaman "Docs" dengan JSON editor, schema validation, visual diff, dan UX lanjutan.

## Teknis: Retry + Timeout + Circuit Breaker
- Konfigurasi env (client):
  - `VITE_SYNC_RETRY_BASE_MS=100`
  - `VITE_SYNC_RETRY_MAX=3`
  - `VITE_SYNC_RETRY_MULTIPLIER=2`
  - `VITE_SYNC_TIMEOUT_MS=30000`
  - `VITE_SYNC_CB_OPEN_MS=60000` (cooldown saat circuit terbuka)
- Implementasi:
  - Utility `requestWithRetry<T>(call, opts)` di adapter:
    - Retry pada network errors (`ECONNRESET`, `ETIMEDOUT`) dan status `>=500`, `429`.
    - Exponential backoff: `delay = base * multiplier^attempt` (+ jitter kecil 10-20%).
    - AbortController dengan timeout per request.
  - Circuit breaker per endpoint key (`method:path`):
    - Tracking kegagalan beruntun; buka circuit bila > threshold (mis. 3) dan hentikan panggilan selama `openMs`.
    - Setengah terbuka setelah cooldown; satu percobaan untuk tutup circuit jika sukses.
- Integrasi ke `SyncStorageAdapter` default client hanya pada runtime dev/prod; untuk test (supertest) gunakan client injeksi tanpa timeout.

## Teknis: Conditional Logging
- Env: `VITE_DEBUG_SYNC=true` untuk mengaktifkan logging.
- Modul `Logger` (client):
  - Level: `debug|info|warn|error`, format JSON line.
  - Field: `timestamp (ISO)`, `level`, `correlationId`, `method`, `url`, `headers`, `body`, `status`, `responseHeaders`, `responseBody`, `errorStack`, `durationMs`.
  - Correlation ID: generate `uuid` per request; propagate di headers (`x-correlation-id`).
  - Output: `console.log` hanya saat debug; opsional kirim ke API `/api/logs` jika diaktifkan.

## Teknis: Audit Trail (Dev)
- Server (Express):
  - Route: `POST /api/audit/log` (tulis ke file), `GET /api/audit/query` (filter), `DELETE /api/audit/purge` otomatis via job.
  - Lokasi file: `api/logs/audit.log` (JSON Lines). Format: `timestamp|actor|action|entity|before|after` → disimpan sebagai objek JSON `{ts, actor:{id,role}, action, entity:{type,id}, before, after}`.
  - Purging: job harian, hapus entries umur >30 hari.
- Client utility:
  - Fungsi `auditCUD(actor, action, entity, before, after)` dipanggil setelah operasi dokumen (create/update/delete).

## Pengujian (Coverage ≥90%)
- Unit tests untuk `DocumentService`:
  - `create/get/update/delete/list` sukses.
  - Error scenarios: invalid key, version invalid, mock repo throw (400, 500, timeout), conflict.
  - Boundary: empty input, key max length (mis. 128), value size.
- Integration tests (UI):
  - React Testing Library + MSW untuk mock API.
  - Interaksi: input, klik tombol CRUD, tampilkan loading/error.
  - Responsiveness: ubah viewport (mobile/tablet/desktop) dan verifikasi layout.
  - State management: gunakan `RepositoryProvider` (menggantikan referensi Vuex/Pinia dengan zustand/DI yang sudah ada).

## Perluasan UI "Docs"
- JSON Editor:
  - Monaco Editor (dependency `monaco-editor`), sanitasi input (hindari `dangerouslySetInnerHTML`, validasi JSON murni; bila ada tampilan HTML masukkan `DOMPurify`).
  - JSON Schema validation (library `ajv`), tampilkan error list.
  - Auto-format (Prettier `prettier/standalone` + parser `json`), shortcut `Ctrl+Shift+F`.
  - Keyboard shortcuts: `Ctrl+S` (save/update), `Ctrl+F` (format), `Esc` (cancel).
- Konflik versi:
  - Visual diff (library `diff-match-patch`) antara `ours` vs `theirs`.
  - Metadata revisi (author, timestamp) — dari audit trail/extended server fields; fallback ke timestamp server.
  - Opsi resolusi: `keep theirs`, `keep ours`, `merge` (hasil merge ditulis sebagai update dengan versi terbaru).
- UX lanjutan:
  - Breadcrumb (Docs / [Key]).
  - Quick access toolbar (New, Save, Delete, Format, Validate).
  - Keyboard navigation antar fields.
  - Bulk operations (select multi keys lalu delete/update massal bila schema kompatibel).
  - Advanced search dengan filter (by key prefix, version range), client-side terlebih dahulu; server-side opsional.

## Perubahan Kode yang Direncanakan
- Client:
  - `src/infra/storage/SyncStorageAdapter.ts`: tambah `requestWithRetry`, timeout, circuit breaker; injeksi `Logger` & correlation ID.
  - `src/lib/logger.ts`: modul Logger & helper `createCorrelationId()`.
  - `src/domain/document/Document.service.ts`: panggil `auditCUD` setelah operasi berhasil.
  - `src/pages/Docs.tsx`: integrasi Monaco, Ajv, Prettier, diff-match-patch, toolbar dan shortcuts.
- Server:
  - `api/routes/audit.ts`: log, query, purge.
  - Scheduler/purge: sederhana dengan `setInterval` di `api/server.ts` untuk dev; atau manual endpoint.

## Dependencies Baru
- `monaco-editor`, `ajv`, `prettier`, `diff-match-patch`, `uuid` (client).
- Dev/test: `msw` untuk mock API.

## Acceptance Criteria
- Retry/backoff + timeout + circuit breaker aktif sesuai env; tidak mengganggu tests.
- Logging JSON terstruktur muncul hanya saat `VITE_DEBUG_SYNC=true`.
- Audit trail mencatat operasi CUD saat dev, dengan purging >30 hari.
- Coverage DocumentService ≥90%, UI integration tests berjalan; MSW dipakai.
- Halaman "Docs" memiliki editor JSON dengan format/validasi, diff visual untuk konflik, dan UX lanjutan.

Siap implementasi sesuai plan di atas. Setelah konfirmasi, saya akan menambahkan modul utilitas, route audit, dependencies, memperbarui adapter, memperluas UI, dan menulis pengujian hingga semua kriteria terpenuhi.