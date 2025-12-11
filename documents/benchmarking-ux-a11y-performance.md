# Benchmarking UX/A11y & Performa

## Aksesibilitas
- Gunakan baseline a11y tests di kedua platform (Playwright/Jest Axe).
- Audit fokus, ARIA, keyboard navigation di halaman dashboard & komponen kritis.

## Performa
- Kumpulkan LCP/INP halaman utama App & Web.
- Bandingkan render panel metrik Web vs App; optimalkan memori/paint.

## Konsistensi UI
- Audit penggunaan `@sba/ui` lintas platform dan konsistensi design tokens.

## Sampel Rujukan
- Web Dashboard A11y: `apps/web/src/features/dashboard/components/__tests__/MetricsOverview.test.tsx`
- App A11y: `apps/app/src/(authenticated)/layout.a11y.spec.tsx`
