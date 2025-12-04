# @sba/ui — Atomic Design System

Struktur paket UI reusable berdasarkan Atomic Design (Atoms, Molecules, Organisms, Templates, Pages).

## Struktur
```
src/
  atoms/
  molecules/
  organisms/
  templates/
  pages/
  index.ts
```

## Penggunaan
- Install sebagai workspace monorepo, tambah `peerDependencies` React 18.
- Import: `import { Button, Card, Header, DashboardTemplate, DashboardPage } from '@sba/ui'`.

## Storybook
- Jalankan: `npm run storybook`
- Build: `npm run build-storybook`

## Testing
- Unit: Jest + Testing Library (`npm run test` dengan coverage)
- Visual regression: jalankan `@storybook/test-runner` atau integrasi Chromatic/Playwright sesuai pipeline CI.

## Lint & Format
- ESLint extends `@sba/eslint-config`, Prettier extends `@sba/prettier-config`.

## Build & Publish
- Build: `npm run build`
- Publish: siapkan CI/CD (GitHub Actions/Release) untuk mempublikasikan paket ke registry internal/NP
