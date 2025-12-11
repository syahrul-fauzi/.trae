## Umbrella Page Population
- Loader component: create `apps/docs/features/docs/ui/MmdLoader.tsx` to dynamically read `.mmd` sources and hand them to `MermaidRenderer`.
  - Implementation options:
    - Public mirror: copy/symlink `workspace/02_Architecture/diagrams` into `apps/docs/public/diagrams` during dev/build; loader fetches via `fetch('/diagrams/<file>.mmd')` for hot-reload.
    - FS read on server: use App Router server component to `fs.readFile` `.mmd` for SSR and pass content to client `MermaidRenderer` (dev-hot reload supported by Next).
  - Source mapping: maintain `apps/docs/app/[locale]/diagrams/umbrella/sources.ts` exporting a typed list of diagram entries (id, title, filePath, depth), enabling the page to render live previews across L0/L1/L2.
  - Hot-reload: rely on Next dev server’s HMR; when `.mmd` changes, re-fetch or re-read on navigation; add “Refresh” button to re-render.
  - Accuracy verification: validate supported Mermaid blocks (sequenceDiagram, flowchart, stateDiagram, classDiagram, erDiagram) by test previews; show fallback as code when render fails.

## Umbrella Page UI & Toggles
- Enhance `apps/docs/app/[locale]/diagrams/umbrella/page.tsx`:
  - Toggle depth control (tabs: L0/L1/L2) to filter displayed diagrams; preserve route state via querystring.
  - Responsive container, dark-mode-aware backgrounds.
  - Accessibility: tablist/tabpanel roles; keyboard navigation; visible focus.

## Testing Expansion
- Route tests: Playwright specs for `/[locale]/diagrams/umbrella` ensure page loads, headings and tab controls visible.
- Toggle interactions:
  - Initial state verification: default depth = L0 with expected diagrams present.
  - Toggle L1/L2: assert diagram list changes accordingly; ensure `mermaid-svg` elements appear.
  - Nested toggles: switching depth and individual diagram sections expanded/collapsed preserves state.
- Visual regression:
  - Screenshot `mermaid-svg` containers per depth; use `toHaveScreenshot()` baselines.
- Accessibility:
  - Keyboard navigation across tabs and sections; assert roles (`tablist`, `tab`, `tabpanel`) and `aria-selected` changes.
  - Screen reader: ensure `aria-label` exists on Mermaid containers and tab labels are descriptive.

## Performance Artifact Export (Optional)
- JSON schema `perf_mermaid.json`:
  - `build`: { `id`, `sha`, `branch`, `date`, `env` }
  - `pages`: [{ `path`, `locale`, `hasMermaid`, `count`, `ttfmMs`, `renderMs` }]
  - `summary`: { `p95RenderMs`, `p50RenderMs`, `samples` }
- CI integration:
  - Extend docs E2E workflow to attach `perf_mermaid.json` from Playwright after run.
  - Retention policy via artifact settings; name includes commit SHA and date.
- Metadata tagging: include Next build ID, Node version, Playwright version.
- Analysis tooling:
  - Simple script in `scripts/perf/analyze.js` to read artifacts, produce trend CSV/markdown and charts (optional).

## Implementation Steps
1) Build `MmdLoader` and choose source strategy (public mirror fetch or server `fs.readFile`); wire to Umbrella page with depth toggles and `sources.ts` mapping.
2) Add Playwright specs covering route, toggles L0/L1/L2, nested scenarios, accessibility roles and keyboard.
3) Extend visual regression coverage with baseline snapshots per depth.
4) Implement perf JSON export in Playwright (attach + write file); update CI to upload artifacts with retention naming.
5) Document usage in `docs/architecture/README.md` (source mapping, toggles, testing, perf artifacts).

## Risks & Mitigation
- FS access in server components: ensure paths exist in CI; prefer public mirror in production builds.
- Mermaid render failures: fallback to code block; log minimal error; do not block page.
- Flaky visual diffs: stabilize container size and theme; ignore anti-aliasing.

## Success Criteria
- Umbrella page renders `.mmd` content live with depth toggles and HMR.
- 100% diagrams (when present) pass SVG presence assertions.
- p95 render metrics exported and stored; visual baselines consistent; a11y tests pass.