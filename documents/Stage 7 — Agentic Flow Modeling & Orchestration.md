## Cakupan Fitur & Artefak
- Fitur prioritas: `agent_interrupt_resume`, `multimodal_messages`, `analytics_heatmap`, `knowledge_operations` (search/upsert/verify), `rbac_access_control`, `ensure_tenant_header`.
- Untuk setiap fitur, buat dokumen di `workspace/04_Agent-Flows/<nama_fitur>-flow.md` (format `YYYYMMDD-<DESCRIPTOR>.md`).
- Tambahkan referensi silang ke `workspace/_xref.md` setelah dokumen selesai.

## Struktur Dokumen (Template Seragam)
- Frontmatter YAML: `id`, `title`, `status`, `owner/reviewer/approver`, `tags`, `related` (PRD, arsitektur, API), `version`.
- Ringkasan fitur dan tujuan agent (tujuan jelas, batasan, KPI keberhasilan).
- Diagram:
  - State Machine: `mermaid stateDiagram-v2` mencakup semua state & transisi.
  - Node Graph/Decision Tree: `mermaid flowchart` dengan cabang kondisi & guard.
  - Pipeline Trigger → Reason → Act: `mermaid sequenceDiagram` (trigger, perceive/parse, reason, decide, act, validate, log).
- Siklus kerja agent (6 bagian wajib):
  1) Input Processing: kanal (UI, API, webhook), validasi awal (schema/Zod, RBAC, tenant header).
  2) Parsing & Perception: normalisasi payload, ekstraksi entitas, persepsi konteks (run/thread, session, rate-limit state).
  3) Reasoning: strategi keputusan (rule-based + LLM), batasan (guard rails, policies), evaluasi opsi.
  4) Execution: pemanggilan tools/API, manajemen sumber daya (quota, timeout, concurrency), retry/backoff.
  5) Output Validation: verifikasi hasil (schema, idempotensi, bisnis rules), error handling (kategori & remedi).
  6) Logging: skema log terstandar (request-id, tenant-id, runId/threadId/agentId, toolCallId, event, state, ts, durationMs, outcome, errorCode).
- Quality: Lifecycle Testing, Event Logging, Integrasi Orchestrator (kompatibel engine & event bus).
- Test Cases & Skenario: tabel skenario per transisi state, kondisi guard, dan hasil diharapkan.
- Panduan Integrasi: hook ke orchestrator, SSE/WS events, metrik (`withMetrics`) dan label `x-tenant-id`.

## Prinsip Desain (Agentik)
- Tujuan dan parameter operasi ditulis eksplisit; keputusan otonom dengan pengawasan minimal.
- Akses data real-time, integrasi melalui API, dan batasan yang jelas untuk menjaga keselamatan & etika.
- Pendekatan bottom-up: perilaku agent (atribut, tujuan, interaksi) menghasilkan dinamika sistem (emergent) yang dilacak via event.

## Detil Per-Fitur (Rencana Isi)
- Agent Interrupt & Resume:
  - State: `Idle → Running → InterruptRequested → WaitingApproval → Resuming → Completed | Failed`.
  - Events: `RUN_STARTED`, `INTERRUPT_EMITTED`, `RUN_PAUSED`, `RUN_RESUMED`, `RUN_FINISHED`.
  - Pipeline: trigger dari proposal tool (needs-approval) → reason risk/policy → act: pause + emit interrupt → validate resume payload.
- Multimodal Messages:
  - State: `AwaitInput → ParsingModalities → Reasoning → ActTools → Validating → Completed | Failed`.
  - Decision Tree: percabangan tipe (text/image/audio/file), fallback & degradation.
  - Resource mgmt: batas ukuran/tipe file, OCR/ASR pipeline.
- Analytics Heatmap:
  - State: `Collecting → Buffering → Posting → Validating → Completed | Failed`.
  - Guard: rate-limit, privacy (anonymize), tenant labeling.
- Knowledge Operations:
  - State: `ReceiveRequest → ValidateSchema → Route(search|upsert|verify) → Execute → Validate → Completed | Failed`.
  - Decision node: pilih operasi + kebijakan RBAC/tenant.
- RBAC Access Control:
  - State: `ResolveSession → CheckRole → GateAllowed → Execute | GateDenied`.
  - Log: alasan denied & korelasi.
- Ensure Tenant Header:
  - State: `InspectHeaders → InjectDefault | Reject → Continue`.
  - Metrics: pastikan label tersedia untuk observability.

## Skema Logging & Event
- Nama event konsisten lintas fitur: `RUN_STARTED`, `STEP_DECISION`, `TOOL_CALL_REQUESTED`, `TOOL_CALL_RESULT`, `RUN_INTERRUPTED`, `RUN_RESUMED`, `RUN_FINISHED`.
- Struktur log JSON: field wajib di bagian Logging.
- Korelasi: `request-id`, `x-tenant-id` wajib; spanId/traceId opsional.

## Lifecycle Testing & Verifikasi
- Uji transisi state: happy-path, error-path, dan interrupt/resume.
- Kontrak event: assert urutan & muatan event (SSE/WS) sesuai spesifikasi.
- Validasi integrasi orchestrator: engine menerima/emit event; rate-limit & RBAC guard berfungsi.

## Integrasi Orchestrator
- Mapping state/aksi ke engine & event bus (apps/orchestrator); kompatibilitas dengan `withMetrics`, RBAC, ensure tenant header di App Router.
- Tool-calls: standar request/response, idempotensi, retry policy.

## Deliverables
- Dokumen lengkap per fitur di `workspace/04_Agent-Flows/` dengan diagram (state, decision, pipeline) dan semua bagian siklus hidup.
- Dokumen pendukung: spesifikasi teknis, panduan integrasi, daftar test case & skenario.
- Update `workspace/_xref.md` agar PRD ↔ Arsitektur ↔ Agent-Flows ↔ API tertaut.

## Langkah Implementasi
1) Kumpulkan PRD/arsitektur/UI referensi tiap fitur dari `workspace/01_PRD`, `workspace/02_Architecture`, dan komponen UI terkait.
2) Tulis dokumen flow menggunakan template seragam dan mermaid untuk diagram.
3) Definisikan event & skema log; pastikan label observability & RBAC/tenant masuk di guard.
4) Rancang test cases lifecycle & kontrak event; siapkan mapping integrasi ke orchestrator.
5) Tambahkan entri ke `workspace/_xref.md` untuk menjaga traceability.

Konfirmasi rencana ini. Setelah disetujui, saya akan mulai membuat dokumen per fitur di lokasi yang ditentukan dan menyelaraskan integrasi dengan orchestrator.