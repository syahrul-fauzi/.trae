# Rule: Operations, Lifecycle & Production Readiness
version: 1.0.0
last_updated: 2025-12-28

## 1. Quality Assurance (QA)
*   **Testing Coverage**: Minimal 80% Lines, 75% Functions ([preset.ts](file:///home/inbox/smart-ai/sba-agentic/tooling/vitest/preset.ts)).
*   **Determinism Tests**: Uji output LLM menggunakan seed yang konsisten.
*   **Rule Validation**: Setiap rule YAML baru di `packages/rube` wajib melewati skema validasi Zod sebelum di-merge.

## 2. Monitoring & Alerting
*   **Observability**: Gunakan `@sba/observability` untuk tracing setiap eksekusi rule.
*   **Anomaly Detection**: Pemicu alert jika latensi API > 1 detik atau error rate > 0.5% selama 5 menit.
*   **Audit Trail**: Simpan semua jejak keputusan agen untuk replay dan investigasi.

## 3. Deployment & CI/CD
*   **Pipeline**: Gunakan pipeline khusus untuk validasi rule (`pnpm docs:validate`).
*   **Rollout Strategy**: Gunakan Canary Deployment (5% -> 25% -> 100%).
*   **Rollback Plan**: Setiap release wajib memiliki skrip rollback untuk state database dan konfigurasi rule.

## 4. Performance & Stress Testing
*   **Benchmark**: Lakukan stress testing pada Rube Tool Layer untuk memastikan throughput yang stabil di bawah beban tinggi.
*   **KPI Monitoring**: Pantau dampak rule terhadap metrik bisnis (misal: waktu penyelesaian approval, tingkat keberhasilan otomatisasi).
