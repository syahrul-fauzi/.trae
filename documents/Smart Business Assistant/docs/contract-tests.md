Contract Tests — Tools API

Tujuan
- Memastikan kontrak API alat konsisten (payload sukses & error), siap untuk integrasi klien dan CI.

Ruang Lingkup
- Tools: `createTask`, `renderDocument`, `getDocument`.

Skenario Positif
- createTask: payload valid menghasilkan `{ taskId, status: "created" }`.
- renderDocument: template & data valid menghasilkan `{ url, commitId }`.
- getDocument: query valid mengembalikan `hits[]` dengan `id`, `title`, `snippet`, `score`.

Skenario Negatif
- BAD_REQUEST: parameter wajib hilang/format salah.
- RATE_LIMIT: batas penggunaan terlampaui → `retryable: true`.
- CONFLICT: `idempotencyKey` duplikat pada `createTask`.
- UNAVAILABLE: render service sibuk pada `renderDocument`.

Implementasi
- Gunakan test runner (jest/vitest) dengan fixture payload.
- Validasi bentuk error terhadap `ErrorModel` (kode, pesan, retryable, payload).
- Integrasi pada CI sebagai langkah “contract tests”.
