## Tujuan
- Menuntaskan seluruh pengujian (UI, apps, SDK) hingga hijau penuh secara deterministik.
- Menyelaraskan pengujian fail‑safe/self‑heal Orchestrator agar stabil.
- Melengkapi changelog dan pedoman operasional agentik.

## Penyesuaian Pengujian Orchestrator
1. Fail‑safe + Self‑Heal
- Naikkan durasi jeda pasca pause (advanceTimers) agar self‑heal dan resume terdeteksi konsisten.
- Alternatif: turunkan initialBackoff lalu gunakan dua tahap jeda (pause → backoff → resume).
- Verifikasi: `paused === false` dan `lastHealAt` terdefinisi.

2. Auto‑Stop Persistent Error
- Pastikan jumlah error >= minStopSamples dan dominasi error>success terpenuhi.
- Tambah sampel error jika perlu; selaraskan window evaluasi stopThreshold.
- Verifikasi: `paused === true` (running boleh true/false tergantung interval aktif, fokus pada pause).

## Stabilitas UI/Bundel
- Pastikan WebSocketProvider tests fokus ke API (`subscribe`, `publish`, `getMetrics`, `reconnect`) tanpa konektivitas jaringan.
- Notifications tests: registry event mock konsisten untuk semua kasus show/hide/clear dan eksternal.
- Dialog tests: klik tombol Close terakses dan assert `onOpenChange(false)`.

## Verifikasi Workspace
- Jalankan pengujian untuk `packages/ui`, `packages/sdk`, `apps/app`, `apps/web`, `apps/marketing`.
- Catat hasil; lakukan iterasi kecil pada tests hingga hijau penuh.

## Dokumentasi
- Perbarui `docs/CHANGELOG‑SBA‑2025‑11‑30.md` dengan:
  - Stabilisasi SSE/health route.
  - Perbaikan pengujian UI (Dialog, WebSocket, Notifications, DecisionEngine).
  - Operasional orchestrator (fail‑safe, self‑heal, auto‑stop, auto‑adjust, audit).
- Tambahkan pedoman operasi:
  - Cara membaca audit log (`getLogs()`),
  - Menulis rule DecisionEngine yang valid (hindari token ilegal),
  - Praktik pengujian untuk event‑driven komponen.

## Outcome
- Pengujian hijau penuh, dokumentasi final siap, sistem agentik beroperasi stabil dan terukur.