## Tujuan

* Membangun sistem komponen UI konsisten, modular, dan siap pakai berbasis atomic design (atoms → molecules → organisms) dengan design tokens terpusat dari Figma.

* Menyediakan dokumentasi komprehensif dan pipeline otomatis yang menghubungkan Figma → workspace → packages/ui → Storybook/Chromatic.

## Prinsip & Referensi

* Atomic design (Brad Frost): atoms, molecules, organisms, templates, pages — komponen dari kecil → besar untuk konsistensi dan reuse.

* Design tokens sebagai data tech-agnostic (.json) untuk warna, tipografi, spacing, radius, shadow, z-index.

## Deliverables

* Inventori komponen (atoms/molecules/organisms) dan state/interaction patterns.

* Design tokens terpusat + pipeline konversi (CSS/SASS, theme React/Vue/Angular, TypeScript typings).

* Komponen atomic dengan variants, props, dan dokumentasi Storybook.

* Dokumentasi di `README.md` (root) dan `docs/README.md` (operasional & panduan), RFC per komponen di `docs/`.

* `library-map.md` (dependency graph, version history, migration guides).

* QA: visual regression, cross-browser/mobile responsiveness, a11y guidelines.

## Struktur & Perubahan (tanpa eksekusi kode sekarang)

* `workspace/03_Design-System/Foundations/tokens-raw.json` — hasil export Figma (raw tokens).

* `workspace/03_Design-System/tokens/*.json` — tokens terstruktur (color/typography/spacing/radius/shadow/zindex).

* `packages/ui/styles/tokens/` — output konversi (CSS/SASS vars, TS typings, theme configs).

* `packages/ui/src/components/` — atoms/molecules/organisms (Button, Input, Icon, Label, Avatar; SearchBar, Card, Dropdown, Alert; Navigation, Form, Modal, DataTable).

* `docs/rfc/components/<ComponentName>.md` — RFC komponen.

* `docs/library-map.md` — peta dependensi, riwayat versi, panduan migrasi.

* `docs/design-system/` — design guidelines, a11y, workflows, contribution.

## Analisis Desain Mendalam

* Kumpulkan aset Figma: tautan file/komponen + screenshot state (default/hover/focus/active/disabled/loading/error).

* Inventori:

  * Atoms: Button, Input, Icon, Label, Avatar.

  * Molecules: SearchBar, Card, Dropdown, Alert.

  * Organisms: Navigation, Form, Modal, DataTable.

* Pola interaksi & state management: keyboard focus ring, error/loading, disabled, theming (light/dark), i18n RTL/LTR.

## Manajemen Design Tokens

* Skema `tokens-raw.json`:

```json
{
  "color": {"primary": "#...", "secondary": "#...", "semantic": {"success": "#...", "error": "#..."}},
  "typography": {"fontFamilies": {"base": "Inter"}, "sizes": {"sm": 12, "md": 14, "lg": 16}, "weights": {"regular": 400, "bold": 700}},
  "spacing": {"scale": {"xs": 4, "sm": 8, "md": 12, "lg": 16}},
  "radius": {"sm": 4, "md": 8},
  "shadow": {"sm": "0 1px 2px rgba(...)"},
  "zIndex": {"dropdown": 1000, "modal": 1100}
}
```

* Pipeline konversi:

  * Input: `Foundations/tokens-raw.json` → normalisasi ke `tokens/*.json` (Style Dictionary).

  * Output:

    * CSS/SASS variables: `--sba-color-primary`, `--sba-font-size-md`, dsb.

    * Theme configs: React (styled-components/emotion), Vue, Angular.

    * TypeScript typings: `packages/ui/styles/tokens/tokens.d.ts`.

  * Versioning: semver untuk tokens; changelog di frontmatter tokens README; gate CI untuk compatibility.

## Pengembangan Komponen Atomic

* Atoms

  * Button: `variant` (primary/secondary/ghost), `size` (sm/md/lg), `state` (loading/disabled), a11y (role, aria-busy).

  * Input: label/description/error, `prefix/suffix`, focus ring, validation.

  * Icon: scalable (SVG), accessible aria-hidden/title.

  * Label: semantic (success/error), contrast AA/AAA.

  * Avatar: image/fallback initials, sizes.

* Molecules

  * SearchBar: compose Input + Button + optional Icon; debounced state.

  * Card: header/body/footer slots, elevation tokens.

  * Dropdown: keyboard navigation, focus trapping, portal (z-index tokens).

  * Alert: variants (info/success/warning/error), close action.

* Organisms

  * Navigation: responsive, collapsible, current route highlighting.

  * Form: group validation, async submit, a11y labels/helpers.

  * Modal: focus lock, escape close, backdrop tokens.

  * DataTable: sorting/filtering/pagination, empty/loading states.

* Dokumentasi Storybook: stories per state/variant; kontrol props; MDX docs; link Figma.

## Dokumentasi Komprehensif

* Root `README.md`: tambahkan bab “UI/UX System Stage” (tujuan, struktur, tokens → components pipeline, bagaimana konsumen di `packages/ui`).

* `docs/README.md`: tambahkan panduan operasional design system (design tokens, atomic design, workflows, QA).

* RFC komponen: template berisi tujuan, API/props/events/slots, state, a11y, perf, open questions.

* `docs/library-map.md`: dependency graph antar komponen, riwayat versi, migration guides.

## Validasi & QA

* Storybook + Chromatic untuk audit visual/visual regression.

* Cross-browser (Chrome/Firefox/Safari/Edge) dan mobile responsiveness.

* A11y: keyboard navigation, ARIA, contrast checks.

* Tests: unit (props/state), interaction (hover/focus/keyboard), visual regression; target coverage >90% untuk `packages/ui`.

## CI/CD & Automasi (rencana)

* Jobs:

  * `design-tokens:sync`: tarik dari Figma → perbarui `Foundations/tokens-raw.json` → normalisasi ke `tokens/*.json` → generate outputs untuk `packages/ui`.

  * `ui:build-docs`: build Storybook, publish Chromatic.

  * `ui:test`: unit + interaction + visual regression.

  * `ui:lint-a11y`: lint a11y & contrast.

  * `doc:lint`: validasi RFC & library-map.

* Gate: `xref-check` memastikan link Figma → komponen → docs konsisten.

## Integrasi ke Codebase

* `packages/ui`: impor tokens dari `styles/tokens/*`; theme provider (React) + util TS typings.

* Komponen atomic berada di `src/{atoms|molecules|organisms}/...` dengan index barrel dan tests.

* Storybook config untuk theming berdasarkan tokens.

## Timeline Implementasi

* Minggu 1: inventori komponen, skema tokens, pipeline konversi, integrasi awal ke `packages/ui`.

* Minggu 2: implementasi atoms + dokumentasi, Storybook + Chromatic, a11y lint.

* Minggu 3: molecules + organisms prioritas (Navigation/Modal/DataTable), RFC & library-map.

* Minggu 4: QA penuh (visual regression/cross-browser/mobile), finalize docs, coverage >90%.

## Keberhasilan

* Design tokens terpusat dan disinkronkan otomatis.

* Komponen atomic konsisten dengan dokumentasi lengkap & contoh penggunaan.

* Integrasi mulus ke `packages/ui` dengan coverage >90%.

* Pipeline dari Figma → workspace → `packages/ui` berjalan stabil, tanpa inkonsistensi.

Silakan konfirmasi untuk mulai menerapkan perubahan pada `README.md` (root & docs), membuat file tokens & pipeline, serta menyiapkan Storybook/Chromatic dan komponen atomic di `packages/ui`.
