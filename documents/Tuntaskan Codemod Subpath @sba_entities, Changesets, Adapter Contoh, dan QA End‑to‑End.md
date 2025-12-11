## Sasaran
- Menyelesaikan migrasi impor ke subpath `@sba/entities/*` di seluruh `apps/*` secara menyeluruh.
- Mengaktifkan Changesets dan menerapkan `workspace:^` untuk semua konsumen `@sba/entities`.
- Menambahkan adapter contoh di API & Web yang menunjukkan penggunaan DTO/events dan validasi di boundary.
- Memperbaiki strict type issues dan menuntaskan QA (type-check, lint, test end‑to‑end) tanpa regresi.

## 1) Codemod Menyeluruh di apps/*
- Cakupan file: semua `*.ts, *.tsx` di `apps/*` (khusus `apps/web`, `apps/api`, `apps/marketing`, `apps/app`).
- Strategi:
  - Gunakan util codemod AST (basis file: `tools/codemods/entities-subpath-codemod.ts`) untuk memecah impor root `@sba/entities` menjadi subpath sesuai simbol.
  - Heuristik pemetaan simbol → subpath:
    - Conversation: `Conversation`, `ConversationStatus`, `ConversationTurn`, `ToolCall`, `ToolResult`, `TurnMetadata` → `@sba/entities/conversation`
    - Workflow: `Workflow`, `WorkflowInstance`, `WorkflowStatus`, `InstanceStatus` → `@sba/entities/workflow`
    - Document: `Document`, `DocumentStatus`, `DocumentType` → `@sba/entities/document`
    - User: `User`, `UserAggregate`, `UserStatus`, `UserRole`, `UserPreferences`, `UserProfile` → `@sba/entities/user`
    - Shared VO: `EmailSchema`, `UuidSchema`, `AuditInfo` → `@sba/entities/shared`
  - Pisahkan impor multi-simbol menjadi beberapa statement sesuai subpath.
- Verifikasi:
  - Jalankan grep untuk memastikan tidak ada `from '@sba/entities'` tersisa.
  - Lint rule: aktifkan `no-restricted-imports` untuk melarang `@sba/entities/src/**` dan impor root tanpa subpath di `apps/*`.
  - Type-check per app untuk deteksi sisa impor yang salah.
- Dokumentasi perubahan: buat ringkasan file yang dimodifikasi per aplikasi dan prinsip pemetaan simbol.

## 2) Changesets & Rentang Workspace
- Inisialisasi Changesets di root monorepo.
- Buat changeset untuk perubahan API surface `@sba/entities` (penambahan subpath exports, DTO/events, shared VO publik).
- Terapkan SemVer internal:
  - `minor`: penambahan DTO/events/VO
  - `patch`: perbaikan tipe/bug
  - `major`: perubahan breaking (tidak direncanakan saat ini)
- Ubah dependency konsumen `@sba/entities` dari `workspace:*` → `workspace:^` di `apps/*` dan `packages/*` agar kompatibel minor/patch.
- Pastikan kompatibilitas antar workspace melalui type-check lintas monorepo.

## 3) Adapter Contoh API & Web
- API (`apps/api`):
  - Tambahkan `src/adapters/conversationAdapter.ts` dan `src/adapters/workflowAdapter.ts` yang:
    - Validasi payload masuk menggunakan VO/`UserSchema` (`packages/entities/src/user/user.entity.ts:47–71`).
    - Serialisasi keluar memakai DTO (`packages/entities/src/conversation/dto.ts:33–51`, `packages/entities/src/workflow/dto.ts:31–52`).
    - Emit events (`packages/entities/src/conversation/events.ts`, `packages/entities/src/workflow/events.ts`) untuk audit/telemetri.
  - Dokumentasi singkat di `apps/api/README.md` tentang impor subpath dan alur validasi/serialisasi.
- Web (`apps/web`):
  - Lengkapi adapter view-model di `src/entities/_adapters/conversation.ts` agar konsumsi `Conversation` domain → state UI; gunakan DTO untuk komunikasi jaringan.
  - Dokumentasi di `apps/web/README.md` tentang penggunaan subpath, DTO, dan pola adapter.

## 4) Perbaikan Strict Type & QA End‑to‑End
- Identifikasi dan perbaiki masalah tipe yang terdeteksi pada type-check `apps/web`:
  - Shared VO konversi: `convertFileSize` dan `convertDuration` tambahkan guard indeks dan non-null assertions terkontrol agar sesuai `exactOptionalPropertyTypes` dan `noUncheckedIndexedAccess`.
  - DTO strictness: pastikan properti opsional (`toolCalls?`, `result?`, `error?`, dsb.) tidak dipaksa wajib dalam return literal; sesuaikan tipe agar kompatibel dengan penggunaan di web.
- Konsistensi alias TS:
  - Pastikan `apps/web/tsconfig.json` berisi alias `@sba/entities/*` → `../../packages/entities/dist/*` dan tidak ada rujukan ke `src/`.
- QA berlapis:
  - Type-check seluruh workspaces: `apps/*`, `packages/*`.
  - Lint global dengan aturan impor terlarang.
  - Jalankan unit/integration/e2e test sesuai skrip masing-masing app; fokus fitur chat/workflow.
  - Buat laporan QA komprehensif: daftar perubahan, hasil type-check, lint, test, dan temuan.

## Keluaran yang Diharapkan
- 100% impor `@sba/entities` di `apps/*` memakai subpath resmi; tidak ada `src/**`.
- Changesets aktif dan rentang `workspace:^` diterapkan untuk konsumen internal.
- Adapter contoh tersedia dengan dokumentasi; validasi/serialisasi menggunakan VO/DTO/events.
- Type-check, lint, dan test lintas workspace lulus; tidak ada regresi.

## Risiko & Mitigasi
- Ambiguitas simbol → subpath: gunakan AST dan review manual untuk kasus campur modul.
- Serialisasi `Date` dan optional fields: normalisasi DTO ke ISO-string dan sifat opsional secara konsisten.
- Potensi efek lint/ts ketat di web: prioritaskan perbaikan tipe pada shared VO/DTO yang digunakan luas.

Silakan konfirmasi. Setelah disetujui, saya akan mengeksekusi codemod, menambahkan Changesets, membuat adapter contoh, memperbaiki strict type issues, dan menyelesaikan QA end‑to‑end secara terstruktur.