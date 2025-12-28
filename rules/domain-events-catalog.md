# Domain Events Catalog

Daftar event sistem yang tersedia untuk memicu (trigger) aturan dalam SBA-Agentic.

## 1. Business Process Automation (BPA)
- `approval.pending`: Transaksi atau dokumen memerlukan persetujuan.
- `approval.approved`: Persetujuan telah diberikan.
- `approval.rejected`: Persetujuan ditolak.
- `document.uploaded`: Dokumen baru telah diunggah ke sistem.
- `task.overdue`: Batas waktu tugas telah terlampaui.

## 2. Customer Interaction (CX)
- `message.received`: Pesan baru masuk dari pengguna.
- `intent.detected`: Intent pengguna telah diidentifikasi oleh NLP.
- `feedback.submitted`: Pengguna memberikan rating atau komentar.
- `user.onboarded`: Pengguna baru menyelesaikan proses pendaftaran.

## 3. Data Analysis & Reporting (DA)
- `metric.threshold_exceeded`: Metrik sistem melampaui batas yang ditentukan.
- `report.generated`: Laporan otomatis selesai dibuat.
- `anomaly.detected`: Pola data tidak wajar ditemukan oleh mesin analisis.

## 4. System Integration (SI)
- `integration.connected`: Sistem eksternal (CRM/ERP) berhasil terhubung.
- `sync.completed`: Sinkronisasi data antar sistem selesai.
- `queue.failed`: Pekerjaan dalam antrean gagal dieksekusi.

---
*Gunakan nama event ini dalam field `trigger.events` pada file rule YAML.*
