# Rule: Feedback Loop & Self-Learning Enhancement
version: 1.1.0
last_updated: 2025-12-28

## 1. Mekanisme Feedback
*   **User Feedback**: Tangkap feedback eksplisit (rating/comment) dan implisit (correction) dari pengguna di AG-UI.
*   **Correction Loop**: Jika ReviewerAgent atau manusia melakukan koreksi, data tersebut wajib masuk ke dataset fine-tuning atau RAG context untuk iterasi berikutnya.

## 2. Self-Learning Guidelines
*   **Performance Tracking**: ObserverAgent harus mencatat performa setiap agent (success rate, cost, latency).
*   **External Knowledge Monitoring**: Agen wajib memantau perkembangan informasi terbaru dari sumber eksternal (web search) untuk memperbarui konteks tugas.
*   **Information Extraction**: Gunakan teknik ekstraksi informasi yang sistematis (Starting -> Chaining -> Browsing -> Differentiating -> Monitoring -> Extracting) untuk memastikan validitas data eksternal.
*   **Dynamic Prompting**: Sesuaikan prompt sistem berdasarkan history performa, feedback tenant-specific, dan insight baru dari pencarian web.
*   **Drift Detection**: Deteksi penurunan kualitas respon agent secara berkala dan picu retraining atau update knowledge base (CMS).

## 3. Continuous Improvement
*   **Weekly Review**: Lakukan review otomatis terhadap kegagalan agent yang paling sering terjadi.
*   **Knowledge Update**: Update SOP di CMS jika ditemukan pola kegagalan yang disebabkan oleh informasi usang.
