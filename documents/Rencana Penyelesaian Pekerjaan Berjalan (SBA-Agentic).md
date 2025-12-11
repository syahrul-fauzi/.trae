## Prioritas Pekerjaan
- High (rilis/QA):
  - Lengkapi queue stubs untuk WorkerHealth/Metrics/Scheduler (getActiveCount/getCompletedCount/getFailedCount/getJobs, dsb).
  - Normalisasi resolver path untuk storage provider tests dan konsistensi alias (rujukan: `apps/api/vitest.config.ts`).
  - Sinkronisasi penuh orchestrator fixtures dan integrasi util schema validation di setup test.
  - Verifikasi artefak CI: coverage & test reports tersedia, gates menegakkan ambang batas.
- Medium:
  - Implement register/login/logout di `workspace/header-sidebar-app/api/routes/auth.ts:14,22,30`.
  - Tambahkan aksi “Open agent settings” di `apps/app/src/features/agui/ui/AGUIAgentList.tsx:206`.
  - Implement `updateMessage`/`deleteMessage` di `apps/web/src/features/chat/lib/useChat.ts:593,596`.
  - Integrasi analytics & toast di `apps/web/src/shared/lib/error-handling.ts:241,337`.
  - Integrasi error tracking di `apps/web/src/shared/ui/ErrorBoundary.tsx:44`.
- Low:
  - Server-side search page + metadata di `apps/docs/shared/testing/metadata.integration.test.ts:12`.
  - Perbaiki AG Events di `apps/marketing/src/features/communication/ui/ContactForm.tsx:26,86` dan `LeadForm.tsx:18,47`.

## Status & Hambatan (ringkas)
- Queue stubs: ada dasar pendaftaran/listing; belum lengkap untuk metrik/health (hambatan: cakupan metode belum seragam).
- Storage provider resolver: alias stub AWS & storage mock sudah ada; perlu normalisasi path untuk skenario edge.
- Orchestrator fixtures: mayoritas selaras; butuh final review dan utility validasi schema di beforeAll.
- CI artefak/gates: workflow rilis tersedia; perlu audit bahwa laporan coverage ter-publish dan threshold ditegakkan.
- TODO fungsional (auth/chat/marketing/docs): belum diimplementasikan.

## Langkah Konkret
- Queue stubs: tambahkan method metrik/health/scheduler yang dipanggil oleh modul worker; perluasan unit test untuk setiap method.
- Storage tests: tambahkan util normalisasi path, uji variasi path (posix/windows), pastikan alias vitest memetakan stub dengan konsisten.
- Orchestrator: konsolidasikan fixtures, impor terpadu, tambahkan validator schema di setup test; tambah negative/edge-case.
- CI: pastikan workflow menghasilkan laporan coverage (text+html), publikasi artefak, dan langkah guard gagal jika < threshold.
- Auth routes: implement register/login/logout minimal-viable dengan validasi, sesi/token mock, dan unit test.
- Chat useChat: lengkapi update/delete dengan state sync dan test.
- Error handling: kirim analytics (no-op di dev), hubungkan toast notifier; tambahkan guard di production.
- ErrorBoundary: integrasikan placeholder provider (mis. Sentry stub) melalui interface agar aman.
- Marketing forms: perbaiki AG Events integrasi dengan adapter event; tambahkan test rendering.
- Docs search metadata: buat halaman server-side atau util generateMetadata untuk test lulus.

## Alokasi Sumber Daya
- Engineer A: Queue stubs + orchestrator fixtures.
- Engineer B: Storage provider tests + CI artefak/gates.
- Engineer C: Auth routes + Chat useChat.
- Engineer D: Error handling/Boundary + Marketing forms + Docs metadata.
- Waktu: 4–5 hari kerja; alat: runner CI, Vitest, Playwright (terminal e2e telah berjalan), Changesets.

## Timeline & Checkpoints
- Hari 1:
  - Lengkapi queue stubs; normalisasi storage resolver.
  - Checkpoint: semua unit tests worker+storage hijau.
- Hari 2:
  - Finalisasi orchestrator fixtures + schema validator.
  - Checkpoint: test orchestrator >90% coverage bagian terkait.
- Hari 3:
  - Implement auth routes (register/login/logout) + tests.
  - Checkpoint: lint/type-check apps terkait hijau.
- Hari 4:
  - Chat update/delete + Error handling/Boundary.
  - Checkpoint: web tests hijau, tidak ada regresi.
- Hari 5:
  - Marketing AG Events + Docs metadata; audit CI artefak/gates.
  - Checkpoint: workflow rilis green, coverage memenuhi threshold, artefak terpublikasi.

## Kriteria Penyelesaian
- Semua tests hijau (unit/integration/e2e), type-check bersih.
- Coverage memenuhi threshold di `apps/api/vitest.config.ts` dan proyek web.
- Pipeline rilis berjalan tanpa intervensi manual; artefak coverage/test tersedia.
- TODO yang terdaftar di atas terselesaikan atau ditunda dengan alasan terdokumentasi.

## Monitoring
- Daily check: status CI, flakiness report, durasi job, coverage trend.
- Alert: kegagalan gates memicu notifikasi; e2e Playwright dimonitor dari runner aktif.
- Review PR: pastikan tidak ada kebocoran dependency real (Redis/AWS) di lingkungan test.

## Dokumentasi
- Catat perubahan, solusi, dan hasil di docs/release berikut rujukan file dan test.
- Tambahkan ringkasan di changelog internal dan ADR bila mempengaruhi arsitektur.

## Review Akhir
- Evaluasi efektivitas proses (durasi, stabilitas CI, flakiness).
- Pelajaran: standar stub/alias, kontrak OpenAPI, kebijakan gates.
- Rekomendasi: template test setup terpadu, checklist pre-merge, dashboard coverage.