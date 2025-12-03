# Penguatan UI/UX Apps Marketing untuk SBA Agentic

## Ikhtisar
Apps Marketing ditingkatkan dengan konsistensi UI/UX, aksesibilitas, integrasi AG‑UI untuk intents berbasis event, serta rendering konten berbasis BaseHub melalui PageBuilder. Perubahan menjaga skalabilitas, keamanan, dan kemudahan perawatan.

## Arsitektur
- Layout: `apps/marketing/app/layout.tsx` kini membungkus konten dengan `WebSocketProvider` dan `AGEventsProvider` dari `@sba/ui/agui`.
- Home: `apps/marketing/app/page.tsx` merender blok CMS via `PageBuilder` (`src/features/page-builder/ui/page-builder.tsx`) dengan fallback hero statis.
- CTA: konsolidasi di `src/shared/ui/sections/CTABanner.tsx` dan penyesuaian `src/features/cta-banner/ui/cta-banner.tsx` untuk telemetry + intents.
- Form: `src/features/communication/ui/ContactForm.tsx` memancarkan intent pada submit sukses, mempertahankan `aria-live` dan fokus error.
- Navigasi: `src/shared/ui/navigation/SiteHeader.tsx` menambahkan skip‑link, focus ring, dan `aria-current` pada link aktif.

## Desain & Aksesibilitas
- Pola navigasi intuitif, skip‑link “Lewati ke konten”, focus ring konsisten (`focus:ring-violet-600`).
- Tipografi dan warna mengikuti design tokens Tailwind di `app/(marketing)/globals.css`.
- Landmarks (`role="main"`), heading order, dan feedback form `aria-live` dipertahankan.

## Integrasi AG‑UI
- Provider global: `WebSocketProvider` + `AGEventsProvider`.
- Intents:
  - CTA: `ui:button:click` dengan payload `{ href, label }`.
  - Form: `ui:form:submit` dengan payload `{ section: "contact", name, email }`.
- Error handling: intents dibungkus pemanggilan aman di UI; koneksi auto‑reconnect.

## Diagram Context Providers & Lifecycle (Ringkas)
- Providers:
  - WebSocketProvider (marketing layout) → AGEventsProvider → komponen (CTA/Hero/Form/Insight)
  - AGUIProvider (app) → SSE client (fallback ke WS) → store AG‑UI → AGUIDashboard/AGUIEventStream
- Lifecycle:
  1. UI memancarkan intent (CTA/Form) → AG‑UI channel.
  2. Telemetry dikirim ke `/api/analytics/telemetry` → store in‑memory + SQLite.
  3. Dashboard/Insight memanggil `/api/analytics/insights?windowMs&page&label` untuk agregasi time‑window.
  4. SSE terhubung; bila error → fallback WS; indikator koneksi, retry dan heartbeat ditampilkan.

## Panduan QA/E2E
- Aksesibilitas:
  - Dialog: verifikasi `role="dialog"`, `aria-modal`, focus trap, tombol close keyboard.
  - Event stream: container `role="feed"`, `aria-live`, item `role="article"` fokusable.
  - Forms: `aria-invalid`, `aria-describedby`, `aria-live` feedback, urutan fokus.
- Kinerja:
  - Virtualisasi event stream (window + spacers) untuk performa daftar besar.
  - Telemetry persist dengan SQLite; insight polling setiap 5 detik.
- E2E Examples:
  - `apps/app/e2e/agagentdialog-real.spec.ts`
  - `apps/app/e2e/eventstream-real.spec.ts`
  - `apps/app/e2e/eventstream-search.spec.ts`
  - `apps/marketing/e2e/contactform-a11y.spec.ts`
  - `apps/marketing/e2e/newsletter-dialog-a11y.spec.ts`

### Cara Menjalankan Test Per Aplikasi
- Marketing:
  - Jalankan dev server: `npm run dev -w apps/marketing -- --port 3011`
  - E2E: `npm run test:e2e -w apps/marketing`
