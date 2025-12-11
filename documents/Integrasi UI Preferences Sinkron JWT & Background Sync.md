## Deteksi & Bootstrapping
- Periksa JWT saat mount komponen: ambil dari cookie/session atau header Authorization yang tersedia.
- Jika token ada dan valid: panggil `GET /api/preferences` dengan headers `Authorization: Bearer <JWT>` dan `x-user-id`.
- Validasi response (statusCode=200, data bentuk benar) sebelum mengisi state.

## State Management
- Buat `PreferencesContext` (atau Redux slice) yang menyimpan: `cachePolicy`, `intervalMs`, `annotations`, `revision`, `updatedAt`.
- Expose hooks: `usePreferences()` dan `useUpdatePreferences()` untuk konsumsi komponen UI.
- Persist fallback ke local storage, namun override oleh server jika tersedia.

## Update & Sinkronisasi
- Deteksi perubahan UI (cache policy, interval, annotations) melalui handler di Context/Slice.
- Kirim `PUT /api/preferences` dengan payload tervalidasi, menyertakan `revision` (optimistic locking).
- On success (200): terapkan revision baru; on `409 conflict`: tarik data server, lakukan resolusi (pilih server atau merge anotasi bila memungkinkan), retry terkontrol.
- Enkripsi sisi klien (opsional) via WebCrypto AES-GCM pada field sensitif (mis. anotasi deskripsi), fallback plaintext di HTTPS bila WebCrypto tidak tersedia.

## Background Sync
- Polling berkala: setiap 5 menit panggil `GET /api/preferences` untuk mendeteksi perubahan dari perangkat lain; jika `revision` lebih tinggi, sync ke UI.
- WebSocket/SSE (opsional): jika endpoint real-time tersedia, subscribe ke channel `preferences:<userId>` untuk menerima event perubahan; update state saat event masuk.
- Versioning: gunakan `revision` dari server untuk mencegah overwrite; terapkan merge rules sederhana (server-wins untuk preferensi scalar, merge-by-ts untuk anotasi).

## Keamanan
- Sertakan JWT selalu di header Authorization; tambahkan `x-user-id`.
- Validasi semua response server (struktur dan tipe) sebelum apply ke UI.
- Hindari menyimpan JWT di local storage; gunakan httpOnly cookies atau runtime session; jika token tidak ada/invalid, jatuhkan ke local-only mode.
- Rate-limit di klien (debounce PUT), dan hormati header rate-limit dari server.

## Error Handling
- Notifikasi non-blocking (toast/banner) saat sinkronisasi gagal; tetap layani UI.
- Opsi retry manual (tombol) + retry otomatis dengan backoff untuk error transient.
- Fallback ke cache lokal jika server tidak tersedia; tag UI dengan status cached/live (sudah tersedia di widget).

## Pengujian
- Unit & integration:
  - Success end-to-end: mount dengan JWT, GET prefs mengisi state, perubahan UI memicu PUT dan respon 200.
  - Enkripsi/dekripsi: stub WebCrypto; verifikasi payload terenkripsi dan decode server (mock).
  - Konflik revisi: PUT dengan revision lama → 409; resolusi dengan fetch server dan apply merge; retry berhasil.
  - Payload invalid: tipe salah, field kosong, limit anotasi terlampaui → 400; UI menampilkan error.
  - Polling 5 menit: mock timer; state tersinkron saat server revision naik.

## Dokumentasi
- Tambah dokumen di `docs/SECURITY_ENDPOINTS.md` dan OpenAPI untuk `/api/preferences`: auth, rate-limit, response, error scenarios.
- Update README bagian sinkronisasi preferensi dan UX.

## Implementasi Bertahap
1) Tambah Context/Slice & hooks; wiring di dashboard.
2) Implement client util untuk GET/PUT dengan JWT; integrasikan enkripsi opsional.
3) Tambah polling (5 menit) dan resolusi konflik.
4) Unit tests pada route & UI; integration untuk sinkronisasi dan konflik.
5) Dokumentasi & contoh penggunaan di UI.

Siap eksekusi: setelah konfirmasi, saya akan menambahkan Context, hooks, util auth, wiring di widget, polling & resolusi konflik, test, dan dokumentasi terkait.