# Audit Policy
version: 1.1.0
last_updated: 2025-12-28

Kebijakan pencatatan aktivitas untuk keamanan dan transparansi keputusan agen.

## 1. Apa yang Dicatat?
- **Keputusan Agen**: Reasoning Trace lengkap (Analysis -> Reflection) dengan PII masking rekursif ([masking.ts](file:///home/inbox/smart-ai/sba-agentic/packages/security/src/masking.ts)).
- **Eksekusi Rule**: ID Rule, status (Success/Fail), dan durasi.
- **Akses Data**: Siapa yang mengakses data apa dan kapan.
- **Intervensi Manusia**: Catatan persetujuan atau penolakan oleh ReviewerAgent.

## 2. Penyimpanan & Retensi
- Log disimpan dalam tabel `audit_logs` yang terenkripsi.
- Retensi data minimal 1 tahun untuk kepatuhan (compliance).

## 3. Privasi Data
- **Dilarang** mencatat data sensitif (PII) dalam bentuk teks biasa.
- Gunakan hashing atau masking untuk informasi identitas dalam log audit.

---
*Gunakan `@sba/security` untuk melakukan logging audit yang aman.*
