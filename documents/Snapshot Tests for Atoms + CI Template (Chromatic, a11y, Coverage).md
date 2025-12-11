## Tujuan
- Menambahkan snapshot test komprehensif untuk semua varian utama komponen atoms.
- Menyediakan template CI (YAML) siap pakai untuk Chromatic, a11y (axe-core, WCAG AA), dan coverage (lcov, gating ≥80%).

## Cakupan Komponen Atoms
- Daftar atoms (eksisting): Alert, AlertDialog, Avatar, Badge, Button, Card, Dialog, DropdownMenu, Icon, Input, Label, Progress, ScrollArea, Select, Separator, Skeleton, Switch, Tabs, Textarea, Toast, Tooltip (`packages/ui/src/atoms/index.ts`).
- Prioritas batch 1: Button, Input, Label, Avatar, Icon, Badge, Card, Progress, Switch, Tabs, Select, Textarea.

## Struktur & Lokasi Test
- Lokasi: `packages/ui/src/atoms/<Component>/<Component>.snapshot.test.tsx`.
- Standar skenario tiap komponen:
  1) Render semua props & state tersedia (mis. `loading`, `error`, `success`, `disabled`).
  2) Variasi ukuran (xs/sm/default/lg/icon) bila ada.
  3) Variasi warna/variant (default/secondary/outline/ghost/destructive) bila ada.
  4) Status `disabled/active/focus/hover` (render statis + class/state yang relevan).
- Contoh (Button):
  ```tsx
  import { render } from '@testing-library/react';
  import { Button } from './Button';
  describe('Button snapshots', () => {
    it('default', () => { const { baseElement } = render(<Button>Default</Button>); expect(baseElement).toMatchSnapshot(); });
    it('secondary', () => { const { baseElement } = render(<Button variant="secondary">Secondary</Button>); expect(baseElement).toMatchSnapshot(); });
    it('outline', () => { const { baseElement } = render(<Button variant="outline">Outline</Button>); expect(baseElement).toMatchSnapshot(); });
    it('ghost', () => { const { baseElement } = render(<Button variant="ghost">Ghost</Button>); expect(baseElement).toMatchSnapshot(); });
    it('disabled', () => { const { baseElement } = render(<Button disabled>Disabled</Button>); expect(baseElement).toMatchSnapshot(); });
    it('loading', () => { const { baseElement } = render(<Button loading>Loading</Button>); expect(baseElement).toMatchSnapshot(); });
    it('sizes', () => { const { baseElement } = render(<div><Button size="xs">XS</Button><Button size="sm">SM</Button><Button>Default</Button><Button size="lg">LG</Button><Button size="icon" aria-label="Settings">⚙️</Button></div>); expect(baseElement).toMatchSnapshot(); });
  });
  ```
- Pola serupa untuk: Input (error/success/leftIcon/rightIcon), Label (basic/with htmlFor), Avatar (image/fallback), Icon (variasi ikon), Badge (varian warna), Card (header/body/footer), Progress (value/indeterminate), Switch (checked/disabled), Tabs (default/disabled), Select (options/disabled), Textarea (error/success).

## Penguatan Testing
- Integrasi ThemeProvider pada snapshot untuk konsistensi tokens/tema:
  - Gunakan wrapper optional:
  ```tsx
  import { ThemeProvider } from '../../theme/ThemeProvider';
  const withTheme = (ui) => <ThemeProvider defaultTheme={null}>{ui}</ThemeProvider>;
  // render(withTheme(<Button/>))
  ```
- Aksesibilitas unit (opsional):
  - Tambahkan pengujian ARIA dasar (mis. `aria-disabled`, `aria-busy`) di test non-snapshot.

## Template CI (GitHub Actions)
- File: `.github/workflows/ui-quality.yml`.
- Isi ringkas:
  ```yaml
  name: UI Quality Gates
  on:
    push:
      branches: ["main", "release/*"]
      tags: ["v*"]
    pull_request:
      branches: ["main"]

  env:
    NODE_VERSION: 18
    PNPM_VERSION: 8
    CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_PROJECT_TOKEN }} # set di repo secrets

  jobs:
    quality:
      runs-on: ubuntu-latest
      steps:
        - name: Checkout
          uses: actions/checkout@v4
        - name: Setup Node
          uses: actions/setup-node@v4
          with:
            node-version: ${{ env.NODE_VERSION }}
        - name: Setup pnpm
          uses: pnpm/action-setup@v4
          with:
            version: ${{ env.PNPM_VERSION }}
        - name: Install deps
          run: pnpm i --prefer-frozen-lockfile

        # Build tokens sebelum doks
        - name: Build design tokens
          run: pnpm tokens:normalize && pnpm tokens:build

        # Lint a11y wajib hijau
        - name: Lint a11y
          run: pnpm ui:lint-a11y

        # Test + Coverage (lcov) dengan gate >=80%
        - name: Test UI
          run: pnpm --filter @sba/ui run test -- --coverage --coverage.reporter=lcov
        - name: Enforce coverage >=80%
          run: |
            cat packages/ui/coverage/lcov.info > /dev/null || exit 1
            node scripts/ci/coverage-threshold.js 0.8 packages/ui/coverage/coverage-final.json

        # Build Storybook
        - name: Build Storybook
          run: pnpm ui:build-docs

        # Chromatic publish dengan threshold konservatif dan auto-accept minor changes
        - name: Publish to Chromatic
          run: npx chromatic --project-token=${{ env.CHROMATIC_PROJECT_TOKEN }} --storybook-build-dir=packages/ui/storybook-static --exit-zero-on-changes --auto-accept-changes --externals

        # A11y scan via axe + Playwright pada Storybook static (WCAG AA)
        - name: A11y audit
          run: node scripts/ci/a11y-axe-scan.js --dir packages/ui/storybook-static --wcag AA --threshold 0
  ```
- Catatan:
  - `scripts/ci/coverage-threshold.js`: membaca `coverage-final.json` dan gagal jika lines/functions/branches/statements < 0.8.
  - `scripts/ci/a11y-axe-scan.js`: gunakan `axe-core`/`axe-playwright` untuk memindai HTML Storybook; `--threshold 0` berarti tidak boleh ada error.
  - Chromatic flags:
    - `--exit-zero-on-changes` untuk tidak memblok bila ada perubahan yang diterima.
    - `--auto-accept-changes` untuk auto accept minor (sesuaikan kebijakan tim).

## Variabel Environment
- `CHROMATIC_PROJECT_TOKEN` (Secrets repository).
- (Opsional) Figma: `FIGMA_TOKEN`, `FIGMA_FILE_ID` bila sinkronisasi otomatis dipakai sebelum tokens build.

## Penyesuaian & Komentar
- Threshold visual dapat dinaikkan/diturunkan sesuai sensitivitas desain.
- Coverage gate pada 80% (sesuai permintaan); tetap jaga target internal 90% untuk `packages/ui`.
- A11y threshold dapat diatur >0 untuk toleransi (mis. peringatan), tetapi default 0 untuk ketat.

## Trigger Contoh
- `push` ke `main`, `release/*`, dan tag `v*`.
- `pull_request` ke `main` untuk gating PR.

## Output yang Diharapkan
- Snapshot tests untuk atoms utama lengkap dengan variasi props/size/variant/state.
- Workflow CI yang menegakkan: a11y lint hijau, coverage lcov ≥80%, dan audit visual Chromatic.
- Laporan lcov tersimpan di `packages/ui/coverage/lcov.info`; audit a11y menghasilkan ringkasan pada job.
