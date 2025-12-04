Monorepo Boilerplate — SBA

Struktur Disarankan
```
/(repo root)
├─ apps/
│  ├─ web/                 # Next.js (AG-UI client)
│  ├─ admin/               # Admin dashboard
│  ├─ api/                 # Agent Orchestrator
│  └─ worker/              # Workers (render, indexing)
│
├─ packages/
│  ├─ ui/                  # Design system (Atomic)
│  ├─ agui-client/         # AG-UI helpers & types
│  ├─ sdk/                 # OpenAPI + zod SDK
│  ├─ tools/               # tool adapters (basehub, render, task, vector)
│  ├─ db/                  # prisma schema + RLS helpers
│  ├─ auth/                # JWT/RBAC helpers
│  ├─ telemetry/           # OTel + metrics helpers
│  └─ utils/               # logger, retry, idempotency, zod utils
│
├─ docs/                   # diagrams, runbooks, design docs
├─ scripts/                # seed/provision helpers
├─ .github/                # CI workflows
├─ turbo.json
├─ package.json
└─ pnpm-workspace.yaml
```

Konfigurasi Inti
```
pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```
```
turbo.json
{
  "globalDependencies": ["pnpm-lock.yaml"],
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**", "!.next/cache/**"] },
    "lint": { "cache": true },
    "type-check": { "cache": true, "outputs": ["tsc/**"] },
    "test": { "dependsOn": ["^build"], "outputs": ["coverage/**"] },
    "dev": { "cache": false, "persistent": true }
  }
}
```

Perintah Utama
- `pnpm install` — bootstrap dependencies
- `pnpm dev` — jalankan semua app
- `pnpm --filter apps/web dev` — hanya web
- `pnpm --filter apps/api dev` — hanya orchestrator
- `pnpm build` — build workspace
- `pnpm test` — test lintas packages/apps

CI/CD Ringkas
- PR: install, lint, type-check, test, build, publish preview artefak
- Preview: environment ephemeral per PR (frontend Vercel/edge; backend k8s namespace)
- Release: canary/blue‑green untuk orchestrator

Catatan
- Aktifkan remote cache Turbo di CI
- Standarkan outputs: `dist/**` (packages) dan `.next/**` (apps)

SDK Generation dari OpenAPI
- Gunakan generator untuk menghasilkan klien TypeScript + Zod dari `api-openapi.yaml`.
- Contoh skrip (di root `package.json`):
```
{
  "scripts": {
    "sdk:gen": "pnpm --filter packages/sdk run gen"
  }
}
```
- Di `packages/sdk`: sediakan skrip `gen` yang:
  - Membaca `Smart Business Assistant/docs/api-openapi.yaml`
  - Menghasilkan klien TS (fetch-based) dengan tipe aman
  - Mengeluarkan artefak ke `packages/sdk/src/generated`

Contract Tests
- Buat skenario positif/negatif untuk tools (`createTask`, `renderDocument`).
- Validasi error model (`BAD_REQUEST`, `RATE_LIMIT`, `CONFLICT`, `UNAVAILABLE`).
- Integrasikan ke CI pada langkah test kontrak.
