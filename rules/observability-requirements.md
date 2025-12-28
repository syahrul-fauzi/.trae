# Observability Requirements

SBA-Agentic harus dapat dimonitor secara real-time untuk mendeteksi kegagalan agen atau anomali sistem.

## 1. Tracing & Logging
- Gunakan `@sba/observability` untuk melakukan tracing pada setiap eksekusi rule.
- Setiap langkah dalam `ReasoningStep` agen wajib dicatat sebagai span dalam trace.
- Log harus terstruktur (JSON) dan mencakup konteks eksekusi lengkap.

## 2. Metrik Utama (KPI)
- **Success Rate**: Persentase eksekusi rule yang berhasil tanpa error.
- **Latency**: Waktu yang dibutuhkan dari trigger hingga aksi selesai (Target: < 1 detik untuk API).
- **Agent Confidence**: Rata-rata skor keyakinan agen dalam mengambil keputusan.
- **Cost Tracking**: Estimasi biaya penggunaan LLM per tenant.

## 3. Dashboards & Alerts
- Gunakan komponen `AGAnalytics.tsx` untuk visualisasi data real-time.
- **Alerting Thresholds**:
  - Latensi > 1 detik selama 5 menit.
  - Error rate > 0.5% selama 5 menit.
  - Deteksi anomali pada pola pengeluaran atau akses data.

---
*Referensi: [business-domains.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/business-domains.md)*
