## Tujuan
- Semua aplikasi di `apps/*` lulus `pnpm -C <app> type-check:test`.
- Perbaikan berfokus pada pengetikan yang aman, tanpa mengubah perilaku runtime secara berisiko.

## Kondisi Saat Ini
- Lulus: `apps/app`, `apps/web`, `apps/marketing`.
- Gagal: `apps/api` (error pengetikan lintas modul), sehingga batch berhenti.
- Script `type-check:test` sudah tersedia di semua app (app, web, marketing, api, orchestrator, docs).

## Rencana Perbaikan (apps/api)
### 1) Tipe Postgrest/Supabase (menghindari `never`)
- Buat `apps/api/src/types/supabase.d.ts` berisi tipe minimal untuk tabel yang dipakai:
  - `audit_logs`, `control_state`, `task_runs`, `tasks` → definisikan `Row` dan helper dengan properti yang dipakai (mis. `id`, `level`, `message`, `context`, dll.).
- Gunakan generic pada client supabase sehingga `.insert/.update/.eq` tidak jatuh ke `never`.

### 2) Tipe StreamEvent & konsistensi gateway
- Tambah `apps/api/src/api/gateway/types.ts`:
  - `export type StreamEvent = { type: string; data: any; runId: string; ts?: string; toolCallId?: string }`.
- Update `StreamService.ts` agar menggunakan tipe ini; pastikan metode broadcast memakai `broadcastToTenant(..., 'streamMessage', event)`.
- Sesuaikan `index.ts` gateway: ekspor tipe dari `types.ts`.

### 3) Observability & Instrumentation
- `OpenTelemetryConfig.ts`:
  - Bungkus import instrumentasi opsional (BullMQ, Winston) dengan try/catch dan tipe longgar.
  - Hindari push-exporter type mismatch: gunakan adapter aman atau nonaktifkan reader Prometheus yang memerlukan `PushMetricExporter` dalam mode dev.
  - Guard akses `request.headers`/`response.headers` dan hindari akses `request.body` yang tidak ada pada Node HTTP.

### 4) Bull Queue API & Typing
- `QueueService.ts`:
  - Ganti `getPausedCount()` ke API yang tersedia (mis. `getJobCounts()`), atau cast aman sementara dengan TODO.
  - Pastikan `clean(Number(gracePeriodMs), 'completed')`/`'failed'` memakai angka.
- `queue.config.ts`:
  - Sederhanakan generics pada `Job<T,...>` untuk kompatibilitas; jika perlu gunakan helper wrapper bertipe lebih longgar.

### 5) Orchestrator & Tipe yang Hilang
- `orchestrator.service.ts`: pastikan `AgentMessage` diekspor dari `Orchestrator`, atau buat tipe lokal minimal dan gunakan itu.
- `Orchestrator.ts`: guard untuk nilai `keys().next().value` sebelum digunakan.

### 6) Guard Nilai Undefined & Pengetikan Ketat
- `agent/daemon.ts`:
  - Tambah guard untuk objek `task`, `run`, `chosen`, `cpuLoad` sebelum digunakan.
  - Pastikan nilai indeks pada `qValues` dan `counts` valid.
- `PerformanceMonitor.ts`: tambahkan guard pada akses array `samples`.

### 7) Storage Providers & Repository
- `GCSResumableProvider.ts`:
  - Sesuaikan opsi `createResumableUpload` dengan tipe sah; hapus properti tidak dikenal (mis. `contentType`) atau gunakan header terpisah.
- `UploadRepository.ts`:
  - Sudah diperbaiki block `abort` dan akses model via cast aman hingga skema Prisma sinkron.

## Eksekusi & Verifikasi
1) Implementasikan file d.ts Supabase dan `types.ts` StreamEvent; lakukan patch pada file yang disebut.
2) Jalankan: `pnpm -C apps/api type-check:test`.
3) Atasi sisa error secara iteratif sesuai kategori di atas hingga lulus.
4) Jalankan batch akhir:
   - `pnpm -r --workspace-root --filter ./apps/* run type-check:test`.

## Dokumentasi
- Perbarui `.trae/documents/Jalankan Type-Checking Test di Semua Aplikasi apps__.md`:
  - Perintah eksekusi, daftar error per app, solusi teknis, catatan arsitektur test-only tsconfig, dan alasan keamanan/performa.

## CI/CD & Kualitas
- Tambah job “Type Check (Tests)” untuk semua app.
- Monitor durasi dan stabilitas; gunakan `skipLibCheck` di konfigurasi test untuk menghindari noise dari deps eksternal.
- Hindari memasukkan rahasia pada file test/d.ts; gunakan guard dan cast aman hanya sebagai jembatan sementara.

## Output Diharapkan
- Semua aplikasi di `apps/*` lulus `type-check:test`.
- Dokumentasi proses tersinkron dan siap audit.
