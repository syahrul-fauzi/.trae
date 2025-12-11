## Tujuan & Cakupan
- Menyempurnakan Agent-Flows dengan review internal, penambahan sumber BPMN/Draw.io untuk flow rinci, sinkronisasi kontrak event SSE/WS, serta uji kontrak otomatis berstandar CIA.
- Fitur yang dicakup: interrupt/resume, multimodal messages, analytics heatmap, knowledge operations, RBAC, ensure tenant header.

## Review & Visualisasi
- Buka dan analisis semua dokumen di `workspace/04_Agent-Flows/*`.
- Render dan verifikasi diagram mermaid (state/decision/pipeline) untuk konsistensi notasi, kelengkapan alur, dan kesesuaian bisnis.
- Hasil: laporan review di `docs/development/agent-flows/REVIEW-20251208.md` memuat temuan & rekomendasi perubahan.

## Sumber BPMN/Draw.io
- Identifikasi flow yang perlu detail proses (prioritas: `agent_interrupt_resume`, `multimodal_messages`, `knowledge_operations`).
- Tambahkan file sumber di `workspace/04_Agent-Flows/bpmn/`:
  - `agent_interrupt_resume.bpmn` dan `agent_interrupt_resume.drawio`
  - `multimodal_messages.bpmn` dan `multimodal_messages.drawio`
  - `knowledge_operations.bpmn` dan `knowledge_operations.drawio`
- Anotasi jelas (swimlanes: UI/API/Orchestrator/Agent), versioning terkelola, referensi silang dari markdown flow.

## Sinkronisasi Kontrak Event (SSE/WS)
- Dokumentasikan tipe event & payload schema di `workspace/04_Agent-Flows/contracts/events.md` (RUN_STARTED, STEP_DECISION, TOOL_CALL_REQUESTED/RESULT, RUN_INTERRUPTED, RUN_RESUMED, RUN_FINISHED, dsb.).
- Validasi keselarasan dengan orchestrator (`apps/orchestrator/src/engine.ts`, `apps/orchestrator/src/domain.ts`) dan AG-UI events (`packages/ui/src/ag-ui/hooks/useAGEvents.ts`).
- Rancang skema formal (JSON Schema/Zod) untuk event, dengan korelasi `requestId`, `x-tenant-id`, `runId`, `threadId`, `agentId`, `toolCallId/interruptId`.
- Hasil: dokumen kontrak final + draft skema `packages/shared/src/schemas/agent-events.ts` dan `packages/shared/schemas/agent-events.schema.json` (siap diimplementasikan).

## Uji Kontrak CIA
- Confidentiality:
  - Test bahwa konten reasoning yang sensitif disajikan terenkripsi/di-redact sesuai README (ReasoningMessageStartEvent).
  - Verifikasi tidak ada secrets di log; guard scrubbing aktif.
- Integrity:
  - Tambahkan rencana validasi checksum/HMAC signature untuk event stream; uji verifikasi tanda tangan dan deteksi manipulasi payload.
  - Pastikan `requestId` konsisten sepanjang alur.
- Availability:
  - Beban SSE/WS dan orchestrator dengan Artillery/k6 (concurrency burst, steady load, retry/backoff behavior).
  - KPI: error rate ≤0.5%, latensi p95 ≤500ms; hasil ke `ci-artifacts/availability/*`.
- Hasil: skrip uji otomatis di `tests/contract/events/*.test.ts` dan `tests/load/agent/*.spec.js`, laporan ke `ci-artifacts/*`.

## Integrasi CI/CD
- Tambahkan skrip root:
  - `test:contract:events` (jalankan uji kontrak SSE/WS)
  - `test:load:agent` (beban SSE/WS & orchestrator)
  - `ci:collect` (perluas `tools/ci/collect-artifacts.js` untuk menautkan laporan CIA baru)
- Workflow CI: job lint (OpenAPI/Spectral), contract tests, load tests (ringkas), publikasi artefak ke `ci-artifacts/` dan indeks HTML.

## Deliverables & Lokasi
- Laporan review: `docs/development/agent-flows/REVIEW-20251208.md`
- Diagram BPMN/Draw.io: `workspace/04_Agent-Flows/bpmn/*`
- Dokumen kontrak event: `workspace/04_Agent-Flows/contracts/events.md`
- Skema event (siap implementasi): `packages/shared/src/schemas/agent-events.ts` dan `packages/shared/schemas/agent-events.schema.json`
- Skrip uji otomatis: `tests/contract/events/*`, `tests/load/agent/*`, hasil ke `ci-artifacts/*`

## Verifikasi & Pelaporan
- Jalankan uji visual diagram dan koreksi bila perlu.
- Eksekusi uji kontrak CIA; kumpulkan metrik latensi/error, signature checks, dan hasil scrubbing.
- Perbarui indeks artefak via collector agar laporan dapat ditinjau.

Setujui rencana ini. Setelah disetujui, saya akan membuat sumber BPMN/Draw.io, menyusun kontrak event & skema, menulis skrip uji CIA, serta mengintegrasikannya ke pipeline CI/CD sambil menghasilkan laporan dan artefak.