## Tujuan
- Menyempurnakan Agent-Flows melalui review internal, penambahan sumber BPMN/Draw.io, sinkronisasi kontrak event SSE/WS, serta uji kontrak otomatis berstandar CIA (Confidentiality, Integrity, Availability).

## Cakupan Artefak
- Flows ditinjau: interrupt/resume, multimodal messages, analytics heatmap, knowledge operations, RBAC, ensure tenant header.
- Repositori terkait: `workspace/04_Agent-Flows/*`, orchestrator (`apps/orchestrator/*`), AG-UI events (`packages/ui/src/ag-ui/*`).

## Langkah 1 — Review Internal & Visualisasi
- Buka dan analisis seluruh dokumen flow di `workspace/04_Agent-Flows/`.
- Render diagram mermaid (state/decision/pipeline) untuk verifikasi visual.
- Checklist verifikasi:
  - Konsistensi notasi/simbol; tidak ada state/transisi yatim.
  - Kelengkapan alur proses; semua guard dan error path terwakili.
  - Kesesuaian dengan kebutuhan bisnis/PRD.
- Deliverable: `docs/development/agent-flows/REVIEW-20251208.md` berisi temuan, rekomendasi, dan daftar perubahan.

## Langkah 2 — Tambah Sumber BPMN/Draw.io (Flow Rinci)
- Prioritas sumber proses rinci: `agent_interrupt_resume`, `multimodal_messages`, `knowledge_operations`.
- Lokasi file: `workspace/04_Agent-Flows/bpmn/`
  - `agent_interrupt_resume.bpmn` + `agent_interrupt_resume.drawio`
  - `multimodal_messages.bpmn` + `multimodal_messages.drawio`
  - `knowledge_operations.bpmn` + `knowledge_operations.drawio`
- Pedoman modeling:
  - Swimlanes: UI / API / Orchestrator / Agent.
  - Gateways: approval decision, rate-limit, RBAC.
  - Events: INTERRUPT/RESUME, TOOL_CALL_REQUESTED/RESULT.
  - Boundary events: timeout, error handling, retry/backoff.
- Referensi silang dari markdown flow ke berkas BPMN/Draw.io.

## Langkah 3 — Sinkronisasi Kontrak Event (SSE/WS)
- Dokumentasikan tipe event + payload schema:
  - Nama event: RUN_STARTED, STEP_DECISION, TOOL_CALL_REQUESTED, TOOL_CALL_RESULT, RUN_INTERRUPTED, RUN_RESUMED, RUN_FINISHED.
  - Korelasi wajib: `requestId`, `x-tenant-id`, `runId`, `threadId`, `agentId`, `toolCallId/interruptId`, `ts`, `state`, `outcome`.
- Lokasi kontrak: `workspace/04_Agent-Flows/contracts/events.md`.
- Skema formal (JSON Schema + Zod, siap diimplementasi):
  - `packages/shared/src/schemas/agent-events.ts`
  - `packages/shared/schemas/agent-events.schema.json`
- Verifikasi kompatibilitas orchestrator: `apps/orchestrator/src/engine.ts`, `apps/orchestrator/src/domain.ts`, dan AG-UI events (`packages/ui/src/ag-ui/hooks/useAGEvents.ts`).

## Langkah 4 — Uji Kontrak CIA
- Confidentiality:
  - Uji redaksi/enkripsi konten reasoning (sesuai README ReasoningMessageStartEvent).
  - Guard scrubbing: tidak ada secrets di log/event.
- Integrity:
  - Rencana HMAC signature/ checksum pada event stream; uji validasi tanda tangan dan deteksi manipulasi.
  - Pemeriksaan konsistensi `requestId` sepanjang lifecycle.
- Availability:
  - Beban SSE/WS & orchestrator (Artillery/k6): burst/concurrency, steady-state, retry/backoff.
  - KPI: latensi p95 ≤500ms, error rate ≤0.5%.
- Lokasi skrip & hasil:
  - `tests/contract/events/*.test.ts` (kontrak SSE/WS)
  - `tests/security/confidentiality/*.test.ts` (scrubbing/enkripsi)
  - `tests/security/integrity/*.test.ts` (signature)
  - `tests/load/agent/*.spec.js` (beban)
  - Hasil ke `ci-artifacts/contract/*`, `ci-artifacts/security/*`, `ci-artifacts/availability/*`.

## Langkah 5 — Integrasi CI/CD
- Tambah skrip root:
  - `test:contract:events` — jalankan uji kontrak SSE/WS
  - `test:security:confidentiality` — validasi redaksi/enkripsi
  - `test:security:integrity` — verifikasi signature/checksum
  - `test:load:agent` — beban SSE/WS & orchestrator
  - `ci:collect` — perluas collector untuk menautkan artefak CIA baru
- Perluasan collector (`tools/ci/collect-artifacts.js`): tautkan laporan `ci-artifacts/security/*`, `ci-artifacts/availability/*`, dan ringkasan uji kontrak.
- Pipeline: job lint (OpenAPI/Spectral), contract tests, security tests, load tests (subset), publish artefak ke index.

## Deliverables
- Laporan review: `docs/development/agent-flows/REVIEW-20251208.md`.
- Diagram proses BPMN/Draw.io: `workspace/04_Agent-Flows/bpmn/*`.
- Dokumen kontrak event: `workspace/04_Agent-Flows/contracts/events.md`.
- Skema event (JSON Schema & Zod) siap implementasi: `packages/shared/src/schemas/agent-events.ts`, `packages/shared/schemas/agent-events.schema.json`.
- Skrip uji otomatis & artefak: `tests/*` + `ci-artifacts/*`.

## Verifikasi
- Review visual semua diagram; perbaiki bila ada ketidaksesuaian notasi/alur.
- Jalankan uji kontrak CIA; kumpulkan metrik dan bukti keberhasilan.
- Perbarui indeks artefak agar laporan mudah ditinjau.

Jika disetujui, saya akan mulai membuat sumber BPMN/Draw.io, menyusun kontrak event & skema formal, menulis skrip uji CIA, dan mengintegrasikannya ke CI/CD sambil menghasilkan laporan dan artefak.