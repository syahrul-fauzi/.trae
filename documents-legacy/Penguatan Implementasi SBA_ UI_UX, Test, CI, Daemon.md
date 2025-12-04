## Sasaran Utama
- Perkuat UI/UX chat dan komponen a11y agar konsisten, dapat diakses, dan teruji.
- Lengkapi pengujian: unit, integrasi, dan E2E untuk SDK Tools, Chat, Daemon, Orchestrator.
- Tingkatkan CI: coverage gate, jalankan E2E lintas apps, unggah artefak (OpenAPI, laporan).
- Finalisasi dokumentasi teknis dan Use-Case dengan checklist QA dan hasil audit.

## Frontend Web (apps/web)
- A11y Chat:
  - Tambah `role="status"` dan `aria-live` untuk area streaming di `apps/web/src/features/chat/components/ChatWindow.tsx`.
  - Pastikan daftar pesan memiliki `role="log"`, item berlabel jelas di `ChatMessage.tsx`.
  - Verifikasi landmark `header/main/form` dan shortcut keyboard (`g`, Arrow/Home/End/PageUp/PageDown).
- Integrasi Tools SDK:
  - Demo aksi: render dokumen dan create task dari UI (memakai `@sba/sdk`).
- Tes E2E:
  - Buat `apps/web/e2e/chat-a11y.spec.ts` untuk landmark, live region, fokus, shortcut.
  - Buat `apps/web/e2e/tools-flow.spec.ts` dengan mock `/tools/renderDocument` dan `/tools/createTask`; uji keberhasilan dan error (RATE_LIMIT retry, BAD_REQUEST).

## App (apps/app)
- Review dan lengkapi E2E a11y yang sudah ada untuk skenario dialog dan panel agen; tambahkan verifikasi landmark konsisten saat berbagai layout aktif.
- Pastikan hook kontrol agen (`apps/app/src/features/agentic/hooks/useAgentControl.ts`) memunculkan status aksesibel pada perubahan (toast berlabel, live region).

## SDK Tools (`packages/sdk`)
- Unit test `packages/sdk/src/tools.test.ts`:
  - Mock `fetch`; uji `safeCall` retry pada `RATE_LIMIT` dengan `retryable: true`.
  - Validasi pemetaan `ErrorModel` untuk kode `BAD_REQUEST/CONFLICT/UNAVAILABLE`.
  - Uji idempotency parameter untuk `createTask` dan `renderDocument` (ketika disediakan).

## Backend API Daemon (`apps/api`)
- Tambah test `apps/api/src/agent/daemon.test.ts`:
  - Simulasikan error berturut untuk memicu failsafe/circuit breaker, verifikasi `paused` dan `cooldown_ms`.
  - Uji penyesuaian concurrency via RL bandit dan guard memori/backlog.
  - Verifikasi audit log dipanggil dan metrik dikirim (mock exporter).

## Orchestrator
- Tes retry/backoff, rate-limit, dan threshold stop pada antrian eksekusi (`apps/orchestrator/src/engine.ts`).

## OpenAPI & Dokumentasi
- Selaraskan `ErrorModel` di `/.trae/documents/Smart Business Assistant/docs/api-openapi.yaml` dengan implementasi SDK; sertakan contoh sukses/error.
- Perbarui `/.trae/documents/Use-Case & Ide SaaS untuk Smart Business Assistant (SBA).md`:
  - Tambah QA checklist (UI/UX, a11y, SDK, Daemon, CI) dan ringkasan hasil pengujian.
  - Tautkan diagram dan kontrak API; cantumkan acceptance criteria.

## CI/CD
- Perluas `.github/workflows/ci.yml`:
  - Matrix untuk `apps/web`, `apps/app`, `apps/orchestrator`, `apps/api` (lint, type-check, unit/integrasi).
  - Jalankan E2E untuk `apps/web` dan `apps/app` (Playwright install + test).
  - Coverage gate: jalankan dengan `--coverage` dan gagal bila di bawah threshold.
  - Unggah artefak: `openapi.json`, laporan Playwright, dan (opsional) Storybook.

## Verifikasi & Penerimaan
- Semua tes hijau: unit/integrasi/E2E dan coverage memenuhi ambang.
- A11y audit: landmark, live region, label, fokus/keyboard lulus.
- Daemon: skenario failsafe/cooldown/resume dan penyesuaian concurrency terverifikasi.
- Dokumen Use-Case diperbarui dengan hasil pengujian dan checklist.

## Risiko & Mitigasi
- Flakiness E2E → gunakan penantian eksplisit pada event streaming dan selector stabil (`data-testid`).
- Perbedaan kontrak API → tambah kontrak test terhadap OpenAPI untuk SDK.

Konfirmasi rencana ini, maka saya lanjut implementasi, menulis tes, memperbarui CI, dan memvalidasi end-to-end hingga semua kriteria terpenuhi.