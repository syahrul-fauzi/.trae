# Target
- Menambahkan invalidasi cache untuk operasi PATCH/DELETE pada workflows dan notifications, konsisten dengan POST/PUT yang sudah diterapkan.
- Menjalankan invalidasi secara asynchronous (fire-and-forget) pasca sukses mutasi, dengan logging, fallback, dan penanganan error robust.
- Menyediakan unit/integrasi tests untuk verifikasi cache terhapus, tanpa side effects, dan konsistensi dengan mutasi lainnya.

# Desain Teknis
- Skema key tetap: `tenant:{tid}:{domain}:{hash}`; domain: `workflows`, `notifications`.
- Prefix invalidasi:
  - Workflows: `tenant:{tid}:workflows:` (termasuk data turunan seperti steps → gunakan prefix domain utama karena GET menggunakan path/params; bila ada cache khusus turunan, gunakan sub-prefix `workflows:steps:`).
  - Notifications: `tenant:{tid}:notifications:` (termasuk referensi terkait seperti unread counts).
- Helper invalidasi:
  - Redis: gunakan `scanDeleteByPrefix(prefix)` (SCAN + DEL, COUNT 100) untuk atomic per key; dieksekusi asynchronous dengan `Promise.allSettled`.
  - In-memory: `invalidateByPrefix(prefix)` yang menghapus keys berawalan prefix.
- Titik integrasi:
  - Workflows: `apps/app/src/app/api/workflows/[id]/route.ts` (PATCH, DELETE) → panggil invalidasi setelah operasi sukses; gunakan tenant dari sesi/DB.
  - Notifications: `apps/app/src/app/api/notifications/[id]/route.ts` (PATCH, DELETE) dan `apps/app/src/app/api/notifications/route.ts` (PATCH) → panggil invalidasi prefix; referensi unread counts otomatis akan dicache ulang.
- Asynchronous & Robustness:
  - Jalankan invalidasi setelah mengirim respons (non-blocking fire-and-forget) atau segera sebelum return dengan `await Promise.resolve().then(...)` tanpa menunda respons.
  - try/catch seluruh proses; log jumlah keys terhapus, durasi, dan prefix; fallback ke in-memory bila client Redis tidak tersedia.

# Unit/Integrasi Tests
- Workflows PATCH/DELETE:
  - Buat item workflow, GET cache → hit; lalu PATCH/DELETE; GET berikutnya → miss (cache invalidated).
  - Verifikasi tidak ada perubahan schema respons dan tidak ada side effects.
- Notifications PATCH/DELETE:
  - Buat notification, GET cache → hit; PATCH mark read / DELETE; GET berikutnya → miss; unread count ikut diperbarui.
- Fallback & Error Handling:
  - Mock Redis tidak tersedia → pakai in-memory invalidasi; tests memverifikasi tetap miss.
  - Simulasikan error SCAN/DEL → proses tidak melempar ke klien; logging muncul.

# Observabilitas (opsional)
- Tambah business counters untuk invalidasi: `sba_cache_invalidations_total{domain,tenant}`.
- Rekam durasi invalidasi untuk audit.

# Performa & Konsistensi
- Invalidasi non-blocking untuk menjaga latensi mutasi.
- Konsistensi data: semua cache GET domain terkait dihapus setelah mutasi; GET berikutnya rebuild cache.
- Backward compatibility: tidak mengubah schema; hanya menambah logging dan invalidasi asinkron.

# Rencana Implementasi (File)
- Tambah helper util: `apps/app/src/app/api/_lib/cache-invalidation.ts` (wrap resolve DI + panggil Redis scan/in-memory invalidate, logging).
- Perbarui routes:
  - `apps/app/src/app/api/workflows/[id]/route.ts` (PATCH, DELETE) → panggil `invalidateDomain(tenant,'workflows')`.
  - `apps/app/src/app/api/notifications/[id]/route.ts` (PATCH, DELETE), dan `apps/app/src/app/api/notifications/route.ts` (PATCH) → panggil `invalidateDomain(tenant,'notifications')`.
- Tests:
  - `apps/app/src/app/api/workflows/[id]/__tests__/route.cache.invalidate.patch.test.ts` / `...delete.test.ts`.
  - `apps/app/src/app/api/notifications/[id]/__tests__/route.cache.invalidate.patch.test.ts` / `...delete.test.ts`.

# Dokumentasi
- Update `docs/architecture/guidelines/Cache-Expansion-Plan.md` (tambahkan operasi PATCH/DELETE dan aturan invalidasi domain & turunan).
- Tambah catatan di `ADR-015` tentang invalidasi asinkron dan fallback.

# Keberhasilan
- GET setelah PATCH/DELETE menghasilkan miss (cache dibangun ulang) untuk domain terkait.
- Tidak ada side effects pada fungsi utama; schema respons tetap.
- Tests lulus; logging menunjukkan invalidasi berjalan (jumlah keys & prefix).