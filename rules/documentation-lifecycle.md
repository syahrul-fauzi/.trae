# Rule: Documentation Lifecycle & Self-Evolution
version: 1.1.0
last_updated: 2025-12-28

## 1. Prinsip Dokumentasi Agentic
Dokumentasi dalam SBA-Agentic bukan sekadar teks statis, melainkan bagian dari memori kolektif sistem yang harus berkembang seiring dengan perubahan kode dan insight baru.

## 2. Siklus Hidup Dokumentasi
Setiap perubahan signifikan pada kode (fitur baru, refactoring, perubahan API) wajib diikuti oleh update dokumentasi melalui langkah-langkah berikut:

### A. Deteksi Perubahan (Detection)
- Agen wajib mendeteksi jika perubahan kode yang dilakukan mempengaruhi alur kerja, skema data, atau standar operasional yang terdokumentasi.
- Gunakan `grep` atau `SearchCodebase` untuk mencari referensi dokumen yang terkait dengan simbol atau modul yang diubah.

### B. Sinkronisasi Otomatis (Synchronization)
- Jika ditemukan ketidakkonsistenan antara kode dan dokumen, agen harus mengajukan edit pada dokumen terkait.
- Pastikan referensi silang (link) tetap valid setelah perubahan.
- Update field `last_updated` pada setiap file yang dimodifikasi.

### C. Evolusi Mandiri (Self-Evolution)
- **Insight Integration**: Masukkan pelajaran baru dari fase `Reflection` (lihat [agent-reasoning.md](./agent-reasoning.md)) ke dalam dokumen panduan atau FAQ.
- **Drift Mitigation**: Jika standar operasional (SOP) tidak lagi relevan dengan implementasi teknis terbaru, agen wajib mengusulkan revisi SOP di `docs/SBA-Agentic Operational Standard.md`.
- **Reflection Template**: Gunakan format berikut saat memperbarui dokumen setelah tugas:
    - *Apa yang dipelajari?* (Pola baru, batasan teknis, insight domain).
    - *File mana yang terdampak?* (Cross-references).
    - *Apa yang perlu diperbarui?* (SOP, FAQ, Handbook).

## 3. Aturan Penulisan untuk Agen
- **Clickable Links**: Selalu gunakan format link Markdown yang valid untuk referensi antar file.
- **Hierarchical Clarity**: Gunakan heading yang terstruktur dan daftar bullet untuk meningkatkan keterbacaan (scannability).
- **Language Consistency**: Gunakan Bahasa Indonesia untuk penjelasan naratif dan Bahasa Inggris untuk istilah teknis yang sudah baku.

## 4. Mekanisme Verifikasi
- Setiap update dokumentasi harus diverifikasi melalui `ls` atau `Read` untuk memastikan struktur folder dan konten tetap konsisten dengan [INDEX.md](../docs/INDEX.md).
- Dokumentasikan setiap perubahan besar dalam [CHANGELOG.md](./CHANGELOG.md).

---
*Referensi: [README.md](./README.md), [INDEX.md](../docs/INDEX.md)*
