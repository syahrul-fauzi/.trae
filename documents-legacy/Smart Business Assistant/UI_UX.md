UI/UX — Design System & Pola Interaksi

- Design System: Atomic (tokens, atoms, molecules, organisms, templates)
- Aksesibilitas: WCAG 2.1 AA, keyboard nav, ARIA, kontras
- Responsif: mobile-first, layout adaptif, grid
- Theming: per-tenant via CSS variables + ThemeProvider

Pola Utama
- Streaming Chat: progressive tokens, skeleton untuk tool calls
- Human-in-the-Loop: interrupt, konfirmasi untuk aksi berdampak
- Tool Execution: feedback visual, status, retry/fallback
- Tenant Switcher: isolasi jelas, indikator workspace

Komponen Kunci
- Atoms: Button, Input, Badge, Avatar, Spinner
- Molecules: InputGroup, ChatBubble, ModalHeader
- Organisms: ChatWindow, DocumentEditor, TenantSwitcher
- Templates: AppLayout, DashboardTemplate
 
User Flow Utama (Prototype)
- Onboarding → Workspace/Tenant Switcher → Chat Streaming → Document Generate → Review → Download/Store
- Error/Interrupt → Human‑in‑the‑Loop → Retry/Fallback → Resume Flow

UAT Checklist
- Navigasi keyboard dapat menjangkau seluruh kontrol penting
- Kontras warna memenuhi WCAG 2.1 AA
- Komponen interaktif memiliki peran & label ARIA yang sesuai
- Responsif pada viewport 360/768/1024/1440
- E2E Playwright hijau pada alur utama (Chat, Document, Tenant)
- Axe violations = 0 pada halaman kunci

Pola ARIA & Keyboard (Diterapkan)
- Toggle Button: gunakan `aria-pressed` untuk status (contoh: mic recording di ChatInput)
- Expandable Navigation: `role="button"`, `tabIndex=0`, `aria-expanded`, `aria-controls`, dukungan Enter/Space (Sidebar App)
- Dropdown Actions: setiap item diberi `aria-label`; non-modal saat testing jsdom untuk query stabil
- Live Regions: status streaming/typing menggunakan `role="status"` + `aria-live="polite"`
- Ikon-only Buttons: definisikan `aria-label` yang deskriptif di semua tombol actions (Star/Share/Export/New conversation)
- Scroll Controls: tombol “Go to latest” dengan `aria-label` konsisten; container `main` mendukung scroll keyboard (Home/End/PageDown)
