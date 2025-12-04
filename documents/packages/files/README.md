# File Diskusi Package — Storage & Management

## Tujuan
- Menyediakan sistem manajemen file untuk diskusi: upload/download, preview multi-format, metadata, integrasi cloud, dan keamanan (validasi, malware scan, permissions).

## Fitur Utama
- Upload/download dengan batas ukuran & tipe.
- Preview PDF, gambar, dokumen umum.
- Metadata manajemen (ukuran, tipe, tanggal upload, pemilik).
- Integrasi cloud storage (pluggable adapters).
- Security layer: validasi file, malware scanning, permission checks.

## API Reference
- `uploadFile(file: File, options) => Promise<FileMeta>`
- `downloadFile(id: string) => Promise<ArrayBuffer>`
- `getPreviewUrl(id: string) => Promise<string>`
- `getMetadata(id: string) => Promise<FileMeta>`
- `setPermission(id: string, policy: PermissionPolicy) => Promise<void>`
- `canRead(id: string, userId: string) => boolean`
- `canWrite(id: string, userId: string) => boolean`

## Best Practices
- Validasi di client & server; gunakan antivirus/scan service.
- Idempotensi untuk upload; simpan hash.
- Caching preview & metadata untuk performa.
- Gunakan storage adapter yang mendukung presigned URL.

## Testing
- Unit: adapters, validators, metadata ops.
- Integration: cloud storage end-to-end.
- Coverage target: ≥85%.
- Gunakan `jsdom` untuk kompatibilitas API File di tests.
