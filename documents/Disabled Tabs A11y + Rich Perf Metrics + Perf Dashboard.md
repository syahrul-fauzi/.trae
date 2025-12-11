## Scope
- Implement accessible disabled tabs UI with robust tests.
- Expand performance test metrics and JSON output; add CI comparison with regression gating.
- Create a docs performance dashboard with interactive charts and artifact integration.

## 1) Disabled Tabs UI & Tests
- UI changes (umbrella tabs):
  - Add `aria-disabled="true"` and disabled styling (grayed color, `cursor-not-allowed`, reduced opacity).
  - Set `tabIndex=-1` for disabled tabs (non-focusable) and skip in keyboard navigation (`ArrowLeft/Right`).
  - Block activation (click, Enter/Space) when disabled; keep `aria-selected` unchanged.
- Unit tests:
  - Render disabled tab and assert classes, `aria-disabled`, and non-focusable.
  - Simulate click/keyboard activation and assert no state changes.
  - Verify screen reader attributes (role/aria) via DOM queries.
- E2E tests:
  - Add Playwright spec: initial disabled state; arrow navigation skips disabled; Enter/Space does not select disabled; visual screenshot for disabled styling.

## 2) Performance Measurement Enhancements
- Test updates (`mermaid-performance.spec.ts`):
  - Record granular timings: `gotoMs`, `domContentLoadedMs`, `firstSvgMs`, `perDiagramMs` (per `mermaid-svg`).
  - Type/depth metrics per page: annotate from source mapping.
  - Collect DOM node count (`document.querySelectorAll('*').length`).
  - Memory stats (Chromium): read `performance.memory` if available (`jsHeapSizeLimit`, `usedJSHeapSize`).
  - Frame rate consistency: sample `requestAnimationFrame` intervals (median/p95) over short window post-render.
- JSON schema expansion:
  - `build`: `{ sha, branch, date, node, playwright, nextBuildId, os }`.
  - `pages`: `[{ path, locale, depth, type, diagramCount, timings: { gotoMs, domContentLoadedMs, firstSvgMs, perDiagramMs }, dom: { nodes }, memory: { usedJSHeapSize, jsHeapSizeLimit }, fps: { p50, p95 } }]`.
  - `summary`: `{ p50RenderMs, p95RenderMs, samples, significance: { n, se, ci95 } }`.
- CI pipeline:
  - Upload JSON with pattern `perf_mermaid_${{ github.sha }}_${{ YYYY-MM-DD }}.json`.
  - Add comparison step: fetch previous artifact (latest on default branch), compute deltas, generate markdown report, and fail build if p95 regression > threshold (e.g., +20%).

## 3) Performance Visualization Dashboard
- Page: `apps/docs/app/[locale]/perf/diagrams/page.tsx`.
  - Loads latest JSON artifacts (dev: local mock; CI: served from public folder or storage).
  - Displays:
    - Time-series line chart for p95 over time.
    - Bar chart comparing per-page type/depth render times.
    - Heatmap grid for `perDiagramMs` intensities.
    - Tables for DOM nodes, memory stats, and fps metrics.
    - Regression alerts if thresholds exceeded.
- Components:
  - `features/perf/ui/TrendChart.tsx`, `BarCompare.tsx`, `HeatmapGrid.tsx`, `PerfScorecard.tsx` using Recharts.
- Artifact integration:
  - Auto-detect most recent files; version comparison selector.
  - Fallback mock data for dev if no artifacts.

## Acceptance Criteria
- Disabled tabs are non-interactive, correctly styled, skip in keyboard navigation, and pass a11y tests.
- Perf JSON includes granular timings, memory/fps/DOM counts, with type/depth annotations and significance.
- CI uploads JSON, generates comparison report, and fails on significant regressions.
- Dashboard renders charts and tables from artifacts with clear regression indicators.