## Tujuan
- Menyelesaikan migrasi impor ke subpath `@sba/entities/*` di seluruh `apps/*` agar konsumsi domain stabil, tree-shakable, dan konsisten.
- Menetapkan manajemen versi internal dengan Changesets dan rentang `workspace:^` untuk semua konsumen `@sba/entities`.
- Menyediakan adapter contoh (API & Web) yang mendemonstrasikan DTO dan events untuk serialisasi/validasi di boundary.
- Memverifikasi integritas sistem end‑to‑end (type-check, lint, test) tanpa regresi.

## Ruang Lingkup
- Direktori: `apps/*`, `packages/*` (khususnya `apps/api`, `apps/web`, `packages/services`).
- Paket pusat: `@sba/entities` (public API: user, conversation, workflow, document, shared). Referensi: `/packages/entities/src/index.ts:1–9`.
- Konfigurasi TS root: alias ke `dist` untuk subpath entities dan UI. Referensi: `/tsconfig.json`.

## Codemod
- Target: Ganti semua `from '@sba/entities'` menjadi subpath sesuai modul yang digunakan:
  - Conversation symbols → `@sba/entities/conversation`
  - Workflow symbols → `@sba/entities/workflow`
  - Document symbols → `@sba/entities/document`
  - User symbols → `@sba/entities/user`
  - Shared VO/helpers → `@sba/entities/shared`
- Heuristik mapping:
  - Per simbol impor (identifier), petakan ke subpath modul sumber (mis. `ConversationStatus`, `ConversationTurn` → conversation; `WorkflowInstance` → workflow; `DocumentStatus` → document; `UserAggregate` → user; `EmailSchema` → shared).
  - Jika satu file memakai banyak modul, pecah impor menjadi beberapa baris subpath (hindari fallback root agar tetap tree-shakable).
- Implementasi: sediakan util codemod non-destruktif (mis. berbasis AST swc/jscodeshift) dengan dry‑run, diff output, dan mode apply.
- Verifikasi:
  - Jalankan lint + type-check untuk mendeteksi impor yang terlewat.
  - Blokir pola `@sba/entities/src/**` dan impor root tanpa subpath via lint rule/CI guard.

## Changesets & Versi
- Tambahkan Changesets di root monorepo:
  - Inisialisasi konfigurasi, tandai paket domain (`@sba/entities`) sebagai kandidat rilis internal.
  - Buat changeset setiap perubahan API surface (penambahan/ubah ekspor, DTO/events, VO).
  - Gunakan semver: `minor` untuk penambahan backward‑compatible; `patch` untuk perbaikan; `major` jika ada breaking.
- Rentang versi workspace:
  - Ubah konsumen `@sba/entities` ke `workspace:^` (bukan `workspace:*`) agar kompatibel minor/patch dan memudahkan upgrade.
- Dokumentasi rilis internal: ringkas perubahan (entities, DTO/events) di CHANGELOG per paket.

## Adapter Contoh
- `apps/api`:
  - Tambahkan controller/service contoh yang menggunakan DTO: `toConversationDTO`, `toWorkflowInstanceDTO` untuk serialisasi keluar; validasi masuk dengan `UserSchema`/VO shared.
  - Struktur rekomendasi: `apps/api/src/adapters/{conversationAdapter.ts, workflowAdapter.ts}`.
  - Tunjukkan penggunaan events untuk audit (mis. `workflow.instance.started`).
- `apps/web`:
  - Tambahkan adapter view‑model: konversi `Conversation` domain → state UI, gunakan DTO untuk komunikasi jaringan.
  - Struktur rekomendasi: `apps/web/src/entities/_adapters/{conversation.ts, workflow.ts}`.
- Sertakan README ringkas di masing‑masing app dengan contoh impor subpath, pemakaian DTO/events, dan pedoman validasi boundary.

## Penyelesaian Migrasi
- Menyisir `apps/*` dan `packages/*` untuk semua impor `@sba/entities`:
  - Terapkan codemod, pisahkan impor per subpath.
  - Pastikan semua alias TS root menunjuk `dist` subpath: `@sba/entities/{tenant,user,conversation,workflow,document,shared}` di `/tsconfig.json`.
  - Perbarui konsumen services (sudah diarah ke subpath) dan lanjutkan ke seluruh apps.
- Konsistensi impor:
  - Lint rule `no-restricted-imports` untuk mencegah `@sba/entities/src/**` dan, opsional, melarang root `@sba/entities` di `apps/*` jika terdeteksi hanya satu modul dipakai.
  - CI guard tambahan untuk mendeteksi pelanggaran saat PR.
- Workspace deps:
  - Audit `package.json` konsumen agar memakai `workspace:^` untuk `@sba/entities` dan dependensi domain terkait.

## QA End‑to‑End
- Jalankan `type-check` di seluruh workspaces.
- Jalankan lint (`eslint`) global; aktifkan aturan impor terlarang.
- Jalankan test suite:
  - Unit: `packages/*` (mis. `@sba/entities`, `@sba/services`).
  - Web/API: `apps/web` dan `apps/api` sesuai skrip proyek.
  - E2E: jalankan skenario kunci untuk chat/workflow.
- Observasi bundle size (opsional) untuk memverifikasi tree-shaking dari subpath.

## Kriteria Penerimaan
- 100% impor `@sba/entities` di `apps/*` menggunakan subpath resmi; tidak ada `src/**` atau root yang tidak perlu.
- Type‑check dan lint lulus tanpa error; CI guard tidak mendeteksi pelanggaran impor.
- Adapter contoh di API & Web berfungsi: serialisasi DTO dan validasi events/VO ditunjukkan.
- Changesets aktif; konsumen `@sba/entities` memakai `workspace:^`.

## Risiko & Mitigasi
- Ambiguitas simbol → subpath: gunakan AST untuk pemetaan akurat; review manual untuk kasus kompleks.
- Perbedaan serialisasi `Date`: gunakan DTO yang menormalisasi ke ISO string; validasi dengan `zod` di boundary.
- Potensi regresi UI/API: jalankan test penuh dan audit lint/ts strict.

## Referensi Teknis
- Public API `@sba/entities`: `/packages/entities/src/index.ts:1–9`.
- Conversation DTO/Events: `/packages/entities/src/conversation/{dto.ts,events.ts}`.
- Workflow DTO/Events: `/packages/entities/src/workflow/{dto.ts,events.ts}`.
- Shared VO: `/packages/entities/src/shared/value-objects.ts`.
- TS alias root: `/tsconfig.json`.

Jika disetujui, saya akan mengeksekusi codemod, menyiapkan Changesets, membuat adapter contoh di API/Web, menyelesaikan migrasi impor di seluruh apps, dan menjalankan QA end‑to‑end hingga semua kriteria penerimaan terpenuhi.