# Tujuan & Cakupan
- Menyempurnakan dan menyelesaikan implementasi UI/UX di seluruh aplikasi SBA (apps/web dan packages/ui) hingga siap deployment.
- Fokus: refactory & reorganisasi komponen, optimisasi user flow, konsistensi desain, aksesibilitas, QA komprehensif, dokumentasi lengkap, dan final review.

## Baseline & Gap
- packages/ui: Design System aktif (Storybook, unit tests komponen). Perlu penguatan ARIA/fokus & konsistensi pola.
- apps/web: FSD sebagian (features/chat, widgets), belum ada e2e Playwright & lint aksesibilitas menyeluruh; user flow utama perlu pemolesan.
- Aksesibilitas: belum konsisten lint a11y di apps/web; belum ada uji axe.

## Penyempurnaan UI/UX
- Refactory komponen inti (Button, Input, Select, Dialog):
  - Tambah peran & label ARIA; state fokus/disabled/pressed; keyboard interaction.
  - Konsolidasikan varian & ukuran melalui design tokens; hilangkan duplikasi gaya.
- Konsistensi desain:
  - Terapkan tokens untuk warna/spacing/typography; audit varian komponen agar seragam.
  - Review iconografi, tipografi, spacing pada templates dan organisms.
- Responsivitas:
  - Uji grid & layout pada viewport 360/768/1024/1440; pastikan komponen adaptif.
  - Skeleton/loading & progressive rendering pada Chat Streaming & Document Generator.
- Aksesibilitas:
  - Aktifkan lint a11y (jsx-a11y) di apps/web; tambahkan uji axe per halaman utama.
  - Tambahkan focus trap untuk Dialog/Modal; skip links; readable labels.

## Optimasi User Flow
- Chat Streaming:
  - Tampilkan status tool-call; fallback error; interupsi human-in-loop yang jelas.
  - Sentimen loading ringkas; first-token < 1s (target) bila data tersedia.
- Document Generator:
  - Wizard langkah jelas; validasi input; status job; akses ke artifact + metadata.
- Tenant Switcher:
  - Indikator tenant/branding; state terisolasi; konfirmasi operasi lintas-tenant.

## Reorganisasi & Penegakan FSD
- Pastikan folder `processes/` dan `entities/` tersedia; pisahkan logic UI vs domain.
- Aturan impor: widgets → features → entities → shared; cegah circular imports via lint boundaries.
- Selaraskan struktur stories dengan hierarki Atomic (atoms/molecules/organisms/templates).

## Penyelesaian Pekerjaan (Acceptance)
- Chat:
  - Mengirim & menerima pesan dengan streaming stabil; alat (tool) status tampil; error ditangani.
- Document:
  - Generate dokumen → artifact dapat diunduh; metadata tersimpan; resume bila gagal.
- Tenant:
  - Switch & settings berjalan; tema per-tenant terapply; isolasi data terverifikasi.

## Quality Assurance
- Unit tests: komponen atoms/molecules (focus, aria, disabled, keyboard nav).
- Integration tests: halaman Next (routing, state, aksesibilitas dasar).
- E2E (Playwright): alur Chat, Document Generator, Tenant Switcher; tambahkan axe uji aksesibilitas.
- Cross-device/browser: Chrome/Firefox/Safari/Edge; viewport 360/768/1024/1440.
- Performance: batas LCP/CLS per halaman; uji interaksi berat; profil rendering.
- Visual regression: snapshot Storybook untuk komponen kunci.

## Dokumentasi
- Developer docs:
  - UI/UX handbook: pola interaksi, tokens & varian, aturan FSD, lint a11y.
  - Implementation guide: cara menambah komponen/fitur sesuai FSD/Atomic.
- User manual:
  - Panduan alur utama (Chat, Document, Tenant); troubleshooting umum.
- Changelog & ADR:
  - Ringkas perubahan; keputusan desain yang relevan.

## Finalisasi
- Readiness checklist:
  - Lint & typecheck lulus; unit/integration/e2e hijau; accessibility checks lolos; perf metrik dalam batas.
- Review akhir & sign-off:
  - Verifikasi acceptance criteria; catat temuan; siap deployment.

## Deliverables
- Komponen UI yang telah direfactor (Button/Input/Select/Dialog) lengkap dengan ARIA & tests.
- Storybook tersusun sesuai Atomic (stories tersinkron).
- Playwright + axe tests untuk alur kunci; laporan test.
- Dokumen UI/UX handbook & user manual.
- Checklist readiness & laporan review akhir.

## Timeline Singkat
1) Minggu 1: Refactor komponen + lint a11y + unit tests.
2) Minggu 2: E2E & integration tests + optimasi flow; dokumentasi developer.
3) Minggu 3: User manual + visual regression + perf checks; final review.

## Risiko & Mitigasi
- Fragmentasi gaya: tegakkan tokens & varian; review design sistem.
- Ketidakkonsistenan ARIA: lint + test a11y otomatis.
- Regressi UI: visual regression via Storybook snapshot.

## Metrik Keberhasilan
- Aksesibilitas: axe error = 0 di halaman utama; lint a11y lulus.
- Responsivitas: tampilan valid di 4 viewport; tanpa overflow kritis.
- Kualitas UI: > 80% coverage komponen inti; e2e alur utama hijau; LCP < 2.5s.

Silakan konfirmasi rencana ini agar saya lanjut mengeksekusi refactor, penambahan pengujian, dan dokumentasi hingga siap deployment.