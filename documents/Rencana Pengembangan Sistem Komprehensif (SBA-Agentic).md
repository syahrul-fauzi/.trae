# Rencana Pengembangan Sistem Lanjutan

Saya telah melakukan analisis terhadap kode yang ada (terutama `apps/app/package.json`, `Dockerfile`, `vitest.config.ts`, dan `README.md`) dan menyusun rencana komprehensif untuk memenuhi kebutuhan pengembangan lanjutan Anda.

## 1. Persiapan Lingkungan Development Terisolasi (Docker)

Saat ini `apps/app/Dockerfile` sudah ada tetapi menggunakan `oven/bun` dan hanya untuk production build/start. Kita perlu membuat `docker-compose.yml` untuk lingkungan development yang lengkap.

**Langkah Implementasi:**

1. **Buat** **`docker-compose.dev.yml`**:

   * **App Service**: Menggunakan Node.js/Bun image yang sesuai, volume mapping ke source code lokal agar hot-reload berfungsi.

   * **Database**: PostgreSQL (jika belum ada) atau koneksi ke Supabase lokal.

   * **Redis**: Untuk caching layer.

   * **Observability**: Prometheus & Grafana containers.
2. **Update** **`README.md`**: Menambahkan instruksi cara menjalankan environment docker (misal: `docker-compose -f docker-compose.dev.yml up`).
3. **Dokumentasi Env**: Pastikan `.env.example` mencerminkan variabel yang dibutuhkan oleh docker services.

## 2. Verifikasi Fitur Utama & Testing

Proyek ini sudah menggunakan Vitest dan Playwright (`apps/app/package.json`). Kita akan meningkatkan coverage dan struktur testing.

**Langkah Implementasi:**

1. **Audit Unit Test**: Menjalankan coverage report saat ini (`pnpm run test:coverage`) untuk melihat gap.
2. **Tingkatkan Coverage**: Menambahkan unit test untuk area yang kurang tercover (target 80%).
3. **Setup CI Pipeline**: Membuat file workflow GitHub Actions (`.github/workflows/ci.yml`) yang menjalankan:

   * Linting & Type checking.

   * Unit test dengan coverage check.

   * E2E smoke test.

   * Security audit (`npm audit`).

## 3. Jaminan Stabilitas Sistem

**Langkah Implementasi:**

1. **Error Handling**:

   * Memastikan `CustomError` classes digunakan secara konsisten.

   * Memvalidasi `ErrorBoundary` di React components (sudah ada `error.tsx` di Next.js, kita akan review implementasinya).
2. **Observability Stack**:

   * Mengintegrasikan library logging yang terstruktur (misal `winston` atau `pino`) jika `console.log` masih dominan.

   * Menambahkan endpoint `/metrics` untuk Prometheus (sudah ada script `metrics-writer.js`, perlu diintegrasikan ke endpoint API).

## 4. Optimasi Performa

**Langkah Implementasi:**

1. **Redis Caching**: Mengimplementasikan caching untuk endpoint API yang berat (misal analytics).
2. **Load Testing**: Membuat script k6 atau artillery untuk melakukan load testing (100+ concurrent users).
3. **Database Indexing**: Review schema Prisma/Supabase untuk memastikan field yang sering di-query memiliki index.

## 5. Dokumentasi Komprehensif

**Langkah Implementasi:**

1. **API Docs**: Memastikan OpenAPI/Swagger tergenerate dengan benar (sudah ada `/api/openapi`, kita akan validasi kelengkapannya).
2. **Architecture Decision Records (ADR)**: Membuat folder `docs/adr` dan menambahkan ADR pertama tentang arsitektur sistem ini.
3. **Diagram**: Menambahkan diagram arsitektur ke `README.md` (menggunakan Mermaid).

***

## Tahapan Eksekusi Prioritas

Saya akan memecah eksekusi menjadi beberapa fase agar terstruktur:

**Fase 1: Infrastruktur Development (Docker & CI)**

* Membuat `docker-compose.dev.yml`.

* Membuat GitHub Actions workflow.

* Update dokumentasi setup.

**Fase 2: Testing & Quality Assurance**

* Analisis coverage saat ini.

* Menambahkan test case krusial.

* Security audit dependencies.

**Fase 3: Observability & Performance**

* Setup logging terstruktur.

* Implementasi caching dasar.

setuju dengan rencana ini. Silakan memulai Fase 1.
