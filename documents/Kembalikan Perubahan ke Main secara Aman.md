## Tujuan
- Mengembalikan seluruh perubahan ke branch `main` secara aman tanpa kehilangan data.
- Membersihkan branch yang tidak diperlukan setelah verifikasi.
- Menjalankan testing menyeluruh di `main` dan mendokumentasikan proses.

## Prasyarat & Catatan Penting
- Hindari file besar (>100MB) ikut ter-tracking (contoh: `apps/api/logs/combined.log`). Pastikan file log di-ignore sebelum merge.
- Jika pre-commit (husky/lint-staged) memblokir proses, perbaiki lint; gunakan `--no-verify` hanya bila diperlukan untuk unblocking teknis.

## Langkah 1: Identifikasi Status Saat Ini
- Periksa status dan branch aktif:
  - `git status -s`
  - `git branch --show-current`
  - `git log --oneline --graph --decorate --all | head -n 50`

## Langkah 2: Commit Semua Perubahan yang Belum Tersimpan
- Stage & commit terstruktur per area agar mudah dilacak:
  - `git add -A`
  - `git commit -m "chore: backup & finalize local changes before merge"`
- Jika ada perubahan besar yang tidak relevan, pisahkan dengan commit granular (feat/docs/chore/fix) sesuai konvensi.

## Langkah 3: Backup Kode & Data Penting
- Buat arsip snapshot workspace (tanpa file besar/log):
  - `mkdir -p backups && ts=$(date +%Y%m%d-%H%M%S)`
  - `tar --exclude='**/node_modules' --exclude='**/.next' --exclude='**/logs/*.log' -czf backups/snapshot-$ts.tgz .`
- Simpan artefak kritis:
  - `cp -r artifacts/ backups/artifacts-$ts/ || true`
  - `cp -r docs/ops/assets/ backups/assets-$ts/ || true`
- Opsional: stash snapshot workspace:
  - `git stash push -u -m "pre-merge-backup-$ts"`

## Langkah 4: Sanitasi File Besar & .gitignore
- Pastikan log tidak ter-tracking untuk menghindari penolakan remote:
  - `echo 'apps/api/logs/*.log' >> .gitignore`
  - `git rm --cached apps/api/logs/combined.log || true`
  - `git commit -m "chore(git): stop tracking API logs and ignore *.log"`

## Langkah 5: Checkout ke Main & Sinkronisasi
- Beralih ke `main` dan sinkronkan:
  - `git fetch origin`
  - `git checkout main`
  - `git pull --ff-only`

## Langkah 6: Integrasikan Perubahan ke Main
- Jika perubahan ada di branch fitur (contoh): `feature/e2e-observability`, `feature/docs-reporting`, `feature/dev-config-stabilization`, `ci/docs-pdf-export`:
  - Merge satu per satu dengan no-ff untuk riwayat jelas:
    - `git merge feature/e2e-observability --no-ff`
    - `git merge feature/docs-reporting --no-ff`
    - `git merge feature/dev-config-stabilization --no-ff`
    - `git merge ci/docs-pdf-export --no-ff`
- Jika perubahan lokal belum sempat dipush ke branch fitur:
  - Cherry-pick commit spesifik:
    - `git cherry-pick <commit-sha-1> <commit-sha-2> ...`
- Resolusi konflik bila ada: lakukan per file, jalankan lint & test, kemudian commit resolusi konflik.

## Langkah 7: Verifikasi Perpindahan File & Perubahan
- Bandingkan isi `main` terhadap ekspektasi:
  - `git diff --name-status origin/main..HEAD`
  - `git log --oneline --decorate | head -n 30`
- Validasi file kunci:
  - Observability E2E: `apps/web/e2e/metrics-baseline.spec.ts`, `apps/web/e2e/cache-xcache.spec.ts`
  - Docs: `docs/ops/Validation-Report-TEMPLATE.md`, `docs/ops/Validation-Report-2025-12-10.md`, `docs/ops/assets/cache_effectiveness_20251210.png`
  - Dev config: `apps/app/next.config.js`, `(public)/login/page.tsx`
  - CI PDF: `.github/workflows/docs-export.yml`

## Langkah 8: Hapus Branch yang Tidak Diperlukan
- Setelah aman di `main`:
  - Lokal: `git branch -d feature/e2e-observability` (dan branch lainnya)
  - Remote: `git push origin --delete feature/e2e-observability` (dan branch lainnya)

## Langkah 9: Testing Menyeluruh di Main
- Lint & unit/integration:
  - `pnpm lint`
  - `pnpm -C apps/web exec playwright test --project=chromium`
  - (Opsional) `pnpm -C apps/app test`
- Observabilitas runtime dev:
  - Jalankan dev server dan cek:
    - `GET /api/metrics/prometheus` → 200 OK
    - `GET /api/knowledge/search-cached?q=cacheme` dua kali → `X-Cache` miss→hit
- CI PDF:
  - Pastikan workflow `.github/workflows/docs-export.yml` menghasilkan PDF artefak ketika ada perubahan dokumen.

## Langkah 10: Dokumentasi & Pelacakan
- Buat log langkah di dokumen operasional:
  - `docs/ops/merge-back-runbook.md` (ringkas: waktu eksekusi, perintah utama, hasil lint/test, daftar branch yang dihapus)
- Simpan bukti:
  - Output lint/test, screenshot dashboard observabilitas, daftar commit merge.

## Kriteria Sukses
- `main` berisi seluruh perubahan penting, lint/test PASS, observabilitas dan cache berfungsi.
- Tidak ada file besar ter-tracking; push/merge ke remote berjalan mulus.
- Branch fitur yang tidak diperlukan sudah dihapus (lokal & remote).