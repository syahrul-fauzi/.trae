**Tujuan & Ruang Lingkup**
- Capai WCAG 2.1 AA nol pelanggaran pada halaman kritis (`/dashboard`, auth, chat, integrations).
- Pastikan metadata SEO konsisten: `canonical`, `og:url`, dan struktur Next.js `Metadata` valid.
- Stabilkan E2E lintas Chromium/Firefox/WebKit dengan artefak JSON/HTML yang kaya.
- Tingkatkan konsistensi UI/UX, performa, dan dokumentasi dengan rencana iteratif.

**UI/UX**
- Audit konsistensi visual: tipografi, spasi, warna, dan komponen inti (`PageHeader`, `Card`, `Select`) lintas `apps/app` dan `apps/web`.
- Standarisasi landmark dan test anchors: satu `main`, `role="banner"` untuk header, `role="region"` berlabel untuk container; gunakan `data-testid` konsisten.
- Aksesibilitas: perkuat kontras (lanjutan dari `AuthLayout`), label form/ikon, fokus jelas, `Skip to content` di layout.
- Usability testing berkala: skenario 5 alur inti (login, navigasi dashboard, interaksi filter/Select, aksi utama, kembali), observasi hambatan dan perbaikan cepat.

**Implementasi Fungsional**
- Metadata SEO: perluas util `generateBaseMetadata` agar menyertakan `metadataBase` berbasis header/env; verifikasi `alternates.canonical` dan `openGraph.url`. Rujukan: `apps/app/src/shared/lib/metadata.ts:30` dan pemanggilan di `apps/app/src/app/(authenticated)/dashboard/page.tsx:15`.
- Remediasi Axe di Dashboard: gunakan artefak kaya (screenshot + `contextHtml`) untuk memperbaiki kategori umum (kontras, `link-name`, `image-alt`, `aria-allowed-role`, heading). Rujukan tes: `apps/app/e2e/dashboard-a11y.spec.ts`.
- Stabilitas E2E: pastikan `webServer` aktif, kurangi flakiness (gantikan `waitForTimeout` dengan `expect(...).toBeVisible()`), dan normalisasi selektor berbasis `data-testid`.
- Optimasi performa: lanjutkan `dynamic import` untuk modul berat (grafik), gunakan `next/image`, batasi re-render dengan memo, aktifkan prefetch navigasi dan cache fetch.

**Proses Berkelanjutan**
- Milestone bertahap:
  - Fase A11y & Metadata: nol pelanggaran pada `/dashboard`, metadata terdeteksi oleh tes.
  - Fase Konsistensi UI/UX: audit dan penyesuaian token/komponen lintas aplikasi.
  - Fase Performa: budget dan optimasi bundel/TTVC.
  - Fase Dokumentasi & CI: panduan, otomatiskan kualitas.
- Pelacakan bug/fitur: template Issue (Bug/Feature), label (severity, area), definisi done (uji + dokumentasi).
- QA menyeluruh: unit (komponen UI), integrasi (aliran user), E2E (repeat + artefak), serta validasi ringkasan dengan gate `STRICT_A11Y=true`.

**Pengujian & Validasi**
- A11y: tes Axe di `apps/app/e2e/dashboard-a11y.spec.ts` menegakkan `wcag2a/wcag2aa` → ekspektasi nol pelanggaran; artefak tersimpan di `apps/app/playwright-report/run-logs/axe-violations.json`.
- Metadata: `apps/app/e2e/dashboard-meta.spec.ts` memastikan `<link rel="canonical">` dan `<meta property="og:url">` hadir dan berbasis `headers()/env`.
- Performa: uji waktu rata-rata/penyimpangan (lihat `apps/app/e2e/performance.spec.ts`), tetapkan ambang dalam validator ringkasan.
- Ketangguhan CI: konfigurasi `apps/app/playwright.config.ts` tetap lintas browser; artefak JSON/HTML di-upload.

**Dokumentasi**
- Perbarui README modul `apps/app` dan `apps/web`: cara menjalankan repeat E2E, lokasi artefak Axe, pedoman WCAG 2.1 AA.
- Dokumentasi util metadata: contoh penggunaan `generateBaseMetadata`, `validateMetadataConsistency`, dan praktik `metadataBase`.
- Changelog terstruktur setiap iterasi: perubahan UI/UX, fungsional, pengujian, dan hasil metrik.

**Kriteria Penerimaan**
- WCAG 2.1 AA: 0 pelanggaran kritis/minor pada halaman target dan setelah interaksi.
- Metadata: `canonical` dan `og:url` terdeteksi benar pada `/dashboard` untuk locale yang relevan.
- Performa: metrik di bawah ambang yang disepakati; flakiness rendah (repeat stabil lintas browser).
- Konsistensi: landmark, komponen, dan selektor sesuai standar; seluruh tes (unit/integrasi/E2E) hijau di CI.

Jika disetujui, saya akan mulai dari Fase A11y & Metadata pada `apps/app` (Dashboard), kemudian melanjutkan ke konsistensi UI/UX lintas aplikasi, diikuti optimasi performa dan penataan proses/CI.