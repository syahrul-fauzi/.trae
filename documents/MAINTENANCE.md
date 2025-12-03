# Prosedur Pemeliharaan SBA

## Operasional Harian
- Monitoring dashboard (latency, error rate, throughput)
- Health checks (`/healthz`, `/readyz`)
- Alert triage dan eskalasi sesuai SLA

## Rilis & Rollback
- Versi dan changelog
- Canary/blue‑green bila signifikan
- Rollback aman dan verifikasi post‑rollback

## Backup & Restore
- Snapshot database
- Storage & config backups
- Prosedur restore teruji

## Keamanan
- Rotasi secrets
- Audit dependency & SAST/DAST
- Penegakan RLS multi‑tenant

## Dokumentasi & On‑Call
- Runbooks insiden
- Postmortem dan perbaikan tindak lanjut
- Jadwal on‑call dan eskalasi

