# Rule: Rube YAML Rules Standards
version: 1.0.0
last_updated: 2025-12-28

## 1. Skema Wajib YAML
Setiap file rule di `packages/rube/src/rules/*.yaml` wajib mengikuti struktur berikut:

```yaml
id: "UNIQUE-ID"
name: "Human Readable Name"
trigger:
  events: ["event.name"]
  conditions: ["logic_expression"]
action:
  steps:
    - op: "tool|api|queue|db"
      ref: "capability_id"
      input: { key: "${dynamic_value}" }
  integration: "@sba/module-name"
constraints:
  validation: ["zod_or_logic_rules"]
  access_control: ["role:name"]
  dependencies: ["service_name"]
```

## 2. Aturan Penamaan & Organisasi
*   **ID Format**: Gunakan format `[DOMAIN]-[SUB]-[NN]` (Contoh: `BPA-APP-01`).
*   **Domain**: BPA (Business Process), CX (Customer), DA (Data Analysis), SI (System Integration).
*   **File Location**: Wajib diletakkan di `packages/rube/src/rules/`.

## 3. Validasi & Pengujian
*   Semua input dinamis wajib menggunakan sintaks `${path.to.variable}`.
*   Wajib menyertakan `constraints.validation` untuk mencegah input berbahaya atau tidak valid.
*   Gunakan `constraints.access_control` untuk membatasi eksekusi berdasarkan RBAC.

## 4. Keamanan Data (PII)
*   Dilarang keras menyertakan data sensitif (password, token, PII) secara hard-coded dalam YAML.
*   Gunakan referensi environment variable atau vault jika diperlukan.
