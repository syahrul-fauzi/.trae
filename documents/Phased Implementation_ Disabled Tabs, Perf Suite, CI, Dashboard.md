## Phase 1: Disabled Tab UI Implementation
- UX/Accessibility
  - Disabled styling: grayed appearance, `cursor-not-allowed`, reduced opacity
  - ARIA: `role=tab`, `aria-disabled=true`, logical `tabIndex` management
  - Interaction blocking: ignore click/Enter/Space on disabled tabs; skip in Arrow navigation
- Unit Tests (≥90% coverage for tab component)
  - Render disabled state (styles and attributes)
  - Block interactions and keep selection unchanged
  - ARIA compliance assertions
- Deliverables
  - Updated tab component (UI + a11y)
  - Test suite passing with coverage report
  - Short doc section in `docs/architecture/README.md` (Tabs a11y patterns)
  - Demo: umbrella page showcasing disabled tab scenario

## Phase 2: Performance Specification Enhancement
- Metrics & Benchmarks
  - Load time: `gotoMs`, `domContentLoadedMs`, first render to `mermaid-svg`
  - Render: per-diagram timings, type/depth annotations
  - Memory: `performance.memory` (heap usage, limits) when available
  - FPS consistency: rAF sampling (p50/p95)
  - DOM size: node count
- Tests & Thresholds
  - Performance tests produce expanded JSON
  - Define acceptance criteria: p95 render ≤ 2000ms; memory usage < threshold; FPS p95 ≥ target
  - Document thresholds and how to tune them
- Deliverables
  - Enhanced Playwright perf spec
  - Perf JSON schema doc
  - Benchmarks recorded and validated locally

## Phase 3: CI Pipeline Improvements
- CI Stages
  - Add automated performance testing job (post build/start docs)
  - Parallelize test matrix (unit/integration/e2e/perf) to reduce time
  - Regression alerts: compare perf JSON to baseline, fail on >20% p95 regression
  - Artifact storage: upload perf JSON and comparison report
- Deliverables
  - Updated `.github/workflows` with perf stage
  - Comparison report artifact
  - Alerts on regressions; green CI for passing thresholds

## Phase 4: Dashboard Page Scaffolding
- Routing & Structure
  - New docs page: `/<locale>/perf/diagrams`
  - Responsive layout with data containers, summary panels, filters
  - State management for artifact selection/version comparison
- Components
  - Time-series chart (p95 trends)
  - Bar chart (type/depth comparisons)
  - Heatmap (per-diagram intensity)
  - Scorecards (DOM, memory, FPS, thresholds)
- Deliverables
  - Scaffolded page + core components
  - Mock data for dev and artifact integration hook
  - Docs: how to use and interpret dashboard
  - Demo verification: interactive walkthrough

## Quality Gates (per phase)
- Code Review: approval required
- Tests: pass; coverage ≥ 90% for changed modules
- Docs: updated with a11y/perf specs and usage
- Demo: feature walkthrough recorded
- Performance: thresholds met where applicable