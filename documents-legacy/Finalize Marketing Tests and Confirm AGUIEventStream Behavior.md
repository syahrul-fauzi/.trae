## Objectives
- Keep AGUIEventStream keyboard behavior stable; no changes required to `stopPropagation()`.
- Resolve remaining apps/marketing Vitest failures caused by Next internal utilities and case-sensitive assertions.
- Optionally reduce noisy warnings in packages/ui tests.

## AGUIEventStream
- Confirm current logic stays: `preventDefault` + `stopPropagation` in key handlers keeps navigation scoped to the feed. Reference: apps/app/src/features/agui/ui/AGUIEventStream.tsx:264.
- No further code changes planned; tests are green.

## Marketing Vitest Fixes
1. Extend Next mocks in `vitest.setup.ts`:
   - Ensure `NextResponse` wraps native `Response` to support `.json()/.text()`, cookies, status, and `redirect` semantics.
   - Ensure `NextRequest` wraps native `Request` for `.json()/.text()` and `nextUrl` parsing.
   - These are test-only; production unaffected.
2. Add shims for internal Next router utils that cause transform failures:
   - Alias in Vitest config to `src/test/next-utils-shim.ts` for:
     - `normalize-url`, `remove-trailing-slash`, `add-leading-slash`, `resolve-rewrites`.
   - Provide trivial passthrough implementations in the shim.
3. Adjust failing assertions that differ only by case:
   - Update tests to use case-insensitive checks (e.g., `expect(text).toMatch(/pricing/i)`) where the rendered text may be lowercased.
   - Alternatively, normalize headings in the test data before asserting.
4. Verify webhook and form controllers:
   - Ensure tests construct `NextRequest` (not plain `Request`) where controller expects NextRequest.
   - Validate `.json()`/`.text()` usage under mocks by re-running integration tests that hit `contactController`, `newsletterController`, `basehubWebhookController`.

## UI Package Warnings (Optional)
- Reduce “Invalid Chai …” warnings by:
  - Rewriting assertions to avoid matching dynamic SVG/ARIA structures; prefer role/text queries.
  - Confirm `@testing-library/jest-dom/vitest` is loaded in `packages/ui` test setup.

## Verification
- Run full suites:
  - `pnpm -C apps/marketing test -r` (ensure transforms and controllers pass).
  - `pnpm -C packages/ui test -r` (review warnings, ensure green).
  - `pnpm -C apps/app test -r` (sanity check AGUI remains green).

## Safety
- All changes are test-only shims/mocks and assertion updates, with no impact on production code paths.

## Request
- Approve proceeding with the test-only shims and assertion updates in apps/marketing, and optional warning cleanup in packages/ui. I will implement these changes and re-run suites to confirm green status.