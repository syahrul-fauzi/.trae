# Changelog: SBA-Agentic Rules

Semua perubahan signifikan pada sistem aturan dan kebijakan agen akan dicatat di sini.

## [1.2.6] - 2026-01-03
### Added
- **Phase 2 Initiative: Advanced Rules Engine**:
  - Upgraded `RuleExecutor` to support new Rule Specification with metadata, structured triggers, and enhanced observability.
  - Implemented backward compatibility layer for legacy rule configurations.
  - Updated Rube YAML schema validation in Internal Console and core packages.
  - Migrated core and application agent rules (`search-agent`, `orchestrator-agent`, `greeter-agent`, `bpa-app-*`, `cx-notif-01`, `da-met-01`, etc.) to the new specification.
  - Enabled ADR-015 Autonomous Self-Correction across all critical rule sets via `meta.enable_reflection`.
  - Added comprehensive unit tests for `RuleExecutor` validating priority execution, error handling, and tenant isolation.
  - Verified Phase 2 Live Telemetry pipeline and Tauri Desktop Hardening integration.

## [1.2.5] - 2025-12-31
### Added
- **Phase 2 Initiative: Workflow & Policy Management**: 
  - Implemented Monaco-based YAML editor with Rube schema validation.
  - Added React Flow visualization for multi-step agentic workflows.
  - Implemented drag-and-drop action catalog for policy authoring.
  - Added unit tests with Vitest for editor and visualizer components.
- **Phase 2 Initiative: Desktop Hardening (Tauri)**: 
  - Migrated Internal Console to Tauri framework for secure desktop execution.
  - Implemented real-time system resource monitoring (CPU, Memory, Uptime) via Rust `sysinfo` crate.
  - Added system integrity checks and security scan capabilities to the Hardening Dashboard.
- **Phase 2 Initiative: Live Telemetry**: 
  - Integrated WebSocket (Socket.io) for real-time telemetry streaming.
  - Implemented gRPC-web infrastructure with async iterator support for agent status monitoring.
  - Enhanced Telemetry Dashboard with live charts and connection protocol switching.
- **Technical Documentation**: Created `docs/PHASE_2_TECHNICAL_SPEC.md` covering all Phase 2 implementations.

### Fixed
- **Testing Stability**: Resolved ReactFlow and Monaco Editor environment issues in Vitest.
- **Tauri Integration**: Fixed command invocation and state management in the Rust backend.

## [1.2.4] - 2025-12-31
### Added
- **Internal Console Core UC Implementation**: Completed UC-01 (User Management), UC-02 (Monitoring), UC-03 (Configuration), and UC-04 (Audit Logging & Reporting).
- **Governance Framework**: Established `docs/GOVERNANCE` with Cross-Team Sync Schedule and Risk Log.
- **Web Research Benchmarks**: Integrated orchestrated search latency and accuracy benchmarks into architecture and readiness docs.
- **Standardized Navigation**: Aligned sidebar navigation across all internal administrative interfaces.

### Fixed
- **Apps Dashboard Stability**: Resolved TypeScript errors in `AnalyticsDashboard.tsx`, `AgentDetailsClient.tsx`, and `DashboardClient.tsx`.
- **AFD Frontend Integration**: Completed AI Command Bar integration in `EnhancedAGUIDashboard.tsx` with resilient `useAFD` hook support.
- **Workflow Visualization**: Enhanced `WorkflowVisualizer.tsx` with type-safe node/edge definitions and improved layout.
- **NestJS API Stability**: Resolved Swagger metadata generation errors and circular dependencies in `AuthResponseDto`.
- **Tool Registration**: Fixed `ToolsService` initialization by migrating tool registration to `OnModuleInit` lifecycle hook.
- **Security Package Integrity**: Resolved missing dependencies (`zod`, `jsonwebtoken`) in `@sba/security` and refactored JWT implementation for production robustness.
- **Internal Console Stability**: Resolved JSDOM `getComputedStyle` issues in a11y tests and verified 100% test pass rate.
- **Monorepo Consistency**: Aligned security and tool package exports and dependencies.

## [1.2.3] - 2025-12-31
### Added
- **AFD Resilience Implementation**: Integrated Circuit Breaker (5 failures/60s) and Caching (1h TTL) into `AfdService`.
- **AFD Performance Benchmarking**: Validated high-latency handling with `afd.benchmark.spec.ts` (Avg 101ms sequential, 103ms concurrent).
- **AFD Integration Finalization**: Completed end-to-end integration between Marketing App and AFD Backend.
- **Type Safety**: Resolved all TypeScript errors in AFD service, controller, and DTOs.
- **Technical Specification**: Created `AFD_INTEGRATION_SPEC.md` documenting the full API contract and architecture.
- **Operational Readiness**: Enhanced `AFD_ROLLOUT_PLAN.md` with support runbooks and final regression test cycles.
- **Load Test Stability**: Optimized `afd.load.spec.ts` for stable execution in CI/CD environments.
- **KV Package Fix**: Resolved `tenantKey` export issue in `@sba/kv` to unblock staging tests.

## [1.2.2] - 2025-12-31
### Added
- **AFD Performance Validation**: Validated 50 concurrent requests with <5ms average latency.
- **Rollout Documentation**: Added `AFD_ROLLOUT_PLAN.md` and `AFD_INTEGRATION_BENCHMARK.md`.
- **Package Fixes**: Resolved module resolution issues in `@sba/integrations` and `@sba/observability`.
- **API Contract Verification**: Confirmed alignment between Marketing App and AFD Backend.

## [1.2.1] - 2025-12-31
### Added
- **AFD Backend Implementation**: Completed the Agentic Front Door (AFD) backend module in `apps/api`.
  - Implemented `AfdController` with multimodal intent capture endpoints.
  - Implemented `AfdService` with intent processing and task decomposition via `OrchestratorService`.
  - Added comprehensive integration tests (`afd.workflow.spec.ts`) for intent-to-action mapping.
  - Integrated `AfdModule` into the main `AppModule`.
- **Enhanced Test Reliability**: Added `reflect-metadata` and explicit `@Inject` decorators to AFD components to ensure stable dependency injection in Vitest environments.

## [1.2.0] - 2025-12-31
### Added
- **Enhanced Documentation Hierarchy**: Updated root `README.md` and `docs/README.md` to reflect full monorepo structure (30+ packages and 7+ apps).
- **Core Package Indexing**: Linked core packages from `docs/README.md` for faster navigation.
- **Enterprise-Grade Operational Standards**: Enhanced `OPERATIONAL_STANDARD.md` with Circuit Breakers, mTLS, RTO/RPO targets, and Disaster Recovery protocols.
- **Go-Live Simulation Framework**: 
  - Implemented `simulate-go-live-setup.ts` for automated tenant provisioning and feature flagging.
  - Implemented `simulate-go-live-traffic.ts` for end-to-end E2E traffic simulation (TC-01 to TC-04).
  - Added `SIMULATION_SCENARIOS.md` documenting the full validation suite.
- **Progress Tracking**: Updated `docs/PROGRESS.md` with the latest documentation and package readiness status.

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
