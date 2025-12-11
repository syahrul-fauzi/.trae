## Tujuan
- Menulis dokumentasi lengkap di `packages/ui/docs/components.md` untuk theming multi‑tenant menggunakan `ThemeProvider`, CSS variables, dan helper API.
- Menyediakan contoh kode siap pakai (copy‑paste) dan best practices/pola umum.
- Menangani a11y: opsi melonggarkan lint rules pada stories/tests atau memperbaiki kasus (terutama `anchor-valid`) beserta trade‑off.

## Referensi Kode (API Sumber)
- Ekspor tema: `packages/ui/src/index.ts:27–35` (ThemeProvider, useTheme, getThemeClass, getCSSVariable, defaultDesignTokens)
- Subpath exports tema: `packages/ui/package.json:83–87` (`./theme`)
- Implementasi tema: `packages/ui/src/theme/ThemeProvider.tsx`, `packages/ui/src/theme/useTheme.ts`, `packages/ui/src/theme/getThemeClass.ts`, `packages/ui/src/theme/getCSSVariable.ts`, `packages/ui/src/theme/designTokens.ts`

## Struktur Dokumen Komponen (Isi yang Akan Ditambahkan)
1) **Pendahuluan Theming Multi‑Tenant**
- Konsep tenant → tema berbeda per pelanggan/brand
- Arsitektur: tokens → CSS variables → ThemeProvider → komponen

2) **ThemeProvider**
- Ringkas API dan props yang didukung; cara wrap di aplikasi
- SSR/hydration catatan singkat
- Contoh integrasi global di root app dengan tenant id

3) **CSS Variables**
- Cara mendeklarasikan dan mengonsumsi variables di komponen/react
- Mapping tokens ke variables (colors/spacing/typography)

4) **Helper API (Copy‑Paste)**
- `getThemeClass` untuk penetapan kelas per‑tenant
- `getCSSVariable` untuk membaca/override variables
- Contoh cepat: Quick Start, Advanced runtime switcher, Persisted theme

5) **Best Practices & Pola Umum**
- Pemisahan tokens vs komponen; guard nilai; kontrast warna; tidak membocorkan rahasia; namespace CSS
- Pola: Layout wrapper, withTenant HOC, page‑level theme, component‑level override

6) **Edge Cases**
- SSR mismatch (hydratation), tenant header hilang, key tokens invalid, merge override konflik

7) **A11y Strategy**
- Opsi A (relaksasi lint): override rules khusus pada `*.stories.tsx`/`*.spec.tsx` (mis. `jsx-a11y/anchor-is-valid`)
- Opsi B (perbaikan): ubah `a` tanpa href menjadi `button` atau beri href valid, fokus states, ARIA label
- Trade‑off: kecepatan dev vs kualitas aksesibilitas produksi; rekomendasi default: perbaiki masalah di stories utama

## Contoh Kode (Disertakan di Dokumen)
- **Global Setup (ThemeProvider)**
```tsx
// app/providers.tsx
import { ThemeProvider } from '@sba/ui/theme'

export function AppProviders({ children, tenantId }: { children: React.ReactNode; tenantId: string }) {
  return (
    <ThemeProvider tenantId={tenantId} initialTheme="default">
      {children}
    </ThemeProvider>
  )
}
```

- **CSS Variables (Deklarasi & Pemakaian)**
```css
/* globals.css */
:root {
  --color-primary-500: #0ea5e9;
  --radius-md: 8px;
}
[data-tenant="enterprise"] {
  --color-primary-500: #7c3aed;
}
```
```tsx
// Button.tsx
export function Button({ children, className, ...props }) {
  return (
    <button
      className={`rounded-[var(--radius-md)] bg-[var(--color-primary-500)] text-white px-3 py-2 ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

- **getThemeClass / getCSSVariable**
```tsx
import { getThemeClass, getCSSVariable } from '@sba/ui/theme'

const themeClass = getThemeClass('enterprise')
const primary = getCSSVariable('--color-primary-500') // "#7c3aed" jika tenant enterprise

<div className={themeClass}>Hello</div>
```

- **Runtime Switcher (Tenant Toggle)**
```tsx
import { useTheme } from '@sba/ui/theme'

export function TenantSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <select value={theme} onChange={e => setTheme(e.target.value)}>
      <option value="default">Default</option>
      <option value="enterprise">Enterprise</option>
      <option value="startup">Startup</option>
    </select>
  )
}
```

- **A11y (Perbaikan anchor‑valid di Storybook)**
```tsx
// Bad: <a onClick={...}> tanpa href
// Good:
<button type="button" onClick={onClick} aria-label="Open settings">Settings</button>
// Atau beri href valid:
<a href="/settings" onClick={onClick}>Settings</a>
```

- **A11y (Override lint khusus stories/tests)**
```json
// .eslintrc.cjs override
module.exports = {
  overrides: [
    {
      files: ['**/*.stories.@(ts|tsx)', '**/*.spec.@(ts|tsx)'],
      rules: { 'jsx-a11y/anchor-is-valid': 'off' }
    }
  ]
}
```

## Langkah Implementasi
1. Tambahkan bagian baru di `packages/ui/docs/components.md` sesuai struktur di atas.
2. Sisipkan blok kode copy‑paste (Quick Start, CSS variables, runtime switcher, helper usage).
3. Tambahkan subsection A11y: opsi relaksasi lint dan opsi perbaikan dengan contoh.
4. Review konsistensi bahasa/struktur; tambahkan catatan visual (refer ke Storybook stories).
5. Opsional: buat contoh Storybook yang menampilkan perbandingan tenant untuk visualisasi.

## Kriteria Selesai
- Dokumen jelas, terstruktur, dan mencakup skenario umum/edge cases.
- Contoh kode berjalan dengan API yang diekspor (`index.ts:27–35`).
- A11y strategi dijelaskan beserta trade‑off; anchor‑valid ditangani via contoh/peraturan.
