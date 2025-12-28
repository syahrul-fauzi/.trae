# Local Development Guide

Panduan bagi pengembang (dan Agen AI) untuk menjalankan dan menguji sistem SBA-Agentic di lingkungan lokal.

## 1. Prasyarat (Prerequisites)
- Node.js v18+ & pnpm.
- Docker (untuk Redis/Postgres lokal).
- Supabase CLI.

## 2. Setup Awal
```bash
# Install dependensi
pnpm install

# Setup env vars
cp .env.example .env

# Jalankan layanan pendukung (Docker)
docker-compose up -d
```

## 3. Menjalankan Aplikasi
```bash
# Jalankan API server
pnpm dev:api

# Jalankan UI dashboard
pnpm dev:ui
```

## 4. Menguji Rule Secara Lokal
Untuk menguji rule YAML tanpa deploy:
```bash
# Validasi skema
pnpm rube:validate

# Jalankan simulasi event
pnpm rube:test --rule BPA-APP-01 --event approval.pending
```

---
*Gunakan `pnpm docs:validate` untuk memastikan dokumentasi dan rule selaras.*
