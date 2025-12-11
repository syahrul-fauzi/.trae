## Scope
- Complete unresolved diagnostics in `apps/api` after type-check fixes
- Stabilize unit/integration tests (Vitest + Supertest) for controllers
- Verify Playwright web changes didn’t regress API
- Document changes and add minimal CI hooks for type-check/lint safety

## Verification Targets
- Type-check `apps/api` succeeds (noEmit)
- Lint passes for `apps/api` and changed files
- Vitest passes for:
  - `src/__tests__/sessions.supertest.spec.ts`
  - `src/__tests__/rbac.supertest.spec.ts`
  - Health/Metrics controller tests if present
- Playwright web: chromium run on `e2e/ai-copilot-a11y.spec.ts` remains green

## Implementation Steps
1. Read current test files and configs
   - Inspect `apps/api/src/__tests__/sessions.supertest.spec.ts`
   - Inspect `apps/api/vitest.config.ts` for aliases, test environment, setup files
   - Confirm Nest testing module setup and HTTP server bootstrap/stubs
2. Stabilize Supabase admin client in tests
   - Ensure tests do not import external `packages/supabase` types directly
   - If needed, add test-only stub via vitest `alias` in `vitest.config.ts` to point `@sba/supabase/clients/node-admin` to a local stub (runtime no change)
3. Controller tests
   - Validate endpoints: Sessions create/get/list
   - Ensure required headers are set (`X-Tenant-ID`) and guards mocked (JwtAuthGuard, RolesGuard, TenantGuard)
   - Replace real Redis with in-memory stub for deterministic results
4. Linting & formatting
   - Run eslint on `apps/api/src` and fix autofixable issues
   - Run prettier on changed files
5. Re-run type-check & tests
   - Type-check `apps/api` (noEmit)
   - Run targeted Vitest (non-watch) for supertest specs
6. Web e2e quick smoke
   - Run chromium-only for `e2e/ai-copilot-a11y.spec.ts` to confirm no regressions
7. Documentation updates
   - Create a short changelog entry summarizing fixes (decorator signature, storage repo calls, exactOptionalPropertyTypes payload handling, supabase import stabilization)
   - Add a developer note in `apps/api/README.md` under Testing: how to run tests with stubs
8. CI hooks (non-commit)
   - Propose adding steps:
     - `pnpm -w exec tsc -p apps/api/tsconfig.json --noEmit`
     - `pnpm -C apps/api lint`
     - `pnpm --filter @sba/web run type-check:e2e:web` prior to e2e

## Acceptance Criteria
- No diagnostics remaining for API files previously reported
- All targeted tests pass locally
- Lint/format clean for modified files
- Web e2e AI Copilot test still passes

## Risks & Mitigations
- Test stubs may hide integration issues: keep scope to unit/integration only and document
- CI differences: provide commands but avoid commits until approved

## Rollback Plan
- All changes are confined to `apps/api` and test configs; can revert specific files if needed

## Next Actions (after approval)
- Implement alias stub in `vitest.config.ts` if required
- Apply lint autofixes and run tests
- Write documentation and optional CI snippet