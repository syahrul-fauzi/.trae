# CI/CD Validation & Quality Gates

Setiap perubahan pada rule atau kode sistem wajib melewati proses validasi otomatis sebelum di-merge ke branch utama.

## 1. Quality Gates
- **Linting**: Wajib lulus pengecekan `biome check`.
- **Testing**: 
  - Minimal coverage: 80% Lines, 75% Functions.
  - Wajib lulus Determinism Tests untuk output LLM.
- **Schema Validation**: Semua file YAML di `packages/rube/src/rules/` wajib valid terhadap `rule.schema.json`.

## 2. Pipeline Tahapan
1. **Validate**: Cek format file dan skema YAML.
2. **Test**: Jalankan unit dan integration tests.
3. **Security Scan**: Cek adanya hard-coded secrets atau potensi injection.
4. **Dry Run**: Simulasi eksekusi rule dalam lingkungan sandbox.

## 3. Rollout Strategy
Gunakan **Canary Release** melalui feature flags untuk membatasi dampak jika terjadi kegagalan pada rule baru.

---
*Referensi: [ops-and-lifecycle.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/ops-and-lifecycle.md)*
