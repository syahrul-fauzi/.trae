## Sasaran
- Membuat engine mirror IDE-optimized ke `/.trae/documents` dengan pengecekan izin, pembuatan direktori, penanganan error, dan logging.
- Menyempurnakan dokumentasi API Heatmap dengan diagram mermaid (auth/endpoint/error flow) dan contoh respons terstruktur di OpenAPI 3.0.

## Rencana Teknis
### 1) Engine Mirror .trae/documents
- Fungsi inti:
  - `ensureTraeDir(base='.trae/documents')`: cek eksistensi, buat jika tidak ada.
  - `canWrite(path)`: verifikasi izin tulis; jika gagal → kembalikan status dan alasan.
  - `mirrorFile(src, dest)`: salin konten (preserve frontmatter, struktur relatif, encoding UTF-8).
  - `mirrorTree(srcRoot, destRoot, filters={ext:['.md','.yaml','.json']})`: gandakan pohon berkas yang relevan.
- Logging:
  - Simpan ke `logs/mirror-trae.log` (timestamp, operasi, hasil, error stack bila ada).
- Penanganan error:
  - Jika jalur `.trae/documents` tidak tersedia atau tidak bisa ditulis, hasilkan laporan `workspace/_mirror_report.md` berisi status mirroring dan instruksi manual.
- Struktur:
  - Pertahankan nama/relative path: `workspace/05_API/analytics-heatmap-api.md` → `.trae/documents/Spesifikasi API Fitur Analytics Heatmap.md`.

### 2) Diagram Mermaid (dimasukkan ke spesifikasi Markdown)
- Diagram autentikasi lengkap:
  - Flow: Client → API → Auth Middleware (JWT/Supabase) → RBAC → Handler → Store → Event Bus → Webhook.
- Flow endpoint utama (POST /events, GET /stats):
  - Langkah validasi, idempotensi, simpan, response.
- Error handling scenarios:
  - 400 validation, 401 invalid/missing token, 403 RBAC deny, 429 rate limit, 500 internal.
- Kompatibilitas:
  - Gunakan sintaks mermaid yang didukung renderer MD (flowchart/sequence) tanpa fitur eksperimental.

### 3) OpenAPI 3.0 (penyempurnaan YAML)
- Tambahkan `examples` pada `responses` untuk status umum:
  - `200`: contoh `EventListResponse`, `StatsResponse`.
  - `201`: `EventCreated` sample.
  - `400`: `ErrorResponse` dengan `code:"validation"` & `details.field`.
  - `401`: `ErrorResponse` dengan `code:"unauthorized"`.
  - `500`: `ErrorResponse` dengan `code:"server_error"`.
- Tambahkan `examples` untuk request `HeatmapEvent` di `POST /events` dan batch di `POST /bulk`.
- Pastikan konsistensi tipe dan enum sesuai schema yang ada.

### 4) Postman (penyempurnaan ringan)
- Tambahkan test scripts tambahan:
  - Verifikasi skema dasar (apakah field wajib ada).
  - Logging waktu respons dan header `X-RateLimit-*` bila tersedia.
- Enrich environment:
  - Tambah `stagingBaseUrl`, `prodBaseUrl` dan switcher sederhana.

### 5) Integrasi & Referensi
- Tautan tetap di `README.md` dan `docs/README.md` menunjuk ke artefak `workspace/05_API/*`.
- Jika mirror `.trae` berjalan, cantumkan catatan di spesifikasi yang menunjuk kedua lokasi (workspace & .trae).

### 6) Validasi
- Validasi OpenAPI YAML dengan validator (lint) dan uji import ke Swagger UI.
- Uji Postman Collection di environment dev/staging.
- Periksa tautan relatif di README/docs.
- Audit konsistensi (endpoint, schema, examples) antara spesifikasi MD dan OpenAPI.

### 7) Keamanan & Kualitas
- Memastikan tidak ada rahasia yang ditulis ke `.trae`.
- Menjaga determinisme contoh; tidak memaparkan struktur DB internal; URI berbasis sumber daya.

## Hasil
- Engine mirror siap digunakan (dengan logging & fallback report).
- Spesifikasi kaya: diagram mermaid, contoh respons di OpenAPI 3.0, Postman yang dapat dijalankan.
- Dokumentasi interaktif tetap berfungsi setelah mirroring.

Saya akan menyiapkan skrip mirror, memperkaya spesifikasi dengan diagram, menambah examples di YAML, menyempurnakan Postman, dan memverifikasi semuanya. 