- App:
  - Jalankan dev server: `npm run dev -w apps/app`
  - E2E: `npm run test:e2e -w apps/app`

### Checklist ARIA/Focus per Komponen
- Dialog:
  - `role="dialog"`, `aria-modal="true"`, focus trap, tombol close keyboard (`Enter`/`Escape`).
- Event List:
  - Container `role="feed"`, `aria-live="polite"`, item `role="article"` dan `tabindex="0"`.
  - Input filter berlabel (`aria-label`), hasil bisa difokuskan via keyboard.
- Forms:
  - `aria-invalid` saat error, `aria-describedby` menunjuk bantuan/error, `aria-live` untuk status.

## Integrasi BaseHub
- `getMarketingPage('home')` → render blok terverifikasi sesuai `src/entities/validators.ts`.
- Webhook: rute `app/api/webhooks/basehub/route.ts` tetap memanggil controller verifikasi HMAC dan `revalidateTag`.
- Metadata: `generatePageMetadata` menjaga canonical.

## Langkah Implementasi
1. Layout: tambahkan provider AG‑UI dan `id="main"` pada `<main>`.
2. Home: alihkan ke PageBuilder; simpan fallback hero.
3. CTA: satukan telemetry (`trackEvent`) dan intents AG‑UI.
4. Form: tambahkan intent pada submit sukses.
5. Navigasi: perkuat aksesibilitas dengan skip‑link, focus ring, dan `aria-current`.

## Pengujian
- SSR: mutakhirkan test CTA dan Contact untuk kompatibilitas intents AG‑UI; home SSR memverifikasi render konten utama.
- E2E/A11y: gunakan Playwright + axe di contact/home untuk WCAG AA.

## Panduan Penggunaan
- Env: `BASEHUB_TOKEN`, `BASEHUB_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`, opsional `NEXT_PUBLIC_AGUI_WS_URL`.
- Menambah blok CMS: definisikan di BaseHub sesuai skema, PageBuilder akan merender otomatis.
- Menambah intent baru: gunakan `useAGEvents().emitEvent(type, payload)` di komponen yang relevan.

## Kinerja & Skalabilitas
- ISR + webhook menjaga update konten efisien.
- Event‑stream AG‑UI dengan retry/backoff; UI intents di‑debounce pada klien bila diperlukan.

## Performa & Rekomendasi CLS/LCP (Konkret)
- Gambar
  - Pastikan atribut `width` dan `height` terdefinisi untuk menghindari layout shift.
  - Contoh:
    ```html
    <img src="/hero.webp" alt="Hero" width="1200" height="600" loading="lazy" />
    ```
- Fonts
  - Gunakan `font-display: swap` dan preload font kritis.
  - Contoh:
    ```html
    <link rel="preload" href="/fonts/Inter-Var.woff2" as="font" type="font/woff2" crossOrigin="anonymous">
    <style>@font-face{font-family:Inter;src:url('/fonts/Inter-Var.woff2') format('woff2');font-display:swap;}</style>
    ```
- Embed
  - Bungkus iframe/video dalam container ber-aspect-ratio untuk mencegah shift.
  - Contoh:
    ```html
    <div style="position:relative;padding-top:56.25%">
      <iframe src="https://www.youtube.com/embed/..." style="position:absolute;top:0;left:0;width:100%;height:100%" allowfullscreen></iframe>
    </div>
    ```
- Skeleton & Lazy Rendering
  - Gunakan skeleton untuk blok besar (sudah diterapkan di PageBuilder) dan pertimbangkan lazy load untuk blok non‑above‑the‑fold.

## Catatan Keamanan
- Tidak ada rahasia dibundel ke klien; gunakan variabel lingkungan.

## Selanjutnya
- Tambah skenario e2e untuk hero intents dan panel agent.
- Kembangkan dashboard insight analitik marketing berdasarkan event telemetry.
