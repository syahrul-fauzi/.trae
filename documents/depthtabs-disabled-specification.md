# DepthTabs Disabled State Specification

## Overview
Spesifikasi ini mendefinisikan implementasi disabled state untuk komponen DepthTabs yang digunakan pada umbrella page untuk pemilihan diagram depth (L0/L1/L2).

## Komponen Saat Ini
DepthTabs saat ini diimplementasikan sebagai link anchor (`<a>`) dengan role="tab" pada file:
- `/apps/docs/app/[locale]/diagrams/umbrella/page.tsx`

## Spesifikasi Disabled State

### 1. Kondisi Disabled
Tab depth akan dalam keadaan disabled ketika:
- Tidak ada diagram yang tersedia untuk depth tersebut
- User tidak memiliki permission untuk mengakses depth tertentu
- Sedang dalam proses loading data
- Depth tidak valid dalam konteks tertentu

### 2. Visual Indicators untuk Disabled State
```tsx
// Styling untuk tab disabled
const disabledClasses = "opacity-50 cursor-not-allowed pointer-events-none bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600"
const normalClasses = "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
const selectedClasses = "bg-blue-600 text-white"
```

### 3. A11y Requirements untuk Disabled State
- `aria-disabled="true"` pada elemen tab
- `tabIndex={-1}` untuk menghindari fokus keyboard
- `role="tab"` tetap dipertahankan untuk screen readers
- Text alternative yang jelas: "Depth L1 (not available)"

### 4. Behavior Interaksi
- **Mouse**: Tidak ada hover effect, cursor menjadi not-allowed
- **Keyboard**: Tab disabled tidak bisa difokuskan dengan Tab key
- **Screen Reader**: Mengumumkan "Depth L1, tab, disabled, not available"
- **Touch**: Tidak ada response pada sentuhan

### 5. Implementasi Kode
```tsx
<a
  key={d}
  href={isDisabled ? undefined : href}
  role="tab"
  aria-selected={selected}
  aria-disabled={isDisabled}
  tabIndex={isDisabled ? -1 : selected ? 0 : -1}
  className={`px-3 py-1 rounded focus:outline-none ${
    isDisabled 
      ? 'opacity-50 cursor-not-allowed pointer-events-none bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
      : selected 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
  }`}
  aria-label={`Depth ${d}${isDisabled ? ' (not available)' : ''}`}
>
  {d}
</a>
```

## Unit Test Checklist

### 1. Rendering Tests
- [ ] Tab disabled dirender dengan class yang benar
- [ ] Tab disabled memiliki aria-disabled="true"
- [ ] Tab disabled memiliki tabIndex={-1}
- [ ] Tab normal tidak memiliki attribute disabled

### 2. Interaksi Tests
- [ ] Klik pada tab disabled tidak mengubah URL
- [ ] Klik pada tab disabled tidak memicu event handler
- [ ] Hover pada tab disabled tidak mengubah styling
- [ ] Tab disabled tidak bisa difokuskan dengan keyboard

### 3. State Management Tests
- [ ] Tab disabled tetap render saat depth tidak tersedia
- [ ] Tab disabled update menjadi enabled ketika data tersedia
- [ ] Tab enabled menjadi disabled ketika permission berubah

## A11y Checklist

### 1. Keyboard Navigation
- [ ] Tab disabled tidak termasuk dalam tab order
- [ ] Arrow key navigation skip tab disabled
- [ ] Focus management tetap konsisten

### 2. Screen Reader Support
- [ ] aria-disabled diumumkan dengan benar
- [ ] aria-label memberikan konteks yang jelas
- [ ] Role tab tetap dikenali
- [ ] State changes diumumkan (jika ada)

### 3. Visual Indicators
- [ ] Kontras warna memenuhi WCAG 2.1 AA
- [ ] Visual disabled state jelas terlihat
- [ ] Tidak bergantung pada warna saja
- [ ] Dark mode support

### 4. Touch/Pointer Events
- [ ] Touch target cukup besar (minimal 44x44px)
- [ ] Tidak ada response yang menyesatkan pada sentuhan
- [ ] Cursor indicator yang tepat

## Integration dengan Umbrella Page

### 1. Data Availability Check
```tsx
const availableDepths = new Set(SOURCES.map(s => s.depth))
const isDisabled = !availableDepths.has(d)
```

### 2. Permission Check (Future)
```tsx
const hasPermission = usePermission(`diagram:depth:${d}`)
const isDisabled = !availableDepths.has(d) || !hasPermission
```

### 3. Loading State (Future)
```tsx
const [isLoading, setIsLoading] = useState(false)
const isDisabled = isLoading || !availableDepths.has(d)
```

## Testing Strategy

### 1. Unit Tests (Jest + React Testing Library)
- Test rendering dan attribute
- Test user interactions
- Test state changes
- Test accessibility attributes

### 2. E2E Tests (Playwright)
- Test keyboard navigation flow
- Test screen reader behavior
- Test visual regression
- Test integration dengan umbrella page

### 3. A11y Testing
- Automated testing dengan axe-core
- Manual testing dengan screen reader
- Keyboard-only navigation testing
- Color contrast validation

## Future Enhancements

1. **Tooltip untuk Disabled Reason**: Menampilkan alasan mengapa tab disabled
2. **Smooth Transitions**: Animasi saat tab mengubah state
3. **Loading Skeleton**: Placeholder saat memuat data depth
4. **Permission-based Rendering**: Hide vs disable berdasarkan permission level