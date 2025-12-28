# Logging Convention

Standar format dan struktur log untuk memudahkan debugging dan monitoring.

## 1. Format Log (JSON)
Setiap entri log wajib dalam format JSON dengan struktur:
```json
{
  "timestamp": "ISO8601",
  "level": "INFO | WARN | ERROR",
  "tenant_id": "uuid",
  "rule_id": "optional-id",
  "message": "Deskripsi aktivitas",
  "context": { "key": "value" }
}
```

## 2. Level Logging
- **ERROR**: Kegagalan sistem yang memerlukan tindakan segera.
- **WARN**: Kondisi anomali yang tidak menghentikan proses (misal: retry).
- **INFO**: Jejak operasional normal (misal: rule triggered).
- **DEBUG**: Informasi teknis mendalam untuk pengembangan.

## 3. Masking
Wajib menggunakan utilitas masking untuk menyamarkan Email, Password, dan Token sebelum log dikirim ke log aggregator.

---
*Referensi: [observability-requirements.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/observability-requirements.md)*
