## Sasaran Utama
- Terapkan FSD + DDD + Atomic secara konsisten di `apps/web` sambil menjaga kompatibilitas monorepo (Turbo, shared packages `@sba/*`).
- Naikkan kualitas: type-safety kuat, validasi boundary, coverage ≥80%, e2e stabil.
- Perkuat UI/UX: design system konsisten, performa dan aksesibilitas WCAG.
- Lengkapi dokumentasi teknis, kontrak API, dan alur CI/CD enterprise-ready.

## Konteks Saat Ini (Ringkas)
- Framework: Next.js App Router 14, React 18, Tailwind, React Query, Zod.
- Struktur sudah mendekati FSD: `features`, `widgets`, `shared`, `entities` (workspace), `processes` (masih kosong).
- Chat memanfaatkan Supabase melalui `apiClient` (mock saat CI) dan AG-UI placeholder.
- Testing: Vitest (unit/integration), Playwright (e2e) dengan threshold coverage terset (80%), beberapa tes aksesibilitas.
- Contoh kode kunci: AG-UI route `apps/web/src/app/api/agui/chat/route.ts:3`, API client `apps/web/src/shared/api/client.ts:123`, Chat hook `apps/web/src/features/chat/hooks/useChat.ts:11`.

## Arsitektur & Refactory
- Bentuk lapisan domain yang tegas (DDD):
  - Definisikan model domain murni untuk `Conversation`, `Message`, `Document` (Value Objects, Aggregates) di `src/entities/<domain>/model.ts` lokal app (dengan tipe kuat; tidak `any`).
  - Kontrak `Repository` per domain di `src/entities/<domain>/repository.ts` (interface) dan adapter infra Supabase di `src/shared/api/adapters/<domain>.ts` untuk mapping persistence→domain.
  - Validasi DTO boundary dengan Zod di `src/entities/<domain>/dto.ts` dan gunakan di UI/API.
- Pisahkan concerns fitur menggunakan FSD:
  - Standardisasi struktur tiap fitur: `features/<name>/{model,lib,ui,api}`; pindahkan hooks ke `model` (state) dan komponen ke `ui`.
  - Orkestrasi lintas-fitur di `src/processes` (aktifkan folder ini) untuk flow: Onboarding, Chat→Report, Knowledge→Template.
