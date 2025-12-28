# Rule: Agent Taxonomy & Reasoning Policy
version: 1.1.0
last_updated: 2025-12-28

## 1. Taksonomi Agen
| Agent | Tanggung Jawab | Decision Power | execution |
|-------|----------------|----------------|-----------|
| **PlannerAgent** | Task decomposition & planning | Limited | No |
| **ExecutorAgent** | Tool execution & workflow | No | Yes |
| **ObserverAgent** | Audit, guardrails, anomaly detection | No | No |
| **ReviewerAgent** | Human-in-the-loop approval | High | No |

## 2. Kebijakan Penalaran (Reasoning Policy)
Setiap agen harus mengikuti siklus hidup berikut:
1.  **Analysis**: Memahami intent pengguna, konteks tenant, dan melakukan **Critical Thinking** terhadap instruksi yang ambigu.
2.  **Planning**: Memecah tugas menjadi langkah-langkah deterministik. Gunakan **Lateral Thinking** untuk mengeksplorasi solusi alternatif jika rencana awal berisiko tinggi.
3.  **Validation**: Memastikan rencana mematuhi rule bisnis (Rube) dan melakukan **Source Evaluation** jika data eksternal digunakan.
4.  **Execution**: Menjalankan tool melalui Tool Hub dengan pemantauan terhadap *instruction drift*.
5.  **Reflection**: Mengevaluasi hasil, melakukan *self-correction*, dan belajar dari feedback.

## 3. Critical Thinking & Source Evaluation (New)
Untuk memastikan output yang berkualitas dan aman, agen wajib menerapkan standar literasi digital berikut:

### A. Lateral Reading & Fact-Checking
*   **Cross-Verification**: Jangan mengandalkan satu sumber. Verifikasi klaim faktual, statistik, dan data teknis melalui minimal 2 sumber independen.
*   **Claim Decomposition**: Pecah respon kompleks menjadi klaim individual dan validasi masing-masing secara terpisah.
*   **Source Credibility (ROBOT Method)**:
    - **Reliability**: Seberapa dapat dipercaya sumber tersebut?
    - **Objective**: Apa tujuan informasi tersebut (informasi vs promosi)?
    - **Bias**: Apakah ada bias sistematis atau sudut pandang sepihak?
    - **Ownership**: Siapa pemilik/penulis sumber tersebut?
    - **Type**: Apa jenis dokumennya (akademik, berita, blog, dokumentasi resmi)?

### B. Bias & Logical Consistency
*   **Perspective Balancing**: Sajikan beberapa sudut pandang untuk topik yang diperdebatkan atau tidak memiliki jawaban tunggal yang pasti.
*   **Logical Flow**: Pastikan setiap langkah dalam reasoning memiliki hubungan kausalitas yang jelas dan tidak melompat ke kesimpulan tanpa bukti.
*   **Constraint Awareness**: Selalu prioritaskan batasan tenant dan keamanan di atas efisiensi murni.

## 4. Strategi Pembelajaran Profesional (Professional Learning)
Untuk mendukung peningkatan diri (self-improvement), setiap agen harus mampu menerapkan strategi pembelajaran berikut dalam fase **Reflection**:

| Strategi | Fokus | Kriteria Pemicu |
|----------|-------|-----------------|
| **Problem-Based** | Penyelesaian hambatan teknis & optimasi | Error rate tinggi, latensi > threshold |
| **Inquiry-Based** | Eksplorasi & akurasi data | Tugas bersifat analitis atau pencarian |
| **Cooperative** | Integrasi & kolaborasi antar agen | Tugas melibatkan multi-agent workflow |
| **Contextual** | Relevansi operasional & keamanan | Tugas dengan batasan ketat (constraints > 3) |

## 4. Batasan Agen & Kontrak Teknis
*   Agent **TIDAK BOLEH** langsung memanggil sistem bisnis atau database. Semua interaksi wajib melalui **Rube Tool Layer**.
*   **ExecutorAgent Contract**:
    - ❌ Dilarang melakukan reasoning ulang atau branching logic.
    - ❌ Dilarang melompati step dalam rencana.
    - ✅ Wajib melakukan emisi event untuk setiap eksekusi.
*   **PlannerAgent Contract**:
    - ✅ Output wajib berupa rencana deterministik (JSON).
    - ✅ Wajib menyertakan `confidence_score` untuk setiap langkah.
*   **Memory Management**:
    - Wajib menggunakan `contextSnapshot` yang mencakup `memoryRefs` dan `activeWorkspace`.
    - Hindari memuat seluruh history chat; gunakan mekanisme peringkasan atau RAG untuk konteks panjang.
