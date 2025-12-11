## Umbrella Page Population
- Loader Component:
  - Create `apps/docs/features/docs/ui/MmdLoader.tsx` to fetch `.mmd` sources via `GET /api/diagrams?file=<name>` and render using `MermaidRenderer`.
  - Add `apps/docs/app/api/diagrams/route.ts` reading from `workspace/02_Architecture/diagrams` and returning text content (`Content-Type: text/plain`).
- Source Mapping:
  - Add `apps/docs/app/[locale]/diagrams/umbrella/sources.ts` exporting an array: `{ id, title, file, depth: 'L0'|'L1'|'L2', type: 'sequence'|'component'|'dataflow' }`.
  - Files: create L1/L2 variants: `umbrella-sequence-l1.mmd`, `umbrella-sequence-l2.mmd`, similarly for component and dataflow.
- Page Enhancements:
  - Update `apps/docs/app/[locale]/diagrams/umbrella/page.tsx` to:
    - Render tabs (depth: L0/L1/L2) with proper `role="tablist"`, `role="tab"`, `role="tabpanel"`.
    - Filter `sources` by selected depth; map to `MmdLoader` for live rendering.
    - Persist selected depth in querystring (`?depth=L1`) and read on mount.
  - Hot-reload in dev: `MmdLoader` re-fetches on navigation; add a “Refresh diagrams” button to trigger re-render.
- Rendering Accuracy:
  - Validate supported Mermaid types (sequenceDiagram, flowchart LR/TB, stateDiagram-v2, classDiagram, erDiagram); on error fallback to `<pre>` code.

## Testing Expansion (Playwright)
- Route Tests:
  - `apps/docs/e2e/tests/umbrella-route.spec.ts`: asserts page loads, heading visible, at least 3 sections for L0.
- Depth Toggle Tests:
  - `apps/docs/e2e/tests/umbrella-toggle-depth.spec.ts` covering:
    - Initial state: default depth L0; verify number of diagrams and first `mermaid-svg` visible.
    - Toggle L1/L2: click tabs, verify `aria-selected` updates, `tabpanel` content changes, `mermaid-svg` count matches `sources`.
    - Nested scenarios: switch L0→L2→L1 and back; ensure state persistence via querystring.
  - Keyboard Accessibility:
    - Arrow keys navigate tabs; `Enter/Space` activates; focus ring visible; roles present.
- Visual Regression:
  - `apps/docs/e2e/tests/umbrella-visual.spec.ts`: take screenshots of `mermaid-svg` containers per depth; baseline snapshots stored; diffs fail the build.

## Performance Artifact Export (Optional)
- JSON Schema:
  - `perf_mermaid.json`:
    - `build`: `{ sha, branch, date, node, playwright, nextBuildId }`
    - `pages`: `[{ path, locale, depth, type, count, renderMs }]`
    - `summary`: `{ p50RenderMs, p95RenderMs, samples }`
- Playwright Export:
  - Add helper to measure render time until first `mermaid-svg` visible per page/depth; write `perf_mermaid.json` to `apps/docs/playwright-report/` and attach to report.
- CI Integration:
  - Extend `.github/workflows/docs-e2e.yml` to upload `perf_mermaid.json` with artifact name `perf-mermaid-<sha>-<date>.json`.
  - Retention via GitHub artifact defaults; optional periodic cleanup.
- Analysis Tooling:
  - Add `scripts/perf/analyze.js` to aggregate multiple `perf_mermaid.json` files into CSV/Markdown; optional chart generation in later step.

## Risks & Mitigations
- FS path differences in CI: constrain loader to server API path `workspace/02_Architecture/diagrams`; validate existence and return 404 gracefully.
- Mermaid failures: use try/catch and fallback to code; do not block page; log minimal errors.
- Flaky visual tests: standardize container size and theme; run with `--with-deps` and deterministic fonts.

## Success Criteria
- Umbrella page renders live `.mmd` for L0/L1/L2 with accessible tab toggles and hot-reload in dev.
- 100% pages with Mermaid pass SVG presence assertions; a11y keyboard tests succeed.
- Performance p95 captured and uploaded as CI artifacts; visual snapshots remain stable across builds.