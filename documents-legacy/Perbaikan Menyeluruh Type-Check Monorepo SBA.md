## Ruang Lingkup
- Menjalankan `type-check` lintas workspace menggunakan Turbo.
- Menganalisis dan memperbaiki seluruh error TypeScript pada apps/docs, apps/app, apps/web, packages/*.
- Menyelaraskan tipe antar modul (Zod, Next.js, React, BaseHub, util internal).

## Benchmark & Eksekusi Awal
- Jalankan di root: `pnpm run type-check`.
- Jika perlu paket spesifik: `pnpm -C . run type-check --filter ./apps/docs`.
- Kumpulkan error per file, kelompokkan kategori: deklarasi tipe salah, interface/type definition, return type fungsi, type guard/penanganan nullability.

## Kategori Error & Strategi Perbaikan
### Deklarasi Tipe Salah
- Perbaiki impor tipe yang tidak konsisten atau salah path.
- Normalisasi tipe utilitas bersama di `packages/shared` (alias path pada `tsconfig.json`).

### Interface dan Type Definition
- Definisikan union types untuk blok konten docs (RichTextBlock, CodeBlock, ImageBlock) dan gunakan discriminated unions pada `__typename`.
- Terapkan tipe parameter dan respons untuk API MCP BaseHub.

### Return Type Fungsi
- Komponen server Next: pastikan `async` komponen mengembalikan `JSX.Element`/`Promise<JSX.Element>` secara eksplisit bila perlu.
- Handler API Next: `POST`/`GET` mengembalikan `NextResponse` dengan payload bertipe.

### Type Guard
- Bangun type guards berbasis `__typename` untuk blok konten.
- Gunakan `zod` sebagai runtime validator dan derive TypeScript types (`z.infer`).

## Perbaikan Spesifik File
### API MCP BaseHub
- File: `apps/docs/app/api/mcp/basehub/route.ts:4-7,20-29`
- Action union: `'get_block' | 'search'` dengan tipe params berbeda.
- Skema Zod:
  - `get_block`: `{ id: string }`
  - `search`: `{ q: string; limit?: number }`
- Respons bertipe dengan bentuk sukses/gagal konsisten.

### Halaman Docs
- File: `apps/docs/app/[locale]/docs/[...slug]/page.tsx:37-43,69-121,150-176`
- Definisikan tipe `Doc`, `BaseBlock`, `RichTextBlock`, `CodeBlock`, `ImageBlock`.
- Ubah `blocks: any[]` menjadi `BaseBlock[]`.
- Terapkan guards saat render berdasarkan `__typename`.
- `generateMetadata` gunakan tipe `Metadata` Next.

### Util & Shared Types
- Pastikan modul shared tersedia dan tipe diekspor:
  - `shared/lib/sanitize-html.ts`: ekspor fungsi dengan signature `sanitizeHtml(input: string): string`.
  - `shared/lib/extract-headings.ts`: ekspor `extractHeadings(html: string): { id: string; text: string; level: number }[]`.
  - `shared/lib/content.ts`: tipe `getDocBySlug(locale: string, slug: string): Promise<Doc | null>`.
- Selaraskan alias pada `tsconfig.json` agar sesuai path aktual.

## Konsistensi Konfigurasi TypeScript
- Root `tsconfig.json`: pertahankan `strict`, `noEmit`, `moduleResolution: bundler`, tambahkan path alias untuk semua packages yang digunakan.
- Package-level tsconfig: extend root, aktifkan `skipLibCheck: true` bila third-party types noisy, tetap `strict: true` di internal.

## Standar Kualitas
- Type safety ketat: tanpa `any` tak perlu; gunakan generics dan union narrowing.
- Konsistensi lint rule (eslint typescript): hindari `non-null assertions`.
- Kompatibilitas dependensi: cocokkan versi `@types/react`, `@types/react-dom`, Next plugin TS.

## Verifikasi
- Jalankan ulang: `pnpm run type-check` hingga nol error.
- Jalankan subset: `pnpm -C apps/docs run type-check` untuk validasi fokus.
- Jalankan lint: `pnpm lint` untuk memastikan tak ada pelanggaran rule terkait tipe.

## Dokumentasi
- Tambahkan ringkasan perubahan tipe per file pada `.trae/documents/RANCANGAN — apps/docs (SBA · BaseHub docs site).md`.
- Cantumkan tipe baru (interfaces/unions), alasan perubahan, dan dampaknya terhadap UI/UX dan API.

## Catatan Implementasi
- Referensi lokasi:
  - `apps/docs/app/api/mcp/basehub/route.ts:5` — deklarasi `action` perlu union bertipe.
  - `apps/docs/app/[locale]/docs/[...slug]/page.tsx:70-121` — render blok perlu union discriminate.
- Semua perubahan dilakukan tanpa mengubah perilaku eksternal, hanya memperkuat tipe dan gard.

## Next Steps (Setelah Persetujuan)
1. Terapkan union types dan skema Zod di API MCP.
2. Refactor blok konten docs ke tipe kuat dan guards.
3. Sinkronisasi util shared dengan signature yang eksplisit.
4. Jalankan `pnpm run type-check` dan iterasi hingga bersih.
5. Perbarui dokumen rancangan dengan detail perbaikan.