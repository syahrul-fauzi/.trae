# Test Strategy: SBA-Agentic

Strategi pengujian menyeluruh untuk memastikan kualitas dan keamanan agen AI.

## 1. Piramida Pengujian
- **Unit Tests (70%)**: Validasi logika bisnis rule, skema Zod, dan utility functions.
- **Integration Tests (20%)**: Eksekusi rule terhadap mock DB dan mock API.
- **End-to-End Tests (10%)**: Alur lengkap dari trigger event hingga side-effect di sistem eksternal.

## 2. Pengujian Khusus AI
- **Determinism Testing**: Menjalankan input yang sama berkali-kali untuk memastikan output LLM konsisten (menggunakan `seed`).
- **Safety Red Teaming**: Mencoba melakukan prompt injection atau bypass rule bisnis untuk mengetes ketahanan guardrails.
- **Confidence Scoring Validation**: Memastikan agen meminta bantuan manusia saat skor keyakinan di bawah 0.7.

## 3. Metrik Kualitas (Quality Gates)
- **Minimum Coverage**: 
  - Lines: 80%
  - Functions: 75%
  - Ref: [preset.ts](file:///home/inbox/smart-ai/sba-agentic/tooling/vitest/preset.ts)
- **Success Criteria**: 
  - Side-effect terjadi secara idempotent.
  - Metrik latensi tercatat di sistem observability.
  - Lulus semua pengujian skema YAML.

## 4. Kebijakan Penanganan Kesalahan (Error Handling)
Semua eksekusi rule harus mengikuti kebijakan error handling standar:
- **Retry Mechanism**: Exponential backoff dengan maksimal 3 kali percobaan ulang.
- **Dead Letter Queue (DLQ)**: Setiap kegagalan fatal setelah maksimal retry wajib dikirim ke DLQ untuk investigasi manual.
- **Alerting**: Kegagalan pada rule dengan `priority: critical` wajib memicu alert real-time.

---
*Gunakan `pnpm test` untuk menjalankan seluruh suite pengujian.*
