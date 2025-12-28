# Metrics Definition

Daftar metrik teknis dan bisnis yang dipantau dalam SBA-Agentic.

## 1. Metrik Performa (SLI/SLO)
- **API Latency**: Target P95 < 500ms.
- **Rule Execution Success Rate**: Target > 99.5%.
- **Queue Wait Time**: Target < 2 detik.

## 2. Metrik Agen AI
- **Reasoning Accuracy**: Tingkat keberhasilan rencana yang dibuat PlannerAgent.
- **Token Usage**: Jumlah token LLM yang dikonsumsi per tenant.
- **Confidence Distribution**: Sebaran skor keyakinan agen.

## 3. Metrik Bisnis
- **Automation Rate**: Persentase tugas yang diselesaikan tanpa intervensi manusia.
- **Time Saved**: Estimasi waktu yang dihemat melalui otomatisasi.

---
*Visualisasi metrik tersedia di dashboard `AGAnalytics.tsx`.*
