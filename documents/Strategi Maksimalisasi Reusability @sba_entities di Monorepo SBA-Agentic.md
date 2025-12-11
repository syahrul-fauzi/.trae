## Tujuan
- Menjadikan `@sba/entities` sebagai Single Source of Truth (SSOT) domain lintas `apps/*`.
- Meningkatkan reusability, konsistensi arsitektur, dan mengurangi duplikasi.
- Menyelaraskan dengan kebutuhan domain SBA: multi-tenant, agentic workflow, permission, audit.

## Temuan Kondisi Saat Ini
- Workspaces: `apps/*`, `packages/*` (package.json:6–9 di /home/inbox/smart-ai/sba-agentic/package.json).
- Alias TS memetakan `@sba/entities` ke source (`tsconfig.json`:35–46 di /home/inbox/smart-ai/sba-agentic/tsconfig.json), sehingga konsumen mengimpor langsung file TS.
- Public API saat ini: tenant, conversation, document, workflow, user, team, analytics, chat-message (packages/entities/src/index.ts:1–8 di /home/inbox/smart-ai/sba-agentic/packages/entities/src/index.ts).
- `shared` sengaja tidak diekspor untuk menghindari duplikasi (komentar di index.ts baris 9).
- Konsumsi lintas apps: banyak impor `@sba/entities` di `apps/web` dan `packages/services` (hasil pencarian impor).

## Komponen Yang Dapat Di-share
- Conversation: `Conversation`, `ConversationStatus`, `ConversationTurn`, `ToolCall`, `ToolResult`, `TurnMetadata` (packages/entities/src/conversation/conversation.entity.ts:1–57).
- User: `UserSchema`, `User`, `UserAggregate` + value objects `UserId`, `Email`, `UserRole`, `UserStatus`, `UserPreferences`, `UserProfile` (packages/entities/src/user/user.entity.ts:4–71; 74–211; 213–234).
- Document: `Document`, `DocumentVersion`, `DocumentTemplate`, `DocumentContent` (packages/entities/src/document/document.entity.ts:1–82).
- Workflow: `Workflow`, `WorkflowDefinition`, `WorkflowInstance` (packages/entities/src/workflow/workflow.entity.ts:1–156).
- Shared value objects: `TenantScoped`, `BaseEntity` (dipakai melalui `@sba/utils`), plus rencana mempublikasikan `packages/entities/src/shared/*` sebagai VO umum.
- ChatMessage types: `ChatMessage`, `ChatToolCall`, `ChatToolResult` (packages/entities/src/index.ts:3).

## Pola Integrasi Optimal
- SSOT: semua tipe/skema domain berasal dari `@sba/entities`; dilarang mendefinisikan ulang tipe domain di `apps/*`.
- Adapter di boundary:
  - `apps/api`: controller/service memakai entities; mapping ke DB/ORM melalui repository di `packages/services` atau `packages/db`.
  - `apps/web`: UI memakai tipe domain untuk state; konversi dilakukan via adapter UI (contoh sudah ada di `apps/web/src/entities/_adapters/conversation.ts`).
  - `apps/jobs`: pipeline asinkron memakai DTO/event yang sama untuk konsistensi.
- Validasi di tepi dengan `zod` (UserSchema, VO) untuk payload masuk/keluar agar data konsisten.
- Hindari deep import: gunakan subpath resmi (`@sba/entities/user`, `@sba/entities/conversation`, dst.) untuk tree-shaking dan API stabil.

## Struktur Direktori & Mekanisme Impor
- Public API surface per modul:
  - `src/user/{user.entity.ts, index.ts}` ekspor `User`, `UserAggregate`, skema & VO.
  - `src/conversation/{conversation.entity.ts, index.ts}` ekspor tipe & status percakapan.
  - `src/workflow/{workflow.entity.ts, index.ts}` ekspor definisi & instance.
  - `src/document/{document.entity.ts, index.ts}` ekspor dokumen & versioning.
  - `src/shared/{value-objects.ts, index.ts}` ekspor VO umum (TenantId, Permission, RolePolicy, Audit types).
