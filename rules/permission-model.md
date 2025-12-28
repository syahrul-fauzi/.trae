# Permission Model (RBAC)

Model kontrol akses berbasis peran untuk ekosistem SBA-Agentic.

## 1. Daftar Peran (Roles)
- **System Admin**: Akses penuh ke seluruh rule, konfigurasi tenant, dan audit logs.
- **Tenant Admin**: Mengelola rule dan melihat metrik khusus untuk tenant mereka.
- **Agent**: Hanya dapat mengeksekusi tool yang diizinkan dan membaca konteks yang relevan.
- **Auditor**: Akses baca-saja ke audit logs dan Reasoning Traces.

## 2. Matriks Akses
| Resource | System Admin | Tenant Admin | Agent |
| --- | --- | --- | --- |
| Create Rule | ✅ | ✅ | ❌ |
| Execute Tool | ✅ | ✅ | ✅ |
| View Audit Logs | ✅ | ✅ | ❌ |
| Delete Tenant | ✅ | ❌ | ❌ |

## 3. Implementasi
- Gunakan Supabase RLS untuk isolasi data di level DB.
- Validasi peran dilakukan melalui JWT Claims pada setiap request API.

---
*Referensi: [security-and-multitenancy.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/security-and-multitenancy.md)*
