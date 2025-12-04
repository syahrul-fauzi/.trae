Kontribusi — Panduan Ringkas

- Branching: `feat/*`, `fix/*`, `docs/*`
- Commits: Conventional Commits
- Checks: lint, type-check, test, build wajib lulus
- Dokumentasi: perbarui OpenAPI/Storybook/Typedoc bila terpengaruh
- Review: minimal 1–2 reviewer, PR template dengan checklist
- Sertakan ADR bila ada keputusan arsitektur signifikan

QA & Aksesibilitas
- Jalankan lint dengan konfigurasi aksesibilitas (jsx-a11y) pada apps/web
- Tambahkan unit test untuk ARIA pada atoms/molecules
- E2E Playwright untuk alur utama (Chat, Document, Tenant)