- `packages/entities/package.json` menambahkan `exports` subpath:
  - `@sba/entities`, `@sba/entities/user`, `@sba/entities/conversation`, `@sba/entities/workflow`, `@sba/entities/document`, `@sba/entities/shared`.
- Build ke `dist` (ESM + `.d.ts`); arahkan `main` dan `types` ke `dist/index.*`. Kurangi ketergantungan konsumen pada `src/*` untuk stabilitas.
- Update `tsconfig` root: hapus alias yang menunjuk ke `src/*` untuk `@sba/entities`; dorong impor paket melalui `exports`.

## Versioning & Dependency Management
- Tambahkan Changesets untuk semver internal meskipun package private; gunakan release tags untuk melacak perubahan API.
- Ubah dependency range workspace menjadi `workspace:^` pada konsumen `@sba/entities` agar minor/patch kompatibel dan menjaga constraints.
- Konsolidasikan `zod` versi tunggal di root agar tidak duplikasi versi.
- Tambah guard CI: blokir impor jalur `@sba/entities/src/**` di `apps/*` (mirip `scripts/ci/guard-*` yang sudah ada).

## Kebutuhan Domain SBA
- Multi-tenant: pastikan entity terkait pelanggan mengimplement `TenantScoped`; sediakan VO `TenantId` dan helper guard akses.
- Agentic workflow: standarisasi `ToolCall`, `ToolResult`, `TurnMetadata` agar payload agent tools seragam lintas apps.
- Permission & Policy: tambahkan VO `Permission`, `RolePolicy` memanfaatkan hirarki di `UserAggregate.canAccessResource` (packages/entities/src/user/user.entity.ts:109–119).
- Audit & Trace: konsistenkan bidang `createdBy`, `updatedBy`, timestamps pada semua entities (contoh User: packages/entities/src/user/user.entity.ts:64–69).

## Eksekusi Bertahap
1) Audit & tetapkan daftar subpath publik; inventaris impor konsumen di `apps/*` dan `packages/*`.
2) Normalisasi VO bersama: publikasikan `src/shared` dan aktifkan ekspor via root `index.ts`.
3) Tambah DTO & Event standar: `src/{conversation,workflow}/dto.ts`, `events.ts` untuk payload API ↔ Jobs ↔ Web.
4) Konfigurasi build & exports: generate `dist` (esm+dts), set `exports`, `main`, `types`; sesuaikan root `tsconfig` untuk konsumsi paket.
5) Guard integrasi: tambahkan lint/CI rules mencegah deep import, wajib pakai subpath.
6) Versioning: integrasi Changesets, semver internal; gunakan `workspace:^` pada konsumen.
7) Dokumentasi: README `@sba/entities` dengan pedoman impor, adapter boundary, contoh validasi `zod`.
8) Verifikasi: jalankan type-check dan test di `apps/web`, `apps/api`, `packages/services` untuk kompatibilitas.

## Kriteria Penerimaan
- Semua konsumen mengimpor via `@sba/entities` subpath, tanpa deep import `src/*`.
- Build menghasilkan `dist` yang digunakan di seluruh `apps/*`.
- DTO/events tersedia dan dipakai lintas proses.
- CI gagal bila ada pelanggaran (deep import/duplikasi tipe).

## Risiko & Mitigasi
- Risiko migrasi impor: mitigasi dengan codemod dan CI guard bertahap.
- Perbedaan tipe Date/JSON di boundary: validasi `zod` dan adapter serialisasi.
- Tree-shaking & bundling: verifikasi ESM `exports` dan subpath untuk ukuran bundle.

## Referensi Prinsip
- SSOT & aliran data searah; pemisahan fokus domain–UI–infra untuk menjaga testability dan skalabilitas.
- Praktik modular API: dokumentasi terstruktur, state manajemen efisien di frontend, otentikasi/CORS ditangani di layer apps, bukan entities.

Silakan konfirmasi untuk mengeksekusi langkah-langkah di atas (subpath exports, shared VO, DTO/events, build ke `dist`, guard CI, dan dokumentasi), lalu saya akan lakukan perubahan terarah dan memverifikasi di `apps/*`. 