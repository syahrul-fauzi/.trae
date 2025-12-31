# Architecture Decision Records (ADR)

Catatan keputusan arsitektur penting yang diambil dalam pengembangan SBA-Agentic.

## ADR-001: Event-Driven Architecture over REST
- **Status**: Accepted
- **Context**: Sistem memerlukan responsivitas tinggi dan skalabilitas asinkron.
- **Decision**: Gunakan Redis/BullMQ untuk alur kerja antar layanan.
- **Consequences**: Memerlukan pemantauan antrean yang ketat (DLQ).

## ADR-002: YAML for Rule Specification
- **Status**: Accepted
- **Context**: Rule harus mudah dibaca oleh manusia dan mesin (LLM).
- **Decision**: Gunakan format YAML dengan skema Zod/JSON.
- **Consequences**: Memerlukan pipeline validasi skema di CI.

## ADR-003: Multi-tenant Data Isolation via RLS
- **Status**: Accepted
- **Context**: Keamanan data antar pelanggan adalah kritikal.
- **Decision**: Implementasikan Row Level Security di Supabase.
- **Consequences**: Setiap kueri wajib menyertakan konteks user/tenant yang valid.

## ADR-004: Integrated Zero-Trust Agent Enforcement (Rube + Orchestrator)
- **Status**: Accepted
- **Context**: Agen AI memiliki akses ke alat (tools) sensitif yang dapat memanipulasi data lintas tenant.
- **Decision**: Integrasikan `Orchestrator` dengan `RubeService` untuk penegakan kebijakan Zero Trust pada setiap eksekusi tool.
- **Consequences**:
    - `EnhancedToolRegistry` wajib memanggil `rubeService.enforce()` sebelum eksekusi tool.
    - `RubeGuardContext` harus menyertakan `tenantId`, `userId`, dan parameter tool secara lengkap.
    - Setiap tool baru harus didaftarkan sebagai `capability` di Rube Registry.

---
*Update dokumen ini setiap ada keputusan arsitektur baru.*
