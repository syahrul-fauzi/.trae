ADR-004 — ErrorModel & Kontrak Tools API

Status: Accepted

Konteks
- Tools API digunakan oleh AG-UI Orchestrator dan klien untuk operasi knowledge, render, dan task.
- Konsistensi penanganan error diperlukan agar klien dapat mengimplementasikan retry, fallback, dan UX yang tepat.

Keputusan
- Mengadopsi model error terpadu `ErrorModel` di OpenAPI:
  - `success: boolean`, `code: enum`, `message: string`, `retryable: boolean`, `payload: object`
  - Kode: `TOOL_ERROR`, `RATE_LIMIT`, `NOT_FOUND`, `BAD_REQUEST`, `CONFLICT`, `UNAVAILABLE`
- Menambahkan responses error terstandardisasi untuk endpoint `getDocument`, `renderDocument`, `createTask`.
- Menyediakan contoh payload sukses dan error untuk meningkatkan kualitas SDK/dokumentasi.

Konsekuensi
- Klien dapat mengimplementasikan strategi `retry` berbasis `retryable` dan menangani konflik idempotensi.
- Contract tests perlu memverifikasi bentuk payload error vs `ErrorModel`.
- Observability dapat mengkategorikan error berdasarkan `code` untuk metrik/alerting.
