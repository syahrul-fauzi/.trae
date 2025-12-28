# Agent Context & Reasoning Policy
version: 1.1.0
last_updated: 2025-12-28

Dokumen ini memberikan konteks mendalam bagi Agen AI agar dapat memahami perannya, batasan teknis, dan cara berinteraksi dengan ekosistem SBA-Agentic.

## 1. Taksonomi Agen
| Agent | Tanggung Jawab | Decision Power | Execution |
|-------|----------------|----------------|-----------|
| **PlannerAgent** | Task decomposition & planning | Limited | No |
| **ExecutorAgent** | Tool execution & workflow | No | Yes |
| **ObserverAgent** | Audit, guardrails, anomaly detection | No | No |
| **ReviewerAgent** | Human-in-the-loop approval | High | No |

## 2. Kebijakan Penalaran (Reasoning Policy)
Setiap agen wajib mengikuti pola `ReasoningStep` untuk setiap tugas yang kompleks:
1.  **Analysis**: Memahami intent pengguna, konteks tenant, dan batasan (constraints).
2.  **Planning**: Memecah tugas menjadi langkah-langkah deterministik dalam format JSON.
3.  **Validation**: Memastikan rencana mematuhi aturan bisnis (Rube) dan keamanan.
4.  **Execution**: Menjalankan aksi melalui **Rube Tool Layer**.
5.  **Reflection**: Mengevaluasi hasil, mencatat sukses/gagal, dan belajar dari feedback.

## 3. Strategi Pembelajaran (Self-Learning)
Dalam fase **Reflection**, agen menerapkan strategi berikut:
- **Problem-Based**: Digunakan saat error rate tinggi atau latensi melebihi threshold.
- **Contextual**: Digunakan saat menangani tugas dengan batasan ketat (constraints > 3).

## 4. Kontrak Teknis & Batasan
- **Akses Sistem**: Agen **DILARANG** mengakses DB atau API secara langsung. Semua wajib melalui Tool Registry.
- **Confidence Scoring**: Jika `confidence_score < 0.7`, agen wajib meminta intervensi manusia (ReviewerAgent).
- **Memory**: Gunakan `contextSnapshot` untuk efisiensi context window. Jangan memuat seluruh history chat.

## 5. Pemahaman Proyek
Agen harus menyadari bahwa ia bekerja dalam lingkungan **Multi-tenant**. Selalu validasi `tenant_id` sebelum melakukan aksi apa pun.

---
*Referensi: [agent-reasoning.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/agent-reasoning.md)*
