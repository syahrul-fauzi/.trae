# Quality Gates

Ambang batas kualitas yang harus dipenuhi sebelum kode atau rule dapat dideploy.

## 1. Automated Gates (CI)
- **Linting**: 0 errors dari `biome check`.
- **Unit Tests**: Pass 100%, coverage > 80%.
- **Schema**: Validasi YAML terhadap JSON schema sukses.
- **Build**: Proses build `@sba/api` dan `@sba/ui` berhasil.

## 2. AI Specific Gates
- **Determinism Check**: Output LLM konsisten dalam 3 kali percobaan.
- **Safety Scan**: Tidak ada prompt injection terdeteksi dalam rule baru.

## 3. Manual Gates (Peer Review)
- Review oleh minimal 1 Senior Engineer.
- Validasi oleh Domain Expert (untuk rule bisnis yang kompleks).

---
*Referensi: [ci-cd-validation.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/ci-cd-validation.md)*
