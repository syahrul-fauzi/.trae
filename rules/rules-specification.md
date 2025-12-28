# Rule Specification: SBA-Agentic

Dokumen ini mendefinisikan standar teknis untuk pembuatan aturan (rules) dalam ekosistem SBA-Agentic. Semua rule wajib diletakkan di `packages/rube/src/rules/` dalam format YAML.

## 1. Hierarki Kategori
Setiap rule harus masuk ke dalam salah satu kategori utama berikut:

### **Business Process Automation (BPA)**
Otomatisasi alur kerja bisnis inti (proses berulang & berbasis aturan).
- **Sub-Kategori**: Approval Workflow, Document Processing, Task Automation.

### **Customer Interaction (CX)**
Manajemen interaksi pelanggan end-to-end & personalisasi pengalaman.
- **Sub-Kategori**: Conversation Management, Omnichannel Notifications, Personalization.

### **Data Analysis & Reporting (DA)**
Pemrosesan data, visualisasi insight, dan laporan otomatis.
- **Sub-Kategori**: Metrics Collection, Dashboards & Visualization, Report Generation.

### **System Integration (SI)**
Konektivitas antar sistem & pertukaran data real-time.
- **Sub-Kategori**: Connectors & Adapters, Event Streaming, Message Queues.

## 2. Format YAML Wajib
Setiap file rule wajib mengikuti struktur berikut:

```yaml
id: "UNIQUE-ID"           # Format: [DOMAIN]-[SUB]-[NN] (Contoh: BPA-APP-01)
name: "Human Readable Name"
trigger:
  events: ["event.name"]  # Nama event sistem
  conditions: ["logic"]   # Ekspresi logika (misal: amount > 500)
  schedule: "cron"        # Opsional (untuk tugas terjadwal)
action:
  steps:
    - op: "tool|api|queue|db"
      ref: "capability_id"
      input: { key: "${dynamic_value}" }
  integration: "@sba/module-name"
constraints:
  validation: ["zod_rules"]
  access_control: ["roles"]
  dependencies: ["services"]
```

## 3. Aturan Penamaan
- **ID Format**: `[DOMAIN]-[SUB]-[NN]`
  - DOMAIN: BPA, CX, DA, SI.
  - SUB: Singkatan sub-kategori (misal: APP untuk Approval).
  - NN: Nomor urut (01, 02, ...).
- **File Name**: `[id].yaml` (Contoh: `BPA-APP-01.yaml`).

## 4. Validasi Data
- Gunakan sintaks `${path.to.variable}` untuk input dinamis.
- Wajib menyertakan `constraints.validation` (Zod schema) untuk mencegah input berbahaya.
- Dilarang keras melakukan hard-code pada data sensitif (PII/Secret).

---
*Referensi: [SBA-Agentic Operational Standard.md](file:///home/inbox/smart-ai/sba-agentic/docs/SBA-Agentic%20Operational%20Standard.md)*