- Perketat type-safety:
  - Naikkan `tsconfig.json` ke `strict: true`, aktifkan `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, dan rapikan path alias.

## Domain & Kontrak
- Conversation
  - Value Objects: `ConversationId`, `Title`, `TenantId`, `UserId`.
  - Aggregate: `Conversation` berisi `Turns` (MessageId, role, content, metadata typed).
  - Repository: `findByTenant`, `get`, `create`, `update`, `delete` dengan hasil bertipe domain.
- Message
  - Value Objects: `MessageId`, `Role` (union), `Content`, `ToolCall` typed.
  - Repository: `listByConversation`, `create`, `stream`.
- Document
  - VO: `DocumentId`, `Slug`, `Source`, `Status`.
  - Repository: `listByTenant`, `get`, `create`, `update`, `delete`.
- Mapping & Validasi
  - Adapter Supabase: fungsi `toDomain`, `toPersistence` tiap entitas.
  - Zod schema untuk request/response API dan props UI; enforce di route dan hooks.

## Feature-Sliced Design (FSD)
- Chat
  - `features/chat/model`: state, mutations (React Query), selectors; rapikan `useChat` untuk gunakan repository dan schema (ganti operasi langsung ke `apiClient`).
  - `features/chat/ui`: `ChatInput`, `ChatMessage`, `ChatWindow`, dll; props bertipe domain.
  - `features/chat/api`: klien AG-UI, kontrak endpoint.
- Dashboard, Knowledge, Documents, Integrations
  - Terapkan struktur serupa: domain-driven model + ui, kurangi coupling ke bentuk tabel Supabase.
- Processes
  - Tambah proses `chat-to-report` (mengubah percakapan jadi laporan/insight terstruktur) dengan langkah orkestrasi dan error boundary.

## Atomic Design System
- Struktur ulang `src/shared/ui` menjadi `atoms`, `molecules`, `organisms`, `templates`; `widgets` tetap untuk komposisi halaman.
- Tokens & Theme
  - Gunakan CSS variables yang sudah ada di `tailwind.config.ts` sebagai design tokens; dokumentasikan palet, spacing, radius, shadow.
- Komponen
  - Atoms: Button, Input, Icon, Badge.
  - Molecules: Card, ListItem, Toast.
  - Organisms: ChatWindow, MetricsOverview, IntegrationHub.
  - Templates: DashboardLayout.
- Dokumentasi visual
  - Tambahkan Storybook untuk eksplorasi komponen dan uji aksesibilitas visual.

## API & Middleware
- AG-UI route (`apps/web/src/app/api/agui/chat/route.ts:3`)
  - Tambah validasi Zod untuk body dan response; keluarkan kode error yang jelas; logging terstruktur.
  - Definisikan `toolCalls` terketik; sertakan trace id, timing, dan `Server-Timing` header.
- Health & Telemetry
  - Pastikan `health` mengukur uptime, memory, rate-limit stats; perluas `metrics/route.ts` untuk histogram.
- Middleware keamanan
  - Pertahankan CSP ketat; audit `Report-To`; tambah `Permissions-Policy` dan hardening header.

## Quality & Testing
- Unit & Integration (Vitest)
  - Tambah tes untuk repository domain, adapter mapping, dan `useChat` yang telah direfaktor (mock repository)—target per-file ≥80%.
  - Aktifkan mocking `@sba/supabase` via shims agar deterministik.
- E2E (Playwright)
  - Tambah skenario utama: Chat→Report, Knowledge→Template, Documents CRUD, Integrations flow.
  - Gunakan data seeding/mock yang terisolasi; tagging per fitur.
- Coverage Gates
  - Perluas script gate selain WorkflowBuilder (saat ini ada gating 90%); set gates minimal 80% untuk fitur inti.
- Static Analysis
  - ESLint: aktifkan rules untuk a11y, hooks, complexity; jalankan di CI.

## UI/UX & Aksesibilitas
- Aksesibilitas
  - Pastikan semantik: heading hierarchy, landmark, aria-label, focus ring; tes di `features/**/__tests__`.
- Performa
  - Virtualisasi list pesan (Chat), memoization selektif, suspensi data (React Query), dan streaming; ukur dengan profiler.
- Konsistensi
  - Definisikan pola layout, spacing, dan interaksi; tambahkan guideline di dokumentasi.

## CI/CD & DevX
- Pipeline (Turbo + CI runner)
  - Steps: `lint` → `typecheck` → `test` (unit/integration) → `build` → `e2e` → `artifact`.
  - Cache via Turbo; matriks browser untuk e2e.
- Versioning & Rollback
  - Tag versi aplikasi; feature flags untuk AG-UI; rollback melalui toggle.
- Secrets & Security
  - Gunakan env injeksi aman; jangan log secrets; audit dependency.

## Dokumentasi & Operasional
- Technical Spec
  - Jelaskan arsitektur (FSD+DDD+Atomic), diagram dependensi, kontrak repository.
- API Docs
  - Kontrak `/api/agui/chat` (request/response, error codes), `health`, `telemetry`.
- Deployment Guide
  - Build, env, CSP, rate-limit, feature flags.
- Troubleshooting
  - Panduan umum: failure AG-UI fallback (sudah ada di `useChat.ts:198-214`), rate-limit hit, CSP violations.
- Changelog & Migration
  - Catat refactor yang mengubah path/import; beri langkah migrasi ringan.

## Pemetaan Perubahan (Contoh Konkret)
- Ganti interaksi langsung ke `apiClient` di `apps/web/src/features/chat/hooks/useChat.ts:47-114, 116-258` menjadi panggilan `ConversationRepository` dan `MessageRepository`.
- Validasi input body di `apps/web/src/app/api/agui/chat/route.ts:3-12` menggunakan Zod; tetapkan skema response typed.
- Tambah adapter Supabase untuk `Conversation` dan `Message` di `src/shared/api/adapters/*` yang memetakan field snake_case↔camelCase.
- Restruktur `src/shared/ui` ke layer Atomic dan sesuaikan import di komponen fitur.

## Kriteria Penerimaan
- Struktur FSD+DDD+Atomic diterapkan konsisten di fitur inti (Chat, Dashboard, Knowledge, Documents).
- Coverage unit/integration per-file ≥80%; e2e skenario utama lulus.
- TypeScript `strict: true` tanpa error di app; lint bersih.
- Aksesibilitas dasar (role/aria/labelling/focus) tervalidasi di tes.
- API contracts terdokumentasi dan diuji.

## Risiko & Mitigasi
- Risiko: Refactor memecah import.
  - Mitigasi: adapter kompatibilitas, alias paths stabil, changelog & migrasi.
- Risiko: Flakiness e2e.
  - Mitigasi: data seeding deterministik, stabilisasi wait-for, tagging.
- Risiko: Pengetatan TypeScript menghasilkan error sementara.
  - Mitigasi: jalankan bertahap per fitur; gunakan `// @ts-expect-error` sementara yang terlokalisir dan dihapus sebelum selesai.

## Output yang Akan Dihasilkan
- Kode refactor (repositories, adapters, schema) & penataan ulang folder.
- Tes unit/integration/e2e terbaru dengan gates coverage.
- Dokumen: Technical spec, API docs, deployment & troubleshooting, changelog/migration.

Mohon konfirmasi untuk mengeksekusi rencana di atas. Setelah disetujui, saya akan mulai dari domain `chat` (repositories + adapter + validasi AG-UI) dan melanjutkan ke fitur lain dengan verifikasi menyeluruh.