# Action Handlers Catalog
version: 1.1.0
last_updated: 2025-12-28

Daftar kapabilitas (capabilities) dan handler yang dapat dipanggil sebagai aksi (`action.steps`) dalam SBA-Agentic.

## 1. Workflow & Task (`op: tool`)
- `workflow.escalate_request`: Mengirim permintaan eskalasi ke manajer.
- `workflow.approval_request`: Menginisialisasi alur persetujuan baru.
- `document.extract_data`: Menjalankan OCR/NLP pada dokumen.
- `notification.send_email`: Mengirim email melalui provider (Resend).
- `notification.send_push`: Mengirim notifikasi push ke aplikasi mobile.
- `support.route_to_department`: Mengarahkan tiket/pesan ke departemen tertentu.
- `cx.customer_profile`: Mengambil profil lengkap pelanggan dari database.
- `agent.personalize_response`: Menyesuaikan respon agen berdasarkan profil dan konteks.
- `knowledge.search`: Melakukan pencarian informasi dari sumber eksternal (web search).
- `knowledge.extract`: Mengekstraksi informasi secara sistematis dari hasil pencarian.

## 2. API & Integration (`op: api`)
- `crm.create_lead`: Membuat entry lead baru di CRM eksternal.
- `erp.sync_inventory`: Sinkronisasi data stok dengan ERP.
- `analytics.generate_report`: Memicu pembuatan laporan data.

## 3. Queue & Worker (`op: queue`)
- `worker.process_image`: Memproses gambar di latar belakang.
- `worker.bulk_import`: Mengimpor data dalam jumlah besar.

## 4. Database (`op: db`)
- `db.upsert_record`: Menambah atau memperbarui record di database.
- `db.soft_delete`: Melakukan penghapusan logis pada data.

---
*Gunakan referensi ID ini dalam field `action.steps[].ref` pada file rule YAML.*
