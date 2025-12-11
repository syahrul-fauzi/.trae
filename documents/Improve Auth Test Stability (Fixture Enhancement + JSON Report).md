## Approach Selection
- Prefer Option 2: Fixture Enhancement — preserves existing text-based assertions, yields deterministic WCAG-compliant alerts.
- Keep Option 1 (Test Case Modification) as fallback for any spec whose assertions must remain text-agnostic.

## Changes (Option 2: Fixture Enhancement)
- Inject deterministic alert behavior into the mocked Login page fixture:
  - Add a small inline script that sets `[role="alert"]` text to "Too many attempts" on rate-limit scenarios and "Signed in successfully" on success.
  - Ensure `[role="alert"]` has `aria-live="assertive"` and remains focusable for keyboard announcements (WCAG 2.1 AA).
  - Maintain existing test IDs: `auth-email`, `auth-password`, `auth-submit`, and keep text-based assertions unchanged.
- For accessibility tests:
  - Verify `role="alert"`, `aria-live`, presence and visibility; ensure `#main-content` landmark exists.

## Fallback (Option 1: Test Case Modification)
- For any spec using varying messages, refactor assertions to check:
  - Presence/absence of the alert container.
  - A new `data-state` attribute (e.g., `data-state="error"|"success"`).
  - The correct ARIA role (`role="alert"`).
- Keep test coverage same by asserting UI state rather than message text.

## Execution Steps
1) Update auth fixture route used by `apps/app/e2e/auth.spec.ts`:
   - Populate `[role="alert"]` text deterministically for both error and success flows.
   - Add `data-state` to alert for optional state assertions.
2) Ensure consistency across related specs (runs/discovery/observability/monitoring/agui) that reference login flows:
   - Replace any lingering helper login with the mock route already adopted.
3) Run full suite with JSON reporter:
   - Command: `PLAYWRIGHT_BASE_URL=http://localhost:3001 pnpm -C apps/app test:e2e --reporter=json > apps/app/test-results/results.json`.
   - Repeat run twice (stability check); compare totals and durations.
4) Generate FINAL_REPORT.md at `apps/app/docs/FINAL_REPORT.md` including:
   - Summary statistics: total passed/failed; breakdown by module and spec file.
   - Execution duration metrics: total and per-file.
   - Accessibility recommendations:
     - WCAG violations categorized (landmarks, aria-labels, contrast, keyboard nav, ARIA).
     - Specific recommendations mapped to failing specs.
   - Debugging references:
     - Exact file paths and line ranges for all failures.
     - Repro steps per issue.
     - Suggested patches (diff snippets) for quick resolution.
   - Version control metadata: current branch, last commit hash and date.

## QA & Compliance
- Ensure all changes maintain existing test coverage; no reductions in number of assertions.
- Verify WCAG 2.1 AA compliance: `aria-live`, roles, keyboard behavior, landmarks.
- Perform code review on modified fixtures: consistent naming, no brittle selectors.

## Success Criteria
- Auth suite becomes stable across browsers with existing text-based assertions intact.
- reporter JSON available and parsable; FINAL_REPORT.md contains structured, stakeholder-friendly summary.
- No regressions in a11y coverage; recommendations aligned to WCAG with actionable references.

## Risks & Mitigation
- Risk: Alert text drift across scenarios — Mitigate via fixture-control and optional `data-state`.
- Risk: Flakiness due to timing — Use `domcontentloaded`/`networkidle` waits, assert landmarks and roles.

## Next
- Upon approval, implement fixture enhancement, run full suite, and publish FINAL_REPORT.md with the detailed metrics and WCAG recommendations.