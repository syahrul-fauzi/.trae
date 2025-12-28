# Dependency Map

Peta ketergantungan sistem SBA-Agentic untuk memahami dampak perubahan dan alur data.

## 1. Core Service Dependencies
- **Rube Engine** -> Depends on: `@sba/observability`, `@sba/queue`, `Supabase`.
- **Worker Service** -> Depends on: `BullMQ`, `Redis (Upstash)`, `PostgreSQL`.
- **API Gateway** -> Depends on: `Supabase Auth`, `AgentStreamGateway`.

## 2. Data Flow Dependencies
1. **Trigger Event** -> Emitted by Business Modules.
2. **Rule Evaluation** -> Fetches rules from `packages/rube/src/rules/`.
3. **Action Execution** -> Calls external APIs or internal Tools.
4. **Audit Trail** -> Writes to `audit_logs` table via `@sba/security`.

## 3. External Integration
- **LLM Provider**: OpenAI / Anthropic.
- **Notification**: Resend (Email), Twilio (SMS).
- **Storage**: Supabase Storage / AWS S3.

---
*Gunakan peta ini untuk melakukan Impact Analysis sebelum memodifikasi rule atau kapabilitas inti.*
