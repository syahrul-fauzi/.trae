## Issues to Fix
- Invalid wildcard alias in `vitest.config.ts` causes type error and transform failures.
- Coverage thresholds incorrectly placed under `coverage` (types mismatch).
- `vitest.setup.ts` header typing in `NextResponse.json` not compatible with `HeadersInit`.
- `vi.mock` overload errors due to passing a third `{ virtual: true }` argument.
- `expect.extend` receives an object typed as `Record<string, unknown>` (type mismatch).

## Planned Changes
### 1) Convert Alias Object → Array with Regex Wildcard
- Replace `resolve.alias` object with an array of `{ find, replacement }` entries for all existing aliases.
- Add a single regex wildcard entry:
  - `find: /^next\/dist\/shared\/lib\/router\/utils\/.*/`
  - `replacement: resolve(__dirname, 'src/test/next-utils-shim.ts')`
- Rationale: aligns with Vitest resolver, removes duplicate alias warnings, and stabilizes all normalizeUrl variants.

### 2) Coverage Thresholds
- Move thresholds to `coverage.thresholds` struct:
  - `thresholds: { lines, functions, branches, statements }`
- Rationale: matches `CoverageV8Options` type; removes the overload error.

### 3) Fix `NextResponse.json` Headers Typing
- Build `merged: Record<string,string>` from any `HeadersInit` (Headers | [string,string][] | Record<string,string>) and pass as plain object in `ResponseInit.headers`.
- Rationale: satisfies `(HeadersInit & Record<string,string>)` typing and avoids array-type mismatch.

### 4) Adjust `vi.mock` Signatures
- Remove third `{ virtual: true }` argument for `next/server` and `next/config` mocks; keep two-argument form.
- Rationale: matches Vitest’s accepted overloads per current setup.

### 5) Correct `expect.extend` Typing
- Use `expect.extend(jestDom as any)` or cast to `Parameters<typeof expect.extend>[0]`.
- Rationale: resolves the `MatchersObject` typing error.

## Verification
- Run `pnpm -C apps/marketing test -r` and confirm no resolver failures (“Failed to resolve normalizeUrl”) and no alias-type errors.
- Sanity-run `apps/app` and `apps/web` suites to ensure unrelated areas remain green and AGUIEventStream behavior unaffected.

## Notes
- All changes are test-only and do not impact production code.
- AGUIEventStream line 264 (`stopPropagation`) remains correct and unchanged.

## Request
- Approve this plan; I will implement the alias array conversion, typing fixes in setup, and re-run the tests to deliver a clean, green suite.