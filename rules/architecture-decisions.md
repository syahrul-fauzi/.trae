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

---
*Update dokumen ini setiap ada keputusan arsitektur baru.*
