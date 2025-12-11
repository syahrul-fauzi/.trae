# Spesifikasi Teknis — RBAC Guard (Web)

## Tujuan
- Guard terpusat untuk operasi sensitif dengan sinkronisasi kebijakan dari App
- Audit log terstruktur dan caching untuk performa optimal
- Validasi izin berbasis role dan atribut; fallback offline

## Arsitektur
- Policy source: `apps/app/src/shared/config/rbac.ts`
- Guard wrapper: `packages/security/src/rbac.ts` → `withRBAC(handler, { resource, action })`
- Audit log: hook pada operasi kritis (runs/agents/settings) dengan payload standar
- Caching: cache policy mapping dan refresh berkala

## Sinkronisasi Kebijakan
- Endpoint/payload policy dari App (JSON) → konsumsi Web; fallback ke snapshot lokal
- Penegakan izin: izin disusun `resource:action` (mis. `run:create`, `agent:run`, `analytics:read`)

## Validasi & Fallback
- Jika policy tidak tersedia (offline), fallback ke mode read-only untuk resource sensitif
- Audit log tetap berjalan, menandai `fallback=true`

## Integrasi
- Tambahkan `withRBAC` ke route Web sensitif (tools proxy, admin, metrics)
- Logging audit: simpan ke endpoint audit App atau log sink terpisah

## Pengujian
- Unit: izin per role, inheritance, dan penolakan akses yang benar
- Integrasi: uji akses route dengan role/tanpa role; verifikasi audit
