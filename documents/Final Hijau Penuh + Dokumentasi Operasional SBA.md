## Target Utama
- Menyelaraskan timing pengujian fail-safe/self-heal Orchestrator agar deterministik.
- Menjalankan ulang seluruh suite (UI, apps, SDK) hingga hijau penuh.
- Memperbarui changelog dan pedoman operasional (audit log, rule DecisionEngine, praktik pengujian event-driven).

## Penyesuaian Pengujian Orchestrator
- Fail-safe + Self-heal:
  - Tingkatkan jeda pasca pause agar `selfHeal()` selesai dan satu tick berikutnya meng-clear `paused`.
  - Alternatif: turunkan `initialBackoffMs` di setup test dan gunakan dua tahap advance timers (pause → backoff → resume).
  - Asersi: `paused === false`, `lastHealAt` terdefinisi.
- Auto-stop Persistent Error:
  - Pastikan jumlah sampel error memenuhi `minStopSamples` dan dominasi `errCount > okCount` terpenuhi.
  - Selaraskan window evaluasi agar berhimpun dengan eksekusi batch, kemudian assert `paused === true`.

## Stabilitas Pengujian UI
- WebSocketProvider:
  - Fokus verifikasi API (`subscribe`, `publish`, `getMetrics`, `reconnect`) tanpa ketergantungan konektivitas.
- Notifications:
  - Pastikan mock registry event konsisten untuk semua skenario (show/hide/clear dan eksternal).
- Dialog:
  - Klik tombol Close yang terakses dan assert `onOpenChange(false)` secara stabil.

## Verifikasi Workspace
- Jalankan pengujian untuk `packages/ui`, `packages/sdk`, `apps/app`, `apps/web`, `apps/marketing`.
- Jika ada kegagalan residual, iterasi kecil pada test timing/guard hingga hijau penuh.

## Dokumentasi
- Perbarui `docs/CHANGELOG-SBA-2025-11-30.md` dengan:
  - Stabilisasi SSE/health route dan UI (Dialog, WebSocket, Notifications, DecisionEngine).
  - Operasional Orchestrator (fail-safe, self-heal, auto-stop, auto-adjust, audit).
- Tambahkan pedoman:
  - Cara membaca audit log dengan `getLogs()`.
  - Menulis rule DecisionEngine yang valid (hindari token ilegal; gunakan operator aman).
  - Praktik pengujian event-driven (registry mock, pemisahan konektivitas jaringan).

## Output Akhir
- Seluruh suite hijau penuh.
- Changelog final terbarui dengan pedoman operasional untuk SBA agentik berkelanjutan.