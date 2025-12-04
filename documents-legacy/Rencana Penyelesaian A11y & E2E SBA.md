## Tujuan
- Menutup seluruh gap aksesibilitas (ARIA, keyboard nav, icon-only labels) dan melengkapi pengujian E2E (Chat/Document/Tenant) hingga siap sign‑off deployment.

## Ruang Lingkup
- Apps Web: ChatPage, DashboardLayout, ChatWindow, ConversationList, ChatInput, ChatMessage.
- Apps App: AGUIEventStream (done sebagian), AGUIAgentList, Sidebar, NavigationHeader.
- QA: Lint a11y, unit/integration/e2e + axe, acceptance report.

## Perbaikan Aksesibilitas
- Tambahkan aria-label pada seluruh tombol icon-only:
  - `apps/web/src/app/ChatPage.tsx`: Menu mobile (aria-label + aria-expanded), New conversation.
  - `apps/web/src/widgets/DashboardLayout.tsx`: Close/Open sidebar, Notifications, Theme toggle (aria-pressed), Sign out.
  - `apps/web/src/features/chat/components/ChatWindow.tsx`: Edit title, Star/Share/Export/More.
  - `apps/web/src/features/chat/components/ConversationList.tsx`: New conversation.
  - `apps/web/src/features/chat/components/ChatInput.tsx`: Attach file, Start/Stop recording (aria-label dinamis + aria-pressed).
  - `apps/app/src/features/agui/ui/AGUIAgentList.tsx`: Start/Stop agent (aria-label dinamis), Open settings.
- Expand/Collapse keyboard & ARIA:
  - `apps/app/src/widgets/ui/Sidebar.tsx`: gunakan `<button>` untuk submenu atau tambahkan `role="button"`, `tabIndex`, `aria-expanded`, `aria-controls`, Enter/Space handler.
  - Pastikan ChatMessage (done sebagian) memakai `aria-expanded`/`aria-controls` + keyboard handler.

## Penguatan Lint A11y
- Tambahkan `eslint-plugin-jsx-a11y` di `apps/web/package.json` (devDependencies) agar aturan `.eslintrc.js` aktif penuh.
- Jalankan `next lint` dan perbaiki temuan.

## Pengujian
- Unit/Integration:
  - Tambah test untuk icon-only labels (render + getByRole("button", { name }) pada komponen yang diubah).
  - Tambah test keyboard nav pada `Sidebar` (Enter/Space toggle) dan `ChatMessage`.
- E2E Playwright + axe:
  - Chat: kirim pesan → streaming; expand/collapse via keyboard; copy & feedback; axe pass.
  - Tenant: list/get/update dengan RBAC; UI switcher; isolasi; axe pass.
  - Document: pilih template → generate artifact; status job; retry; axe pass.

## Acceptance & Dokumentasi
- Finalisasi `Smart Business Assistant/Acceptance.md` dengan hasil pengujian (lint, unit, integration, e2e + axe) dan metrik (LCP, respons, viewport).
- Perbarui UI/UX handbook dan CONTRIBUTING bila ada konvensi baru (icon-only, expand/collapse patterns).

## Verifikasi & Kriteria Lulus
- Lint a11y: zero critical.
- E2E axe: nol pelanggaran WCAG 2A/2AA pada halaman inti.
- Responsivitas: 360/768/1024/1440 tanpa overflow kritis.
- Performa: LCP < 2.5s, respons utama < 200ms (cached/idle).

## Delivery
- Patch terarah per file (Web/App) untuk ARIA & keyboard.
- Penambahan dependensi lint a11y di Web.
- Test suite (unit/integration/e2e) diperbarui.
- Laporan acceptance siap untuk sign‑off.

## Risiko & Mitigasi
- Potensi regressi UI: snapshot Storybook untuk komponen kunci.
- Hoisting dependensi lint: deklarasi eksplisit `eslint-plugin-jsx-a11y` di Web.
- Flakiness e2e: gunakan waits yang tepat dan data seeds terkontrol.

Konfirmasi rencana ini agar saya lanjut mengeksekusi patch, menambah pengujian, menjalankan lint/e2e + axe, dan menyerahkan laporan akhir kelulusan acceptance.