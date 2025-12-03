## Tujuan
- Menguatkan keamanan CSP di `apps/web` dengan model nonce dan whitelist `connect-src` berbasis environment.
- Mengurangi ketergantungan pada `'unsafe-inline'` untuk `script`/`style` secara bertahap, tanpa merusak UX.
- Memperbaiki dan memverifikasi komponen UI/UX prioritas (Chat, Dashboard) agar bebas bug, aksesibel, dan stabil.
- Melengkapi dokumentasi operasional dan pengujian menyeluruh sebelum deklarasi selesai.

## Kondisi Saat Ini
- Middleware CSP belum memakai nonce dan whitelist asal koneksi masih sempit:
  - `apps/web/middleware.ts:39-41` dan `apps/web/middleware.ts:62-64` → `script-src 'self' https://unpkg.com`, `style-src 'self' 'unsafe-inline' https://unpkg.com`, `connect-src 'self'`.
- Layout tidak mempropagasi nonce:
  - `apps/web/src/app/layout.tsx` → tidak ada pembacaan `x-csp-nonce` atau penggunaan `nonce`.
- Inline style masih ada:
  - `apps/web/src/features/chat/components/ChatInput.tsx` → `style={{ height: 'auto' }}`.
- Test & E2E sudah ada (71 file, Playwright e2e) namun belum memverifikasi header CSP dan nonce.

## Rencana Implementasi
1. Middleware: adopsi nonce dan whitelist koneksi berbasis env
- Generate nonce per request, injeksikan ke header `x-csp-nonce`.
- Susun `connect-src` dari env: `NEXT_PUBLIC_API_BASE`, `NEXT_PUBLIC_SUPABASE_URL`, `UPSTASH_REDIS_REST_URL`, `NEXT_PUBLIC_OTEL_COLLECTOR_URL`.
- Dev: izinkan `http:`/`https:`/`ws:`/`wss:`. Prod: `https:` dan origin ter-whitelist saja.
- `script-src`: `'self' 'nonce-<nonce>'` (hapus ketergantungan `unpkg` jika tidak diperlukan).
- `style-src`: `'self' 'nonce-<nonce>'` + transisi `'unsafe-inline'` sementara hingga audit selesai.
- Tambahkan header keamanan pendukung: `X-Content-Type-Options: nosniff`, `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`. `Strict-Transport-Security` hanya di prod.

2. Layout: propagasi nonce
- Baca `x-csp-nonce` via `next/headers`, set ke `<body data-csp-nonce="...">`.
- Gunakan `next/script` dengan `nonce` jika ada skrip inline; audit layout untuk penggantian aman.

3. Reduksi inline style & perbaikan UX
- ChatInput: ganti `style={{ height: 'auto' }}` dengan kelas utilitas (`h-auto`, `min-h`, `max-h`) atau CSS modul.
- Audit cepat komponen Chat/Dashboard/Widgets untuk inline style tersisa; migrasi ke kelas utilitas.
- A11y: pastikan label, `aria-*`, fokus ring, dan kontras teks sesuai.

4. Verifikasi menyeluruh
- Unit test middleware: panggil `middleware(req)` untuk `/` dan `/api/*`, asersi header `Content-Security-Policy` dan keberadaan `x-csp-nonce`.
- Unit test layout: render dan asersi `data-csp-nonce` terpasang saat header tersedia.
- Playwright e2e: intercept response home/chat, verifikasi header CSP; uji alur chat-stream tetap berfungsi.

5. Dokumentasi
- Perbarui `/home/inbox/smart-ai/sba-agentic/.trae/documents/Tingkatkan CSP & UX untuk Apps_Web + Verifikasi Menyeluruh.md`:
  - Ringkasan kebijakan CSP baru, variabel env, dan daftar origin.
  - Panduan migrasi menghapus `'unsafe-inline'` secara bertahap.
  - Langkah verifikasi manual di DevTools dan skenario e2e.

## Deliverables
- Middleware CSP `apps/web/middleware.ts` dengan nonce + whitelist dinamis.
- Layout `apps/web/src/app/layout.tsx` mempropagasi nonce ke `<Script>` dan `<body>`.
- Refactor `ChatInput.tsx` tanpa inline style untuk tinggi.
- Test unit untuk CSP dan layout, plus assertion e2e untuk header CSP.
- Dokumentasi lengkap pada dokumen yang disebutkan pengguna.

## Verifikasi & Kriteria Selesai
- Semua test unit dan e2e lulus.
- DevTools: header CSP memuat `'nonce-<...>'` dan `connect-src` sesuai env.
- Tidak ada regresi UI/UX pada halaman chat/dashboard.
- Dokumentasi diperbarui dan jelas untuk staging/production.

Silakan konfirmasi rencana ini. Setelah Anda setujui, saya akan langsung menerapkan perubahan, menulis tes, menjalankan verifikasi, dan menyiapkan dokumentasi final.