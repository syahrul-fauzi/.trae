# Incident Response

Prosedur standar penanganan insiden pada sistem SBA-Agentic.

## 1. Klasifikasi Insiden
- **P0 (Critical)**: Seluruh sistem down atau kebocoran data multi-tenant.
- **P1 (High)**: Kegagalan pada domain rule utama (BPA/CX).
- **P2 (Medium)**: Penurunan performa atau error pada metrik minor.

## 2. Alur Penanganan
1. **Detection**: Alert dipicu oleh `observability-requirements`.
2. **Containment**: Matikan rule/fitur bermasalah menggunakan feature flag.
3. **Recovery**: Lakukan rollback atau hotfix.
4. **Analysis**: Buat Post-Mortem (Root Cause Analysis).

## 3. Kontak Darurat
- **On-call Engineer**: Lihat jadwal di PagerDuty.
- **SRE Team**: Slack channel `#sba-ops-emergency`.

---
*Gunakan `pnpm ops:status` untuk mengecek kesehatan sistem.*
