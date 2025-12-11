## Scope & Goals
- Stabilize failing unit/integration tests across monitoring, agents routes (JSON/SSE), tenants API RBAC, and UI landmarks/a11y.
- Standardize mocking order and module resolution to eliminate timing/alias issues.
- Ensure consistent behavior under both ESM and test-local mocks, with clear test guidelines.

## Monitoring Tests Fixes
- Refactor `src/__tests__/lib/monitoring.test.ts` to hoist `vi.mock('@sentry/nextjs', ...)` before any import of `@/shared/lib/monitoring`.
- Add wrapper functions in `@/shared/lib/monitoring` that resolve Sentry dynamically on each call (e.g., `const getSentry = () => require('@sentry/nextjs')`).
- Minimal verification case:
  - Arrange: mock Sentry, clear performance monitor; Act: `ErrorTracker.captureException(new Error('x'), {...})`; Assert: `Sentry.captureException` called with expected payload.
- Ensure `beforeEach` calls `vi.clearAllMocks()` and `performanceMonitor.clear()`; add `afterEach` to restore spies where needed.

## Agents Route Behavior
- Confirm the route handler `@/app/api/agent/route` supports both modes:
  - JSON: when `Accept: application/json`, return `{ events: [...] }` with headers `X-Run-Id`, `X-Run-Started-At`.
  - SSE: when `Accept: text/event-stream`, initialize a proper `ReadableStream` and emit lifecycle events (e.g., `agent.started`, `message.delta`, `agent.completed`).
- Update tests:
  - `src/__tests__/agents-run-route.spec.ts`: validate JSON schema and headers; assert `events[*].type` includes lifecycle types.
  - `src/__tests__/agents-run-route-sse.spec.ts`: assert headers, stream starts, chunks decode to expected event names; include error-path test.

## Tenants API Auth Mocking
- Keep global default unauthenticated state.
- Per-suite local `vi.mock('@/shared/lib/auth', ...)` to simulate:
  - Unauthenticated → expect 401/403.
  - Authenticated with `tenant:read` → `GET` returns 200.
  - Missing permission → `GET`/`POST` returns 403.
  - Authenticated with `tenant:create` → `POST` returns 201.
- Update `src/__tests__/tenants-api.spec.ts` to include explicit local mocks per test and assert proper headers/body where relevant.

## UI Landmarks & A11y
- Align assertions in `src/__tests__/ui-landmarks-and-header.spec.tsx` to current DOM:
  - Verify presence of region landmark (e.g., `data-testid="dashboard-root"`, role=`region`, correct `aria-label`).
  - If heading is required, render `PageHeader` in the relevant page, and add tests for heading text and actions.
- Add a11y checks with `jest-axe` (no violations) for layout and landmark roles.

## Test Execution & Coverage
- Run locale-related tests with `--no-cache` after moving `vi.mock('@/locales/*')` early in global setup.
- Execute targeted suites, then full test suite; iterate until all pass.
- Generate coverage report (v8) and ensure thresholds (e.g., 90% per current config) are met or adjust non-critical excludes.

## Artifacts & Documentation
- Use existing script to generate timestamped artifacts: unit/e2e logs, coverage tarball, screenshots (multi-locale, multi-viewport), Prometheus snapshot.
- Update PR description to include:
  - Mocking methodology (Sentry hoist, dynamic resolve, tenants auth per-suite, locales alias first).
  - Links/paths to artifacts and CI runs.
  - Verified scenarios and edge cases.

## Risks & Mitigations
- Risk: Test-local mocks overriding global mocks → document and enforce hoist order; prefer alias-based mocks.
- Risk: Route contract mismatch (JSON/SSE) → add explicit Accept header branching and schema.
- Risk: Flaky SSE tests → increase timeouts, consume stream robustly, decode chunks safely.

## Definition of Done
- Monitoring tests pass with Sentry spies receiving calls.
- Agents route JSON/SSE tests validate headers and payloads successfully.
- Tenants API tests cover authenticated/unauthenticated/permission-denied and pass.
- UI landmarks tests reflect current DOM, with a11y checks green.
- Full suite exit code 0; coverage generated; PR updated with artifacts and methodology.