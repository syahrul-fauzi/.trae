# Rencana Perluasan Bagian "Authentication & Authorization"

## Konten yang Akan Ditambahkan pada docs/TECHNICAL_SPECIFICATION.md

### 1) Skema Token (JWT)
- Struktur umum:
  - Header: `{ alg: "HS256", typ: "JWT" }` (default saat ini). Dukungan RS256 dapat ditambahkan untuk kebutuhan key rotation/KMS.
  - Payload utama yang digunakan sistem:
    - `sub`: ID pengguna
    - `roles`: array peran pengguna (`["admin"|"user"|"guest"|"uploader"]`)
    - `tenantId` atau `tenant_id`: ID tenant multi-penyewa
    - `iat`/`exp`: issued-at dan expiry
    - Opsional: `attrs` (atribut tambahan untuk kebijakan akses kompleks), `jti` (ID token), `sessionId`
  - Signature: HMAC-SHA256 (HS256) dengan `JWT_SECRET` dari environment.
- Contoh payload JWT:
```json
{
  "sub": "user-123",
  "roles": ["user"],
  "tenantId": "00000000-0000-0000-0000-000000000000",
  "attrs": { "department": "sales", "clearance": 3 },
  "iat": 1733817600,
  "exp": 1733821200
}
```
- Konfigurasi saat ini:
  - `JWT_SECRET`: kunci HMAC (HS256)
  - `JWT_EXPIRES_IN`: durasi akses token (default: `1h`)
  - Opsi RS256: `kid` header + pengelolaan kunci via KMS (opsional, untuk roadmap)

### 2) Strategi Refresh Token
- Mekanisme:
  - Akses Token: masa berlaku singkat (default `1h`).
  - Refresh Token: masa berlaku lebih panjang (default `7d`). Ditandatangani dan disimpan dengan TTL di Redis: key `user:<sub>:refresh`.
  - Saat refresh:
    - Verifikasi refresh token (signature & expiry)
    - Terbitkan akses token baru
    - Rotasi/overwrite refresh token untuk keamanan (opsional blacklist jti)
  - Logout:
    - Hapus refresh token di Redis
    - Klien menghapus cookie/sesi lokal
- Masa berlaku:
  - `access_token`: 1 jam
  - `refresh_token`: 7 hari
- Diagram alur autentikasi (Mermaid):
```mermaid
graph TD
  A[Client Login] --> B[Auth Service: verify credentials]
  B --> C{Success?}
  C -- Yes --> D[Issue access_token(1h) & refresh_token(7d)]
  C -- No --> E[Return 401]
  D --> F[Client calls API with Bearer access_token]
  F --> G{Access expired?}
  G -- No --> H[API authorizes request]
  G -- Yes --> I[Client calls /auth/refresh with refresh_token]
  I --> J{Refresh valid?}
  J -- Yes --> K[Issue new access_token; rotate refresh]
  J -- No --> L[Return 401; re-login]
  K --> F
```

### 3) Matriks Peran vs Endpoint
- Tabel pemetaan akses (ringkas):

| Endpoint | Aksi | Admin | User | Guest | Uploader |
|---|---|---|---|---|---|
| `GET /health` | read | ✓ | ✓ | ✗ | ✓ |
| `GET /metrics` | read | ✓ | (opsional) | ✗ | ✓ |
| `GET /api/tools` | read | ✓ | ✓ | ✗ | ✗ |
| `POST /api/tools/:name/execute` | write | ✓ | (dibatasi) | ✗ | ✗ |
| `POST /api/v1/runs` | write | ✓ | ✓ | ✗ | ✗ |
| `GET /api/v1/runs` | read | ✓ | ✓ | ✗ | ✗ |
| `POST /api/v1/sessions` | write | ✓ | ✓ | ✗ | ✗ |
| `GET /api/admin/*` | read/write | ✓ | ✗ | ✗ | ✗ |
| `POST /api/storage/init|complete|abort` | write | ✗ | ✗ | ✗ | ✓ |

- Catatan:
  - Header `Authorization: Bearer <access_token>` dan `X-Tenant-ID` wajib untuk endpoint multi-tenant.
  - Peran `uploader` khusus untuk alur upload.

- Contoh middleware authorization (NestJS Guards):
```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'user')
@Get('/health')
getHealth() { /* ... */ }

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Post('/api/admin/tenants')
createTenant() { /* ... */ }
```

## Verifikasi & Konsistensi
- Review kelengkapan dokumen: pastikan bagian ini konsisten dengan implementasi `JwtAuthGuard` dan `RolesGuard` (payload: `sub`, `roles`, `tenantId`).
- Menjalankan ulang uji autentikasi & otorisasi (RBAC, admin, tools, runs/sessions) dan memperbaiki bila ada ketidaksesuaian tabel akses vs implementasi.
- Konsolidasi penggunaan claim `tenantId` vs `tenant_id` di middleware parsing untuk konsistensi spesifikasi.
- Review bersama tim (Security, Backend, Frontend) sebelum finalisasi.

## Output yang Diusulkan
- Menambah sub-bab di bawah `## Authentication & Authorization` dengan tiga bagian di atas (Skema Token, Strategi Refresh Token, Matriks Peran vs Endpoint + contoh middleware) dan satu diagram alur autentikasi.
- Tidak mengubah kode; hanya memperkaya dokumentasi.

## Langkah Lanjut Setelah Persetujuan
1. Menyisipkan konten ke dalam `docs/TECHNICAL_SPECIFICATION.md` di bawah bagian yang relevan.
2. Menjalankan ulang seluruh uji terkait autentikasi dan otorisasi.
3. Membuat catatan konsistensi (claim naming, konfigurasi expiry) jika ada deviasi.
4. Menyiapkan sesi review lintas tim dan mengunci dokumen untuk rilis internal.