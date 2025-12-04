# RANCANGAN LENGKAP & MENDALAM — `apps/app` (SBA-Agentic UI)

## Gambaran Umum
- Antarmuka proaktif (AG‑UI) untuk berinteraksi dengan agent, workflow, dan knowledge.
- Mendukung chat, command panel, approval flow, dashboard run & integrasi.

## Arsitektur UI
- FSD + Atomic Design; state terstruktur; modul: Chat, Workflow Panel, Approvals, Reports.
- Event stream SSE untuk live timeline; error taxonomy `User/System/ExternalProvider`.

## Integrasi
- Notifikasi ke Slack/Email; impor/ekspor dokumen; akses CRM.

## Keamanan
- Session & MFA via identity provider; scope UI berbasis RBAC; sanitasi konten.

## Observability
- Client tracing → server; performance marks; logging non-PII untuk UI events.

## Pengujian
- Unit & UI tests; Playwright E2E untuk skenario run, approval, dan laporan.

## Deployment
- Build dengan Vite; serve di edge/CDN; CSP ketat; Trusted Types bila tersedia.

## SLO
- TTI p95 ≤ 2.5s; interaksi utama p95 ≤ 250ms dari event stream.

## Roadmap
- Panel otomasi kaya, template laporan, i18n penuh, integrasi formulir.

## Gambar Arsitektur
- PNG arsitektur UI dapat ditambahkan. Simpan di `documents/apps/app/architecture.png` dan tautkan di README.
### Instruksi Penautan
- Gunakan markdown: `![Architecture](./architecture.png)`
- Sumber Mermaid (opsional): `documents/apps/app/architecture.mmd` → render ke PNG `documents/apps/app/architecture.png`.

## Ilustrasi Alur Persetujuan (UI)
```
Notifikasi step → Banner meminta persetujuan → Dialog detail aksi → Tombol Approve/Deny → Kirim ke API → Update timeline live via SSE
```

Contoh payload aksi UI → API:
```json
{
  "runId": "run_abc123",
  "stepId": "step_4",
  "action": "approve",
  "reason": "Data sudah diverifikasi",
  "metadata": {"from": "ui"}
}
```
### Detail Alur & Payload Tambahan
- Tahapan UI yang disarankan:
```
Notifikasi step → Banner persetujuan → Dialog detail aksi (scope, estimasi biaya) → Tombol Approve/Deny → Kirim ke API → Timeline SSE terbarui
```
- Payload aksi UI → API (deny):
```json
{
  "runId": "run_abc123",
  "stepId": "step_4",
  "action": "deny",
  "reason": "Butuh revisi data",
  "metadata": {"from": "ui"}
}
```
## Prasyarat Sistem
- Node.js 20+, PNPM 9+.
- Endpoint API tersedia; kredensial identitas untuk MFA/SSO.

## Instalasi & Konfigurasi
- Instal: `pnpm install`
- Jalankan dev: `pnpm dev`
- Konfigurasi env: URL API, kunci identitas, opsi i18n.

## Penggunaan Dasar
- Jalankan AG‑UI, akses panel workflow, lakukan approval via dialog UI.

## Struktur Direktori
```
apps/app/
├─ src/features/{approval,workflow-panel,chat}
├─ src/entities/{run,event}
├─ src/shared/{ui,utils,hooks}
└─ app.tsx
```

## Kontribusi
- Ikuti pedoman komponen, a11y, dan error taxonomy.

## Lisensi
- MIT
