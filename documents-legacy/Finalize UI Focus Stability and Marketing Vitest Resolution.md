## Goals
- Stabilize AGUIEventStream keyboard focus and tabIndex deterministically across tests and runtime.
- Resolve Vitest failures in apps/marketing caused by dynamic import resolution of Next features (normalizeUrl / Failed to resolve) while keeping tests fast.

## AGUIEventStream Adjustments
- Keep current layout-effect based focusing so the active item is always focused after `focusedIndex` updates.
- Retain `preventDefault` + `stopPropagation` on arrow keys to avoid browser scrolling inside feed.
- Blur the feed container after index change so the item with `tabIndex=0` becomes the active element consistently.
- No further code changes planned unless you observe regressions; tests are green for the spec.

## Marketing Vitest Resolution
- Root cause: jsdom Vitest resolving Next runtime utilities (e.g., internal `normalizeUrl`) via dynamic paths when executing SSR-like modules.
- Approach: strengthen Vitest setup mocks to avoid Next-specific module resolution during unit tests.

### Steps
1. In `apps/marketing/vitest.setup.ts`, extend existing Next mocks:
   - Mock `next/server` exports (`NextRequest`, `NextResponse`) minimally to satisfy imports.
   - Mock `next/config` to return a basic runtime config.
   - Ensure `next/dynamic` mock returns a plain component and prevents SSR resolution.
2. Add path alias coverage for any missing `@/...` entries already present; confirm `@sba/*` paths resolve (already configured in `vitest.config.ts`).
3. If tests still show “Failed to resolve”, add explicit mocks:
   - `vi.mock('next/dist/shared/lib/router/utils/normalize-url', () => ({ default: (u) => u }))` or alias a local shim when such internal util is imported indirectly.
4. Keep marketing Vitest environment on jsdom; avoid adding Vite React plugin in Vitest (it’s not needed for tests).

## Verification
- Run `pnpm -C apps/app test -r -t agui-eventstream-keyboard` to confirm the AGUI spec remains green.
- Run `pnpm -C apps/marketing test -r` to check resolution. Iterate mocks if any Next internal module still fails resolution.

## Rollback / Safety
- All changes are additive mocks in test setup only; production code paths untouched.
- If any mock causes behavioral drift, limit mocks to only modules referenced by failing tests.

## Request
- Confirm proceeding with the test-only mock additions in `apps/marketing/vitest.setup.ts`. Once approved, I’ll implement the mocks and re-run tests to ensure green.