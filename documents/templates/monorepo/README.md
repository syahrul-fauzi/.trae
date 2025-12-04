# SBA Turbo Monorepo Template (FSD/DDD/Hybrid)

Struktur monorepo untuk microservices dan frontend dengan prinsip Feature-Sliced Design (FSD), Domain-Driven Design (DDD), dan pendekatan hybrid pragmatis.

## Struktur
```
.
├─ apps/
│  ├─ api-gateway/           # service API gateway
│  ├─ sba-dashboard/         # web app (FSD)
│  └─ worker-jobs/           # background workers
├─ packages/
│  ├─ shared-domain/         # domain models (DDD)
│  ├─ shared-kernel/         # base abstractions, utils
│  ├─ http-client/           # typed fetch/axios client
│  └─ config/                # env management
├─ tools/
│  ├─ eslint-config/
│  ├─ tsconfig/
│  └─ jest-preset/
├─ turbo.json
├─ package.json
└─ README.md
```

## Konvensi
- FSD untuk frontend (`apps/sba-dashboard`): `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`.
- DDD untuk backend: bounded contexts di `packages/shared-domain`, services di `apps/*`.
- Hybrid: gunakan shared-kernel untuk cross-cutting concerns.

## Perintah
- `turbo run build` — build semua workspace
- `turbo run test` — test paralel
- `turbo run lint` — lint konsisten
- Frontend dev: `cd apps/sba-dashboard && npm i && npm run dev`
 - Design System: `npm run storybook` di root untuk membuka Storybook paket `@sba/ui`
 - Rilis UI: `npm run release:ui` (default `patch`) lalu tag `ui-vX.Y.Z` untuk publish otomatis

## Penggunaan packages/ui
- Tambahkan dependency workspace: `"@sba/ui": "workspace:*"`
- Import komponen/tokens:
  - `import { Button, Card, Header, DashboardTemplate, DashboardPage } from '@sba/ui'`
  - `import { ThemeProvider, colors, spacing, radius } from '@sba/ui'`
- Theming: bungkus halaman dengan `ThemeProvider` dan override `tokens` sesuai branding.
