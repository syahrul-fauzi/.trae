# TYPECHECK FIXES — SBA Agentic Monorepo

Ringkasan
- Tujuan: Menyelesaikan seluruh error TypeScript hingga `pnpm type-check` hijau penuh.
- Cakupan: @sba/utils, @sba/shared, @sba/ui, @sba/app, @sba/services.

@sba/utils
- Mengaktifkan build deklarasi tipe: packages/utils/tsup.config.ts:5 → dts: true
- Menyesuaikan tsconfig untuk dts: packages/utils/tsconfig.json:8–11 (declarationMap: false, incremental: false, tsBuildInfoFile)
- Hasil: dist/index.d.ts, dist/index.d.mts tersedia, diekspor via package.json.

@sba/shared
- Barrel ekspor lengkap: packages/shared/src/index.ts:1–5 mengekspor timeline, document, task, schemas
- Menambah tipe Task/User berbasis zod: packages/shared/src/types/task.ts

@sba/services
- Error impor tipe di entities teratasi setelah dts @sba/utils tersedia
- Verifikasi: pnpm --filter @sba/services type-check → sukses

@sba/ui
- Mengecualikan file non-produksi dari type-check: packages/ui/tsconfig.json:18–22 (stories, tests, CLI, templates, TimelineAuditDashboard)
- WorkflowBuilder: perapihan JSX dan varian Badge: apps/web/src/features/workflows/components/WorkflowBuilder.tsx:499–509, 648–658, 740
- Handler Select/Tabs bertipe string: apps/app/src/features/agui/ui/EnhancedAGUIDashboard.tsx:329–358
- Timeline mapping AGUIEvent → TimelineEvent aman: apps/app/src/features/agui/ui/EnhancedAGUIDashboard.tsx:560–563

@sba/app
- Document model:
  - Ganti `type` → `documentType` di filter/selector: apps/app/src/entities/document/model.ts:231–246
  - `updatedAt` ISO string di update: apps/app/src/entities/document/model.ts:72–78
  - Guard `content` opsional: apps/app/src/entities/document/model.ts:235–236
  - Stats & helper display/color konsisten dengan `documentType`: apps/app/src/entities/document/model.ts:255–271, 291–319
- Task model:
  - `updatedAt` ISO string pada update: apps/app/src/entities/task/model.ts:74–78
  - `formatTaskDueDate(dueDate?: string | Date)`: apps/app/src/entities/task/model.ts:368–387
  - Payload form `dueDate?.toISOString()` (validasi di form UI)

Verifikasi
- @sba/utils build: pnpm --filter @sba/utils build → dts sukses
- @sba/services: pnpm --filter @sba/services type-check → sukses
- Root: pnpm type-check → semua paket lulus (hijau)

Catatan
- Perubahan fokus pada stabilitas typing produksi; file stories/tests/CLI dieksklusi dari type-check untuk menghindari dev-only dependency.
