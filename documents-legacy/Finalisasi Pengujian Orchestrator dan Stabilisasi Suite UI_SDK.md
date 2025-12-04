## Tujuan
- Menyelesaikan pengujian SDK Orchestrator hingga hijau penuh secara deterministik.
- Menyempurnakan pengujian UI (WebSocketProvider, Notifications, Dialog) agar stabil dan bebas flakiness.
- Melengkapi dokumentasi perubahan dan panduan verifikasi.

## Orchestrator Auto‑Stop (SDK)
- Tambah sampel error di pengujian agar memenuhi `minStopSamples` dengan cepat.
- Perpanjang `advanceTimersByTime` untuk memberi ruang eksekusi batch dan evaluasi `enforceFailSafe`/auto‑stop.
- Verifikasi asersi: `status.running === false` dan `status.paused === true` setelah jendela sampel terpenuhi.

## Fail‑Safe & Self‑Heal (SDK)
- Pastikan backoff self‑healing cukup (≥ initialBackoff) dan gunakan dua tahap `advanceTimersByTime`: pertama untuk pause, kedua untuk resume.
- Tambahkan asersi pada `lastHealAt` dan bahwa antrean/konkurensi berjalan kembali.

## UI Suite Stabilization
- WebSocketProvider: fokus verifikasi API (`subscribe`, `publish`, `getMetrics`, `reconnect`) tanpa bergantung konektivitas jaringan; gunakan wrapper provider.
- Notifications: finalisasi mock registry lokal agar event mengalir pada semua kasus (show/hide/clear, eksternal), serta verifikasi unsubscribe tidak melempar.
- Dialog: gunakan tombol Close terakses dan assert `onOpenChange(false)`.

## Verifikasi Workspace
- Jalankan pengujian di `packages/sdk`, `packages/ui`, `apps/app`, `apps/web`, `apps/marketing` dan pastikan hijau penuh.
- Catat hasil dan iterasi kecil bila perlu (hanya pada pengujian dan guard deterministik).

## Dokumentasi
- Tambahkan catatan stabilisasi akhir ke changelog:
  - Perbaikan pengujian Orchestrator (fail‑safe, self‑heal, auto‑stop, auto‑adjust).
  - Stabilisasi pengujian UI (WebSocketProvider, Notifications, Dialog, DecisionEngine).
- Sertakan pedoman: cara memeriksa audit log orchestrator (`getLogs()`), dan praktik menulis rule DecisionEngine yang valid.
