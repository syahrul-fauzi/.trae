# Rule: Business Domain Guidelines (BPA, CX, DA, SI)
version: 1.0.0
last_updated: 2025-12-28

## 1. Business Process Automation (BPA)
*   **Approval Workflow**: Gunakan sistem persetujuan multi-level. Gunakan `workflow.escalate_request` untuk eskalasi otomatis.
*   **Document Processing**: Wajib menggunakan OCR/NLP via `document.extract_data`. Validasi skema output adalah wajib.
*   **Task Automation**: Gunakan BullMQ via `worker.*` untuk tugas latar belakang. Implementasikan retry mechanism dengan exponential backoff.

## 2. Customer Interaction (CX)
*   **Conversation Management**: Gunakan context window management.
*   **Omnichannel**: Gunakan `notification.send_email` (Resend) dan `notification.send_push`.
*   **Personalization**: Respon harus disesuaikan dengan profil tenant via `tenant-context-contract`.

## 3. Data Analysis & Reporting (DA)
*   **Metrics**: Agregasi data real-time via `@sba/observability`.
*   **Reporting**: Gunakan `analytics.generate_report` untuk ekspor PDF/CSV.

## 4. System Integration (SI)
*   **Connectors**: Integrasi CRM (`crm.create_lead`) dan ERP (`erp.sync_inventory`) wajib melalui adapter dengan rate limiting.
*   **Database Ops**: Gunakan `db.upsert_record` dan `db.soft_delete` untuk konsistensi data.
*   **Message Queues**: Pekerjaan berat wajib masuk antrean via `op: queue`.
