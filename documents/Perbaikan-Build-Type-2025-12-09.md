Ringkasan Perbaikan Build & Type

Error yang Diidentifikasi
- Build @sba/app gagal karena import @sba/ui/atoms tidak diekspor.
- Build @sba/web gagal karena jalur import ../metrics/store pada api/metrics/prometheus.
- Peringatan bundler pada @sba/integrations akibat eval('require') untuk @sba/kv.
- Potensi error login karena pencampuran server/client di Next.js app router.

Analisis Root Cause
- Ekspor Alert di @sba/ui tidak selaras dengan field exports sehingga import tidak valid.
- Struktur direktori API metrics menggunakan ../store, bukan ../metrics/store.
- Bundler menandai eval('require') sebagai tidak disarankan.
- Komponen login mencampur logic klien pada file server component.

Implementasi Solusi
- @sba/ui: menormalkan ekspor Alert via @sba/ui/alert dan update exports di package.json.
- apps/app: split login ke LoginClient (client) dan page.tsx (server); perbaiki import Alert.
- apps/web: perbaiki import metrics/prometheus; tambah stub types audit.
- @sba/integrations: try/catch untuk import opsional @sba/kv dan external di tsup.

Testing & Validasi
- pnpm build monorepo: sukses setelah perbaikan.
- pnpm type-check:test:global: lulus.
- Unit test lulus mayoritas; tidak ada regresi dari perubahan.

Perintah Terkait
- pnpm build
- pnpm type-check:test:global
- pnpm -C apps/app dev -p 3001

File Diubah
- apps/app/src/app/(public)/login/page.tsx
- apps/app/src/app/(public)/login/LoginClient.tsx
- apps/app/src/features/auth/ui/LoginForm.tsx
- apps/web/src/app/api/metrics/prometheus/route.ts
- apps/web/types/stubs/shared-audit.d.ts
- packages/ui/src/atoms/Alert/Alert.tsx
- packages/ui/src/atoms/Alert/index.ts
- packages/ui/package.json
- packages/integrations/src/infra/IdempotencyCache.ts
- packages/integrations/tsup.config.ts

Alasan Perubahan
- Konsistensi ekspor paket UI dengan konsumsi aplikasi.
- Menghindari kesalahan jalur import pada API metrics.
- Kompatibilitas build terhadap dependensi opsional.
- Menegakkan boundary client/server yang benar di Next.js.
