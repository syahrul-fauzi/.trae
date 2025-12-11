## Ruang Lingkup
- Tambah uji aksesibilitas keyboard untuk tabs pada halaman umbrella diagrams.
- Ekspor artifacts kinerja `perf_mermaid.json` dari Playwright dan unggah via CI dengan penamaan baku.
- Integrasikan tautan menonjol ke halaman umbrella pada dokumentasi arsitektur, beserta deskripsi dan konteks penggunaan.

## Keyboard Navigation Tests (Playwright)
- Lokasi: `apps/docs/e2e/tests/umbrella-a11y-tabs.spec.ts`
- Cakupan pengujian:
  - Navigasi panah: kiri/kanan untuk tab horizontal; (opsional) atas/bawah untuk varian vertikal bila ada.
  - Manajemen fokus: pastikan `document.activeElement` berpindah ke tab berikut/sesuai.
  - Validasi ARIA: `role="tablist"`, `role="tab"`, `role="tabpanel"`; atribut `aria-selected` berubah benar.
  - Skenario:
    - State fokus awal pada tab aktif pertama (L0).
    - Wrap-around: dari tab terakhir → pertama dan sebaliknya.
    - Tab non-aktif/disabled: simulasi tab `aria-disabled="true"` (stub) dan verifikasi tidak terfokus atau diaktifkan.
    - Kombinasi shortcut: `Ctrl+Arrow` tidak mengubah seleksi (kecuali kita desain berbeda); assert tidak ada perubahan state.
- Implementasi teknis:
  - Gunakan `page.keyboard.press('ArrowRight')`, cek `aria-selected` dan URL `?depth=...` berubah sesuai.
  - Gunakan `expect(page.getByRole('tab', { name: /L1/ })).toHaveAttribute('aria-selected', 'true')`.

## Perf Artifacts JSON
- Ekspor dari Playwright:
  - Tambah helper `apps/docs/e2e/utils/perf.ts` untuk mengumpulkan sampel render waktu hingga `mermaid-svg` terlihat.
  - Modifikasi `mermaid-performance.spec.ts` untuk menulis `perf_mermaid.json` ke `apps/docs/playwright-report/` dengan skema:
    - `build`: `{ sha, branch, date, node, playwright, nextBuildId }`
    - `pages`: `[{ path, locale, depth, type, count, renderMs }]`
    - `summary`: `{ p50RenderMs, p95RenderMs, samples }`
- CI Pipeline:
  - Update `.github/workflows/docs-e2e.yml` untuk mengunggah artifact dengan pola nama: `perf_mermaid_${{ github.sha }}_${{ steps.date.outputs.today }}.json`.
  - Tambah langkah menghasilkan tanggal: `today=YYYY-MM-DD`.
  - Sertakan metadata env di JSON (Node, Playwright). Retensi gunakan default GitHub Artifacts; dokumentasikan kebijakan.

## Integrasi Dokumentasi
- Update `docs/architecture/README.md`:
  - Tambahkan bagian "Umbrella Diagrams" dengan deskripsi tujuan, kapan dirujuk (cross-context, onboarding, review arsitektur), dan link: `apps/docs/app/[locale]/diagrams/umbrella` (jelaskan akses via situs, contoh `/en/diagrams/umbrella`).
  - Opsional: tambah pratinjau gambar (screenshot) dari diagram kunci; simpan di `docs/architecture/images/umbrella-preview.png`.
- Verifikasi build:
  - Lokal: jalankan `pnpm --filter docs dev` dan cek tautan.
  - Produksi: saat deploy, pastikan halaman tersedia dan tautan valid.

## Risiko & Mitigasi
- Flaky a11y tests: stabilkan dengan selector role-based dan menunggu panel siap.
- Penamaan artifact: pastikan kompatibel dengan sistem file dan CI; gunakan format aman.
- Link environment: dokumentasi mungkin dibaca dari repo; sertakan petunjuk akses URL produksi.

## Definisi Selesai
- Uji keyboard tabs mencakup navigasi, fokus, ARIA, wrap-around, dan skenario disabled/shortcut.
- `perf_mermaid.json` dihasilkan pada setiap run, diunggah dengan nama yang baku dan berisi metadata lingkungan.
- README arsitektur memiliki link menonjol, deskripsi, konteks, dan (opsional) pratinjau; tautan diverifikasi di lokal dan produksi.