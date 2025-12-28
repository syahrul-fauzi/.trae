# Rule: Global Standards & Operational Foundation
version: 1.0.0
last_updated: 2025-12-28

## 1. Standar Pengembangan (AgentOps)
*   **Coding Standards**: Wajib menggunakan [biome.json](file:///home/inbox/smart-ai/sba-agentic/biome.json). TypeScript *Strict Mode* aktif.
*   **Reasoning Patterns**: Setiap agen wajib mengikuti pola `ReasoningStep` (Analysis -> Planning -> Execution -> Reflection).
*   **Confidence Scoring**: Keputusan agen dengan skor < 0.7 wajib memicu intervensi manusia.
*   **Tool Contracts**: Akses API/DB hanya melalui *Tool Registry* yang tervalidasi.

## 2. Keamanan & Kepatuhan
*   **Auth**: Supabase Auth + JWT Validation ([jwt.ts](file:///home/inbox/smart-ai/sba-agentic/packages/security/src/jwt.ts)).
*   **Data Protection (PII Masking)**: 
    - Wajib melakukan masking pada log agen untuk data sensitif (Email, Phone, Address).
    - Gunakan `@sba/security` utilitas untuk enkripsi data di database.
*   **Audit Logging**: 
    - Setiap keputusan agen (Reasoning Trace) wajib dicatat di [audit.ts](file:///home/inbox/smart-ai/sba-agentic/packages/security/src/audit.ts).
    - Log harus mencakup `tenant_id`, `user_id`, `capability`, dan `success_status`.

## 3. Prinsip Inti Sistem
*   **Agentic > Rule-based**: Utamakan keputusan adaptif.
*   **Event > Request**: Arsitektur berbasis event (Pub/Sub).
*   **Observability by default**: Semua aksi harus ter-trace.
*   **Multi-tenant first**: Isolasi data antar tenant wajib.
