# RANCANGAN LENGKAP & MENDALAM — `apps/orchestrator` (Workflow Orchestration)

## Tujuan & Fungsi
- Mengelola orkestrasi workflow agentic: scheduling, dependency management, koordinasi antar microservices.

## Fitur Utama
- Workflow engine dengan DAG, scheduler, resource allocation, koordinasi antar layanan (API/tools/workers), failure handling & retries.

## Prasyarat Sistem
- Node.js 20+, PNPM 9+, DB Postgres, queue backend.

## Instalasi & Konfigurasi
- Instal: `pnpm install`, jalankan: `pnpm dev:orchestrator`.
- Env: `DATABASE_URL`, `QUEUE_URL`, `SCHEDULER_INTERVAL`, `RESOURCE_LIMITS`.

## Penggunaan Dasar
- Daftarkan workflow, atur dependencies, jalankan dan pantau event.

## Struktur Direktori
```
apps/orchestrator/
├─ src/workflows/{definitions,runner}
├─ src/scheduler/{cron,dynamic}
├─ src/coordination/{services,adapters}
├─ src/lib/{dag,allocator,retry}
└─ index.ts
```

## Observability
- Tracing eksekusi node; logs per step; metrik SLA (p95/p99, error rate).

## Pengujian
- Unit untuk DAG & scheduler; integration untuk coordination; E2E untuk workflow end-to-end.

## Kontribusi & Lisensi
- PR dengan lint/test hijau; lisensi MIT.

