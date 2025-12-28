# Release Checklist: Go-Live Ready

Gunakan daftar periksa ini sebelum melakukan deployment ke lingkungan produksi.

## 🏗️ Development & Code
- [ ] Kode telah mengikuti standar `biome.json`.
- [ ] TypeScript Strict Mode aktif dan tidak ada error tipe.
- [ ] Minimal 80% test coverage tercapai.

## 📝 Rule & Logic
- [ ] Rule YAML valid terhadap JSON schema.
- [ ] ID rule mengikuti format `DOMAIN-SUB-NN`.
- [ ] Tidak ada data sensitif (PII/Secret) yang di-hardcode.
- [ ] Kondisi trigger telah diuji untuk berbagai skenario (edge cases).

## 🔐 Security & Multi-tenancy
- [ ] `tenant_id` divalidasi di setiap entry point.
- [ ] RBAC (Role Based Access Control) telah diimplementasikan dengan benar.
- [ ] Audit logging untuk keputusan agen telah aktif.

## 📊 Observability
- [ ] Tracing `@sba/observability` telah terpasang.
- [ ] Alerting thresholds telah dikonfigurasi.
- [ ] Dashboard pemantauan telah diperbarui untuk rule baru.

## 🚀 Deployment
- [ ] Skrip rollback telah disiapkan dan diuji.
- [ ] Feature flag untuk Canary deployment telah dikonfigurasi.

---
*Status: [PENDING/APPROVED]*
