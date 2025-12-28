# Tenant Context Contract

Kontrak data yang mendefinisikan informasi minimum yang harus ada dalam konteks eksekusi untuk setiap tenant.

## 1. Skema Konteks Tenant
Setiap request atau event wajib membawa objek `tenantContext`:

```json
{
  "tenant_id": "uuid-v4",
  "config": {
    "tier": "free | pro | enterprise",
    "region": "id-west-1",
    "features": ["bpa-enabled", "cx-advanced"]
  },
  "metadata": {
    "org_name": "Nama Perusahaan",
    "timezone": "Asia/Jakarta"
  }
}
```

## 2. Aturan Penggunaan
1. **Isolasi**: Agen wajib menggunakan `tenant_id` untuk setiap filter kueri.
2. **Quota**: Cek `config.tier` sebelum menjalankan aksi yang memakan biaya tinggi (misal: Deep Analysis).
3. **Localization**: Gunakan `metadata.timezone` untuk penjadwalan rule (`schedule`).

## 3. Validasi
Kegagalan dalam menyertakan `tenant_id` yang valid akan memicu `SecurityException` dan menghentikan seluruh proses eksekusi.

---
*Referensi: [security-and-multitenancy.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/security-and-multitenancy.md)*
