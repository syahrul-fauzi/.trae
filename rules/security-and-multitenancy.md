# Security & Multi-tenancy

Keamanan dan isolasi data antar tenant adalah prioritas tertinggi dalam SBA-Agentic.

## 1. Autentikasi & Otorisasi
- **Auth**: Menggunakan Supabase Auth dengan validasi JWT di setiap request.
- **RBAC**: Akses ke rule dan tool dibatasi berdasarkan role user (`admin`, `manager`, `agent`, `system`).
- **Tool Access**: Hanya tool yang terdaftar dalam *Tool Registry* yang dapat dieksekusi oleh agen.

## 2. Isolasi Tenant
- Setiap data dan event **WAJIB** memiliki `tenant_id`.
- Agen dilarang keras melakukan kueri silang antar tenant.
- Gunakan mekanisme RLS (Row Level Security) di level database.

## 3. Perlindungan Data (PII)
- **PII Masking**: Data sensitif (Email, No. HP, Alamat) wajib disamarkan secara rekursif dalam log agen menggunakan [masking.ts](file:///home/inbox/smart-ai/sba-agentic/packages/security/src/masking.ts).
- **Enkripsi**: Data sensitif di database wajib dienkripsi menggunakan `@sba/security` utilitas.

## 4. Audit Trail
Setiap keputusan agen dan eksekusi rule wajib dicatat dalam log audit yang mencakup:
- `tenant_id` & `user_id`
- `rule_id` & `capability_id`
- `reasoning_trace` (Langkah pemikiran agen)
- `success_status`

## 5. Rate Limiting (BPA-SI-01)
- **Mechanism**: Menggunakan *Sliding Window Rate Limiter* untuk mencegah penyalahgunaan API.
- **Default Window**: 1 menit (`1m`).
- **Default Limit**: 100 request per tenant per rule.
- **Headers**:
  - `X-RateLimit-Limit`: Batas maksimum request.
  - `X-RateLimit-Remaining`: Sisa request yang tersedia.
  - `Retry-After`: Waktu tunggu (detik) jika terkena limit.
- **Implementation**: Terintegrasi di level API Gateway dan Rube Engine (via `constraints.rate_limit`).

---
*Referensi: [global-standards.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/global-standards.md)*
