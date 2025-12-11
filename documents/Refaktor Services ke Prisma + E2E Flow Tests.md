## Scope
- Refactor internal write paths (agent_runs, tool_calls, audit_logs) from direct Supabase queries to Prisma repositories.
- Preserve Supabase for RLS entities (knowledge, tasks, control_state, render_jobs, logs) unless mapped in internal schema.
- Add end-to-end transaction tests for run→steps→toolcalls with proper isolation and rollback.

## Targets (Files to Change)
- Replace direct writes:
  - agent_runs upsert: `apps/api/src/infrastructure/repositories/AgentRunsRepository.ts:7-9` → use `AgentRunsPrismaRepository`.
  - tool_calls insert: `apps/api/src/infrastructure/queue/processors/ToolExecutionProcessor.ts:55` → use `ToolCallsPrismaRepository`.
  - audit_logs insert: `apps/api/src/infrastructure/queue/processors/AuditLogProcessor.ts:47` and `apps/api/src/infrastructure/repositories/SupabaseAuditRepository.ts:11` → use `AuditLogPrismaRepository`.
- Keep Supabase for:
  - knowledge (`apps/api/src/tools/KnowledgeToolSupabase.ts:80`)
  - tasks (`apps/api/src/tools/TaskToolSupabase.ts:14`)
  - control_state (`apps/api/src/infrastructure/repositories/SupabaseControlStateRepository.ts:11,26`)
  - worker heartbeats (`apps/api/src/workers/agent-events-consumer.ts:39`)
  - render_jobs/logs unless added to Prisma schema later.

## Refactor Plan
1. Introduce service-layer adapters where needed to inject Prisma repositories.
2. Update implementations:
   - Agent run metadata upsert → `AgentRunsPrismaRepository.upsertMetadata`
   - Tool call recording → `ToolCallsPrismaRepository.recordCall`
   - Audit log write → `AuditLogPrismaRepository.write`
3. Error handling:
   - Wrap repository calls; map Prisma errors to domain errors; ensure logging.
4. Transactions:
   - For orchestrated flows, use `prisma.$transaction` where run/steps/toolcalls are written atomically.

## E2E Transaction Tests
- New test suite: `apps/api/e2e/prisma-flow.test.ts`
- Flow:
  1. Begin transaction.
  2. Create agent run (Prisma), append steps, record tool calls.
  3. Verify retrieval (listByTenant, listSteps, getByRun).
  4. Rollback and confirm no persistent state.
- Use test database via `DATABASE_URL` pointing to ephemeral schema; reset between tests.

## Quality Requirements
- Compatibility: feature behavior unchanged; only persistence path altered.
- Consistency: follow existing repository pattern and domain contracts.
- No regressions: run unit/integration/e2e; maintain coverage thresholds.
- Documentation: add PR description summarizing changes and references to `docs/development/prisma-migration-guide.md` and `docs/development/rate-limit-policy.md`.

## Deliverables
- Updated files: AgentRunsRepository, ToolExecutionProcessor, AuditLogProcessor, SupabaseAuditRepository (replaced or bridged).
- New tests: `apps/api/e2e/prisma-flow.test.ts` using transactions.
- Logging and error mapping in updated services.

## Rollout
- Dev → Staging with database snapshot and canary; monitor error rates.
- Rollback plan: switch back to Supabase adapters if needed via feature flag.
