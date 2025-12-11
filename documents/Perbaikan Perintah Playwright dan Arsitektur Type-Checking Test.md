## Diagnosa Singkat
- Error terminal: `PLAYWRIGHT_SKIP_WEBSERVER=true pnpm -C test:e2e` gagal karena `-C` membutuhkan path direktori, bukan nama script. PNPM mencoba `cd` ke `test:e2e` sehingga ENOENT.
- `apps/app/tsconfig.json:164–181` mengecualikan `e2e/**`, `playwright.config.ts`, serta semua `*.spec|*.test` dari type-check. E2E tidak ditipe-periksa.
- Banyak E2E memakai `any` (contoh `apps/app/e2e/auth.spec.ts:8–9, 15, 182–184`), berisiko menyembunyikan masalah tipe.

## Perintah yang Benar
- Jalankan Playwright (app) tanpa web server: 
  - `PLAYWRIGHT_SKIP_WEBSERVER=true pnpm -C apps/app test:e2e`
- Alternatif via workspace filter: 
  - `PLAYWRIGHT_SKIP_WEBSERVER=true pnpm --filter @sba/app run test:e2e`
- Filter test: 
  - `TEST_GREP="Authentication Flow|AuthLayout keyboard navigation" PLAYWRIGHT_SKIP_WEBSERVER=true pnpm -C apps/app test:e2e`

## Rencana Type-Checking (Test)
### Buat tsconfig.test.json (apps/app)
- Tujuan: hanya untuk type-check test/E2E tanpa mengubah tsconfig build.
- Isi yang diusulkan:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "noEmit": true,
    "strict": true,
    "types": ["node", "@playwright/test"],
    "skipLibCheck": true
  },
  "include": [
    "e2e/**/*.ts",
    "e2e/**/*.tsx",
    "playwright.config.ts"
  ]
}
```

### Script NPM (apps/app/package.json)
- Tambah:
  - `"type-check:test": "tsc -p tsconfig.test.json --noEmit"`
- CI langkah:
  - `pnpm --filter @sba/app run type-check:test`

## Standarisasi Tipe di E2E
- Ganti alias `any` dengan tipe Playwright resmi:
  - `import type { Page, Route, APIResponse } from '@playwright/test'`
  - Parameter test: `({ page }: { page: Page })` dan `route: Route`.
- Hindari `results: any` pada Axe:
  - `const results: Awaited<ReturnType<AxeBuilder['analyze']>> = ...`
  - `const violations = results.violations ?? [] as typeof results.violations`
- Helper `_utils.ts`: ketik respons dan header tanpa `as any`:
  - `const headers = response.headers() as Record<string, string>` → lebih baik map terketik dari hasil Playwright.

## Otomasi CI/CD
- Job “Type Check (Tests)”:
  - Menjalankan `pnpm --filter @sba/app run type-check:test`
- Job “E2E (App)”:
  - `TEST_GREP=... PLAYWRIGHT_SKIP_WEBSERVER=true pnpm --filter @sba/app run test:e2e`
- Reporter:
  - Simpan HTML report dan JSON; opsional capture via `apps/app/e2e/report-capture.spec.ts`.

## Validasi & Unit Test
- Tambahkan unit test ringan untuk helper tipe (opsional, Vitest):
```ts
// apps/app/e2e/__tests__/types.spec.ts
import { describe, it, expect } from 'vitest'
import { normalizeHeaders } from '../_utils'

describe('normalizeHeaders types', () => {
  it('returns typed record', () => {
    const h = new Map<string, string>([['x-frame-options', 'DENY']])
    const out = normalizeHeaders(h)
    expect(out['x-frame-options']).toBe('DENY')
  })
})
```

## Dokumentasi
- Update panduan: jelaskan perintah yang benar, alasan eksklusi tsconfig utama, dan penggunaan `tsconfig.test.json` untuk test-only type-check.
- Tambahkan pedoman penggunaan tipe Playwright (`Page`, `Route`) dan pola anti-`any`.

## Keamanan & Performa
- Type-check test berjalan terpisah dari build produksi, menjaga waktu build.
- `skipLibCheck` di test konfigurasi untuk memangkas noise dari d.ts pihak ketiga.
- Hindari logging atau hardcode rahasia di test.

## Output yang Diharapkan
- Perintah eksekusi E2E tidak error.
- Type-check khusus test mendeteksi penggunaan `any` yang tidak aman.
- CI menampilkan gate untuk type-check test dan hasil E2E yang stabil.
