# Runtime Integration Points

Dokumen ini memetakan titik integrasi teknis antara agen AI, mesin aturan (Rule Engine), dan layanan sistem.

## 1. Titik Integrasi Utama

| Komponen | Lokasi Kode / File | Deskripsi |
| --- | --- | --- |
| **Workflow Engine** | [workflow-run.tool.yaml](file:///home/inbox/smart-ai/sba-agentic/packages/rube/src/tools/workflow/workflow-run.tool.yaml) | Eksekutor utama untuk alur kerja berbasis rule. |
| **Worker Service** | [WorkerModule.ts](file:///home/inbox/smart-ai/sba-agentic/apps/api/src/workers/WorkerModule.ts) | Manajemen antrean (BullMQ) untuk tugas latar belakang. |
| **Queue Docs** | [QUEUE.md](file:///home/inbox/smart-ai/sba-agentic/apps/api/QUEUE.md) | Dokumentasi daftar antrean dan tipe pekerjaan. |
| **Real-time Gateway** | [AgentStreamGateway.ts](file:///home/inbox/smart-ai/sba-agentic/apps/api/src/api/gateway/AgentStreamGateway.ts) | Gateway WebSocket untuk streaming respons agen ke UI. |
| **Analytics UI** | [AGAnalytics.tsx](file:///home/inbox/smart-ai/sba-agentic/packages/ui/src/ag-ui/components/AGAnalytics.tsx) | Komponen visualisasi metrik dan performa agen. |

## 2. Kontrak Eksekusi (Rule Executor)
Setiap eksekusi rule wajib mengikuti pola standar `RuleExecutor` di TypeScript:
1. **Validation**: Cek constraints (RBAC & Data).
2. **Execution**: Jalankan aksi (API/Tool/Queue).
3. **Audit**: Catat hasil eksekusi ke sistem audit.
4. **Observability**: Kirim metrik sukses/gagal dan latensi.

## 3. Konfigurasi Dinamis & Rollout
- **Admin Dashboard**: Parameter rule (timeout, threshold) dapat diubah melalui dashboard tanpa redeploy sistem.
- **Feature Flags**: Gunakan flag untuk rollout rule baru secara bertahap menggunakan strategi **Canary Release**.
- **Hot Reload**: Rule YAML baru yang di-upload ke sistem akan dimuat secara otomatis oleh Rube Engine.

---
*Terakhir diperbarui: 2025-12-28*
