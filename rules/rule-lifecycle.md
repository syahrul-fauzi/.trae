# Rule Lifecycle & Management

Dokumen ini menjelaskan tahapan alur hidup sebuah aturan (rule) di SBA-Agentic, mulai dari ideasi hingga penghentian (deprecation).

## 1. Tahapan Alur Hidup

### **A. Development (Draft)**
- Rule dibuat menggunakan template di `rule-templates/`.
- Validasi lokal menggunakan skema Zod.
- Unit testing untuk logika trigger dan aksi.

### **B. Validation (Staging)**
- Rule divalidasi melalui pipeline CI (`pnpm docs:validate`).
- Pengujian determinisme untuk memastikan output LLM konsisten.
- Peninjauan keamanan (PII masking dan RBAC).

### **C. Deployment (Production)**
- Menggunakan strategi **Canary Deployment** (5% -> 25% -> 100%).
- Monitoring latensi dan error rate melalui `@sba/observability`.

### **D. Maintenance & Monitoring**
- Peninjauan berkala terhadap performa (success rate).
- Update versi jika ada perubahan logika bisnis.

### **E. Deprecation**
- Rule yang tidak lagi relevan ditandai sebagai `deprecated`.
- Migrasi ke rule baru jika diperlukan sebelum penghapusan total.

## 2. Kebijakan Versi (Versioning)
- Gunakan **SemVer** (v1.0.0).
- **Major**: Perubahan skema yang merusak (breaking changes).
- **Minor**: Penambahan fitur atau aksi baru.
- **Patch**: Perbaikan bug atau optimasi tanpa merubah fungsionalitas utama.

## 3. Rollback Plan
Setiap release rule wajib memiliki skrip rollback. Jika error rate > 0.5% selama 5 menit, sistem akan otomatis melakukan rollback ke versi stabil sebelumnya.

---
*Referensi: [ops-and-lifecycle.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/ops-and-lifecycle.md)*
