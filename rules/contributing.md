# Contributing Guidelines

Cara berkontribusi dalam pengembangan SBA-Agentic.

## 1. Alur Kerja Git
- Buat branch baru dari `main`: `feat/nama-fitur` atau `fix/deskripsi-bug`.
- Commit message mengikuti standar [Conventional Commits](https://www.conventionalcommits.org/).

## 2. Penambahan Rule Baru
1. Pilih template yang sesuai di `rule-templates/`.
2. Pastikan ID unik dan mengikuti konvensi penamaan.
3. Tambahkan unit test di `packages/rube/src/rules/__tests__/`.
4. Jalankan `pnpm docs:validate`.

## 3. Kode Etik
- Selalu utamakan keamanan data tenant.
- Tulis kode yang terdokumentasi dan mudah dibaca (Clean Code).

---
*Terima kasih telah berkontribusi!*
