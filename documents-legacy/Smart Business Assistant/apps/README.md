# Apps — Arsitektur & Integrasi

## Apps Utama
- web (Next.js + FSD + Atomic)
- api (NestJS Orchestrator)
- worker (BullMQ jobs)
- marketing/docs (Next.js/Vite)

## Catatan
- Hanya impor dari `packages/*`
- Transpile internal packages bila diperlukan (Next.js `transpilePackages`)
