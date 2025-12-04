## Aksesibilitas & UX Principles (AGUI Event Stream)

- Reduced Motion: auto-scroll dinonaktifkan saat `prefers-reduced-motion: reduce` terdeteksi.
- Keyboard Shortcuts: `ArrowUp/ArrowDown/Home/End/PageUp/PageDown` pada container `role="feed"`.
- Live Regions: feed memakai `aria-live` dinamis (`polite` saat auto-scroll aktif, `off` saat nonaktif), `aria-relevant="additions"`, dan status koneksi di `role="status"`.
- Landmarks: viewport sebagai `role="region"` terasosiasi dengan judul melalui `aria-labelledby`.
- Go to latest: tombol muncul saat tidak dekat bawah; mengaktifkan kembali auto-scroll dan melompat ke event terbaru.
- Scroll focus affordance: `tabIndex=0` pada feed agar fokus keyboard dapat masuk tanpa jebakan fokus.

### Komponen UI Paket

- Subpath exports di `@sba/ui` untuk mendukung impor: `@sba/ui/card`, `@sba/ui/badge`, `@sba/ui/scroll-area`, `@sba/ui/button`.
- `ScrollArea` diekspor dari `atoms/ScrollArea/ScrollArea` untuk integrasi AGUI.

### Pengujian

- App tests memakai Vitest `jsdom` dengan `setupFiles` mengaktifkan `@testing-library/jest-dom`.
- E2E Playwright dipisah dari unit tests (`exclude: ['e2e/**']`), jalankan terpisah.
- Unit tests untuk AGUI Event Stream mencakup keyboard fokus dan skenario auto-scroll.

## ChatWindow (Web)

- Landmark: header `role="banner"`, pesan `role="main"`, input wrapper `role="form"`.
- Live Regions: Thinking… dan Assistant typing… diumumkan via `aria-live`; error memakai `role="alert"`.
- Semantik: pesan di `ol/li` dengan `role="list"`/`role="listitem"`.
- Keyboard: `ArrowUp/Down`, `Home/End`, `PageUp/PageDown`, dan shortcut `g` untuk "Go to latest"; didokumentasikan dengan `aria-keyshortcuts`.
- Auto-scroll: indikator status "Auto-scroll: On/Off" (live), toggle Enable/Disable, tombol "Go to latest" sticky hanya saat tidak dekat bawah; menghormati `prefers-reduced-motion`.

### Tools History sebagai Live Log
- Riwayat Tools di Chat ditampilkan sebagai dropdown dengan `role="log"` (label: "Tools history list") agar setiap hasil operasi (Render/Task) diumumkan oleh pembaca layar.
- Entri mencakup jenis operasi (Render/Task), status (ok/error), dan ringkasan hasil. Maksimum 10 entri terbaru untuk menjaga fokus.
