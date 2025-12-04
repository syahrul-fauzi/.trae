## Tujuan
- Menyempurnakan UI/UX, menghapus flakiness, dan memastikan seluruh pengujian hijau.
- Menguatkan sistem agentik berkelanjutan (orchestrator) dengan fail‑safe, self‑healing, dan audit.
- Melengkapi dokumentasi perubahan dan pedoman verifikasi.

## Audit & Perbaikan Pengujian UI
1. AGDialog
- Sesuaikan pengujian untuk mengklik tombol Close yang terakses (`getByRole('button', { name: /close/i })`) dan assert `onOpenChange(false)`.
- Pastikan `DialogPrimitive.Close` memicu `onOpenChange` melalui root `Dialog`.

2. WebSocketProvider
- Sederhanakan assertion test “provides context” agar tidak bergantung status konektivitas; fokus pada ketersediaan API (`subscribe`, `publish`, `getMetrics`).
- Tambahkan mock WebSocket optional bila perlu untuk skenario event round‑trip.

3. useAGNotifications
- Finalisasi mock `publish/subscribe` dengan registry lokal agar kasus publish/show/hide/clear dan event eksternal (notification:external/hide‑external/clear‑external) hijau.
- Perkuat test “unsubscribe on unmount” dengan verifikasi tidak ada throw pada publish setelah unmount.

4. DecisionEngine
- Mempertahankan guard regex sebelum `new Function` untuk menolak kondisi tidak valid; nonaktifkan logging error pada path invalid agar test bersih.
- Tambah satu test validasi kompleks untuk memastikan guard tidak menghalangi kondisi sah.

5. Komponen Lain
- SearchBar: pastikan semua interaksi dibungkus `act` dan gunakan `userEvent`.
- Select a11y: pastikan `SelectTrigger`/`SelectContent` tidak dinest di dalam native `<select>`.
- Tooltip: mock menerima `sideOffset` agar tidak ada unknown‑prop warning.

## Operasional Agentik Berkelanjutan
1. Orchestrator
- Verifikasi tick loop, auto‑adjust concurrency, fail‑safe window, dan self‑healing bekerja sesuai konfigurasi.
- Tambah uji fungsional terpisah untuk error window, pause/resume, dan threshold auto‑stop.

2. Integrasi Boot
- Tinjau lokasi boot orchestrator yang aman di runtime (hindari side‑effect pada import yang tidak diinginkan); bila perlu, pindahkan boot ke entry server yang terjamin hanya dieksekusi sekali.

## Observability & Logging
- Tambahkan ringkasan dokumentasi audit log (format, level, meta) dan cara inspeksi (`getLogs()`).
- Pastikan tidak ada kebocoran PII di meta.

## Dokumentasi
- Tambah changelog ringkas yang merangkum:
  - Stabilisasi SSE/health route.
  - Perbaikan testing (Dialog, WebSocket, Notifications, DecisionEngine, Select, Tooltip, SearchBar).
  - Operasional orchestrator (fail‑safe, self‑healing, auto‑adjust, audit).

## Verifikasi
- Jalankan pengujian pada seluruh workspace (`apps/app`, `apps/marketing`, `apps/web`, `packages/ui`, `packages/sdk`).
- Catat hasil dan pastikan hijau penuh; bila ada kegagalan, iterasi cepat sesuai area di atas.

## Handover
- Sertakan pedoman developer: cara menambah rule DecisionEngine, cara menambahkan notifikasi, dan cara memeriksa log orchestrator.
