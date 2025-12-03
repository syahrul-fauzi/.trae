## Tujuan & Ruang Lingkup
- Membersihkan dan merapikan JSX di `apps/web/src/features/workflows/components/WorkflowBuilder.tsx` hingga pemeriksaan tipe monorepo (`pnpm type-check`) berstatus 0 error.
- Menjaga perilaku UI/UX tetap identik, hanya memperbaiki struktur, tipe, dan konsistensi kode.

## Masalah Ditemukan
- Penutupan tag JSX tidak konsisten di area canvas (error pada baris ~740–746: CardContent, Card, dan div tidak tertutup dengan benar).
- Potensi ketidaksesuaian prop-types (mis. varian Badge) dan signature handler (`onValueChange`) yang diharapkan string.
- Beberapa union/annotation belum eksplisit, memicu implicit any dan kesalahan kompatibilitas.

## Langkah Implementasi
### 1) Perbaikan Struktural JSX
- Reorganisasi blok canvas di dalam `<CardContent>`:
  - Pastikan hirarki: `Card > CardHeader > CardContent > div.canvas > svg > nodes` memiliki penutupan tag konsisten.
  - Pastikan conditional render `nodes.length === 0` berada di dalam `CardContent` dan tidak memecah hirarki.
- Rapikan indentasi dan format sesuai konvensi proyek.

### 2) Penataan Komponen & Props
- Konversi varian Badge yang tidak tersedia ke varian yang valid (contoh: `success` → `primary` atau `secondary` sesuai tema di UI package).
- Pastikan `Select` dan `Tabs` memakai signature string untuk `onValueChange` (radix & custom select di UI menuntut `(value: string) => void`).
- Gunakan helper `cn` sesuai path alias di web (`@/shared/lib/utils`) bila dipakai di berkas web.

### 3) Pengetatan Tipe
- Tambahkan tipe eksplisit untuk fungsi handler:
  - `handleMouseDown(e: React.MouseEvent, nodeId: string)`
  - `handleMouseMove(e: React.MouseEvent)` dan `handleMouseUp()`
- Definisikan tipe `WorkflowNode`, `WorkflowConnection`, `WorkflowTemplate` (sudah ada) dengan konsistensi pemakaian.
- Tambahkan type guards ringan jika diperlukan saat mencari node `find(n => n.id === connection.from)` dengan cek null sebelum akses.

### 4) Ekstraksi Komponen (Opsional, Bila Diperlukan)
- Ekstrak `WorkflowCanvas` sebagai komponen anak dengan props bertipe jelas (`nodes`, `connections`, `isConnecting`, `connectionStart`, dsb.) untuk menurunkan kompleksitas JSX dan memudahkan validasi tipe.

## Validasi & Iterasi
- Jalankan `pnpm --filter @sba/web type-check` setelah tiap perubahan signifikan sampai bersih.
- Terakhir jalankan `pnpm type-check` di root untuk memastikan monorepo hijau.

## Quality Control
- Verifikasi manual UI (kanvas, koneksi antar node, empty state) tetap berfungsi melalui preview/dev server.
- Tambahkan commit dengan pesan deskriptif: `fix(web): clean up WorkflowBuilder JSX, close tags and align prop types`.
- Dokumentasikan perubahan struktural singkat di README fitur atau CHANGELOG apps/web.

## Risiko & Mitigasi
- Risiko gangguan layout/animasi akibat penataan ulang JSX → mitigasi dengan snapshot visual cepat dan verifikasi interaksi drag/connect.
- Risiko regressi prop-types → mitigasi dengan audit varian dan handler signature mengikuti paket UI.

## Konfirmasi
- Jika disetujui, saya akan menerapkan perubahan pada file, menjalankan type-check iteratif, dan menyiapkan commit beserta dokumentasi ringkas.