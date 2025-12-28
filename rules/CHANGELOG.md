# Changelog: SBA-Agentic Rules

Semua perubahan signifikan pada sistem aturan dan kebijakan agen akan dicatat di sini.

## [1.1.0] - 2025-12-28
### Added
- **Enhanced Reasoning Trace**: Added Analysis, Planning, Execution, and Reflection phases to agent reasoning logic.
- **Structured Audit Logging**: Implemented mandatory Reasoning Trace recording in audit logs for 100% observability.
- **Robust PII Masking**: Implemented recursive PII masking for all audit entries, covering emails, phones, and sensitive metadata keys.
- **SI Rate Limiting**: Implemented window-based rate limiting (BPA-SI-01) for external CRM integrations.
- **Observer Integration**: Aligned `ObserverService` with `FeedbackLoopService` for real-time drift detection.
- **Operational Readiness**: Added `ops:status` command for automated system health monitoring.
- **Business Domain Alignment**: Aligned all BPA, CX, and SI rules with the latest Business Domain Guidelines and Action Handlers Catalog.
- **Rule Refactoring**: Migrated generic omnichannel notifications to specific `send_email` and `send_push` handlers.
- **Enhanced Document Processing**: Updated BPA-DOC-01 to use the standardized `document.extract_data` and `db.upsert_record` pattern.
- **Web Search Integration & Information Literacy**: 
    - Implemented "6-Step Search Strategy" in `search-strategy.md` for standardized external information retrieval.
    - Integrated **Critical Thinking** and **Source Evaluation** (ROBOT method, Lateral Reading) into `agent-reasoning.md`.
    - Enhanced `feedback-loop.md` with systematic information extraction and dynamic prompting based on web insights.
- **Documentation Ecosystem & Self-Evolution**:
    - Synchronized root `README.md`, `docs/INDEX.md`, `docs/README.md`, and `docs/SBA-Agentic Operational Standard.md` with a unified hierarchy.
    - Enhanced `AGENTS.md` as the primary context hub for AI agents, linking core SOPs and rules.
    - Established clear cross-references between the Rules Center, Operational Standard, and Developer Handbook.
    - Implemented `documentation-lifecycle.md` to govern the agentic evolution of system documentation, including a Reflection Template for self-updates.
    - Added **Documentation Map** (Mermaid visual) to `docs/INDEX.md` for better structural understanding.
    - Created `docs/PROGRESS.md` for real-time tracking of documentation and agentic readiness.
    - Standardized terminology across all core documentation (Rube Engine, ReasoningStep).
    - **Full Ecosystem Integration**: Completed the end-to-end synchronization of the core documentation hub (Root, docs/, .trae/rules/).
- **Self-Learning & Knowledge Monitoring**: Implemented systematic information extraction (Starting -> Chaining -> Browsing -> Differentiating -> Monitoring -> Extracting) in `FeedbackLoopService`.
- **Knowledge Catalog**: Added `knowledge.search` and `knowledge.extract` capabilities to the Action Handlers Catalog.

## [1.0.0] - 2025-12-28
### Added
- Inisialisasi **Minimum Agentic Go-Live Set** (35 artefak lengkap).
- Struktur direktori aturan baru: `rule-templates/`, `schemas/`, `tests/`.
- Spesifikasi YAML untuk rule (BPA, CX, DA, SI).
- Kebijakan penalaran agen (Reasoning Policy) & Taksonomi Agen.
- Protokol keamanan, isolasi multi-tenant, dan kontrak konteks tenant.
- Standar observabilitas (Logging, Metrics, Tracing).
- CI/CD quality gates, release checklist, dan kebijakan rollback.
- Architecture Decision Records (ADR) awal.

---
*Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).*
