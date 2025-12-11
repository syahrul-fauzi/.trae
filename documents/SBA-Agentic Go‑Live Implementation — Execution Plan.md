## Objectives
- Consolidate Supabase clients/types and enforce tenant context on every multi-tenant operation.
- Centralize Prisma access behind `@sba/db` repositories with a strict tenant guard.
- Harden and scale WebSocket: JWT signature verification and Redis adapter; add HTTP/WS rate limiting.
- Unify lint/test configs; enforce CI guards against insecure imports and client bundle leaks.

## Key Findings (Current State)
- `packages/supabase` exists but lacks `setTenantContext` and `node-admin` client.
- Many direct `@supabase/supabase-js` imports across apps/api and edge functions; partial centralization via `apps/api/src/infrastructure/repositories/SupabaseClient.ts`.
- Prisma schema is in `apps/api/prisma/schema.prisma`; no centralized `packages/db` for Prisma repositories.
- Socket.IO gateway present but without JWT verification or Redis adapter; rate limiting is available in `packages/kv` but not consistently enforced.
- Multiple ESLint configs across apps; root coverage thresholds exist but per-app configs may bypass them.
- Potential RPC mismatch: `set_tenant_context` vs `set_tenant` function name.

## Implementation Steps
1) Supabase Package Consolidation
- Add `packages/supabase/src/clients/node-admin.ts` with `createAdminClient(url, serviceKey)` using `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (no `NEXT_PUBLIC_*`).
- Implement `packages/supabase/src/helpers/tenant.ts` with `setTenantContext(client, tenantId)` calling the correct RPC (align name to DB: `set_tenant` if that’s the canonical function).
- Ensure single `Database` type in `packages/supabase/src/types/index.ts`; re-export via `src/index.ts`.
- Add runtime env validation for server and client contexts; fail-fast if missing.

2) API Migration to `@sba/supabase`
- Replace all direct `@supabase/supabase-js` imports in `apps/api/**` with `@sba/supabase/clients/node-admin`.
- Use `setTenantContext` at request boundaries (e.g., global middleware or per-controller before multi-tenant operations).
- Remove duplicate local client factories and unify headers/context handling.
- Verify server never reads `NEXT_PUBLIC_*` vars.

3) Centralize Prisma in `packages/db`
- Create `packages/db/prisma/schema.prisma` (or move from `apps/api/prisma`) with internal service models.
- Implement `packages/db/src/client.ts` (singleton `PrismaClient` with basic retry and logging).
- Implement `packages/db/src/tenant.ts` with `setTenant(prisma, tenantId)` executing `SET app.tenant_id = $1` and repository decorators enforcing explicit `tenantId` filters.
- Add `packages/db/src/repositories/*` for runs/steps/calls/audit/metrics/health with minimal, well-typed methods.
- Migrate API codepaths to import repositories from `@sba/db` and forbid direct Prisma usage in controllers/services.

4) WebSocket Security & Scaling
- Implement JWT signature verification for Socket.IO handshake (use server secret/JWKs); reject invalid or cross-tenant tokens.
- Wire Redis adapter (`@socket.io/redis-adapter`) with Redis clients and health checks; enable multi-node broadcasting.
- Add per-user/tenant event rate limiting using `@sba/kv` utilities; return 429 or drop events on abuse.

5) HTTP Rate Limiting & Cache
- Enforce Redis-backed rate limits per IP/tenant/method across API routes using `@sba/kv`.
- Add Redis/kv cache with namespaced keys and adaptive TTL for knowledge queries; include invalidation/versioning strategies.

6) Env Validation & CORS
- Add strict runtime env validation for server/client; prohibit service keys from being accessible in client bundles.
- Tighten CORS for API and WS.

7) ESLint & Vitest Consolidation
- Adopt a single root ESLint v9 flat config; remove app-level `.eslintrc*` files.
- Ensure all projects use the root Vitest config with global coverage thresholds; unify reporters.

8) CI Guards
- Add CI rule blocking direct `@supabase/supabase-js` imports outside `packages/supabase`.
- Add CI bundle analyzer check to ensure no `SUPABASE_SERVICE_*` are present in client bundles.

9) Tests
- Unit tests for Supabase clients and `setTenantContext` helper.
- Integration tests for WS handshake (valid/invalid JWT), Redis adapter broadcasting, and rate limiting behavior.
- Repository tests validating tenant guard (`SET` + explicit filters) and idempotent operations.
- Maintain ≥80% coverage for critical modules.

10) Verification & Rollout
- Run full test suite and fix regressions.
- Canary WS adapter and edge functions; monitor p95 latency and error rates with tracing.
- Document migration steps for apps/web/docs and API; remove deprecated local clients.

## Risks & Mitigation
- Tenant leakage: enforce `setTenantContext`/`setTenant` at all data boundaries; defense-in-depth via repository filters.
- WS bottlenecks: Redis adapter, event limiter, backpressure.
- Env inconsistency: runtime validation; CI checks; build-time analyzers.

## Deliverables
- `packages/supabase`: unified clients, types, `setTenantContext`, env validation.
- `packages/db`: Prisma client, tenant guard, repositories.
- API updated to use centralized packages, WS JWT verification, Redis adapter, rate limits.
- Single ESLint configuration and unified Vitest coverage; CI guards enforced.