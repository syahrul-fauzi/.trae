## Ringkasan Tujuan
- Menghasilkan PRD komprehensif untuk setiap fitur utama yang disebut di `README.md` dan `docs/README.md`.
- Menyelaraskan format PRD sesuai standar workspace (frontmatter YAML, struktur konsisten, snake_case).
- Memasukkan data pendukung, metrik sukses, risiko, dan dampak sistem untuk siap implementasi.

## Daftar Fitur & File Target
- `workspace/01_PRD/analytics_heatmap.md` — PRD-001
- `workspace/01_PRD/rbac_access_control.md` — PRD-002
- `workspace/01_PRD/metrics_observability.md` — PRD-003
- `workspace/01_PRD/security_headers_csp.md` — PRD-004
- `workspace/01_PRD/rate_limiting_upstash.md` — PRD-005
- `workspace/01_PRD/agent_interrupt_resume.md` — PRD-006
- `workspace/01_PRD/generative_ui.md` — PRD-007
- `workspace/01_PRD/multimodal_messages.md` — PRD-008
- `workspace/01_PRD/meta_events_feedback.md` — PRD-009
- `workspace/01_PRD/ensure_tenant_header.md` — PRD-010
- `workspace/01_PRD/supabase_client_factories.md` — PRD-011
- `workspace/01_PRD/ci_guard_secret_shield.md` — PRD-012
- Migrasi: `workspace/01_PRD/20251206-agentic-core-prd.md` → selaraskan ke template baru sebagai umbrella PRD.

## Sumber Data & Rujukan (untuk Problem Statement)
- Observability & tenant header: `/home/inbox/smart-ai/sba-agentic/README.md:78-80`
- Heatmap Tracker: `/home/inbox/smart-ai/sba-agentic/README.md:11`
- RBAC: `/home/inbox/smart-ai/sba-agentic/README.md:74-75`
- Security & CSP: `/home/inbox/smart-ai/sba-agentic/README.md:72-73`, `127-133`
- Rate limiting Upstash: `/home/inbox/smart-ai/sba-agentic/README.md:8-9`, `128-129`
- Interrupt/resume (contoh payload): `/home/inbox/smart-ai/sba-agentic/README.md:49-68`
- Generative UI: `/home/inbox/smart-ai/sba-agentic/README.md:27-28`, `34`
- Multimodal Messages: `/home/inbox/smart-ai/sba-agentic/README.md:24-25`, `32`
- Meta Events: `/home/inbox/smart-ai/sba-agentic/README.md:35`, `161-162`
- Standar workspace & frontmatter: `/home/inbox/smart-ai/sba-agentic/docs/README.md:95-103`

## Template PRD Konsisten
- Frontmatter YAML: `title`, `id: PRD-XXX`, `created_at`, `last_modified`, `author`, `reviewer`, `status`, `priority`, `related`.
- Bagian inti:
  - Problem Statement: deskripsi, data pendukung (kutipan README/docs), impact analysis.
  - Goals: SMART, alignment bisnis.
  - Non-goals: batasan dan alasan.
  - User Stories: format “Sebagai [role], saya ingin [fitur] sehingga [manfaat]”; prioritas P0/P1/P2; kriteria kelengkapan.
  - Acceptance Criteria: kondisi selesai, test scenarios, success metrics terukur.
  - Risiko & Mitigasi: teknis/bisnis, mitigasi, contingency plan.
  - Dampak Sistem: UI/UX (screens, components), API (endpoints/payloads), Agent (logic/flows), dependencies.
  - References: tautan file/codepaths relevan.
  - QA & Review: minimal 2 stakeholder, status persetujuan, riwayat perubahan.

## Contoh Konten (ringkas) per Fitur
- Analytics Heatmap:
  - Problem: kebutuhan pengamatan klik pengguna untuk peningkatan UX; rujukan `README.md:11`.
  - Goals: tingkatkan akurasi overlay heatmap ≥95%; latensi `POST /api/analytics/heatmap` p95 ≤500ms.
  - Acceptance: titik klik tersimpan dan divisualisasikan; admin dapat filter per halaman; metrik error ≤0.5%.
- RBAC Access Control:
  - Problem: akses API harus dibatasi per peran/tenant; rujukan `README.md:74-75`.
  - Goals: 100% endpoint kritis memakai `withRBAC`; audit 403 tercatat.
  - Acceptance: role mapping diuji; bypass tidak mungkin pada rute terproteksi.
- Interrupt/Resume Agent:
  - Problem: agen perlu jeda untuk approval manusia; rujukan contoh payload `README.md:49-68`.
  - Goals: ≥95% resume berhasil dengan payload valid; waktu jeda rata-rata ≤2m.
  - Acceptance: status run berubah tepat (pause/resume/cancel); audit & metrics tercatat.

## Metrik Sukses Global
- p95 latensi ≤500ms, error rate ≤0.5% (canary) — rujukan `/home/inbox/smart-ai/sba-agentic/README.md:132-134`.
- Coverage paket kritis ≥80% — rujukan `/home/inbox/smart-ai/sba-agentic/docs/README.md:50-51`.

## Diagram & Artefak
- BPMN alur interrupt/resume (Agent Flow).
- Sequence diagram untuk `HeatmapTracker → /api/analytics/heatmap`.
- ERD ringan untuk metadata heatmap & audit RBAC.

## Proses & Otomatisasi
- Identifikasi fitur (di atas), alokasikan ID `PRD-001…PRD-012`.
- Auto-generate skeleton PRD di `workspace/01_PRD/*.md` dengan frontmatter dan kerangka isi.
- Prefill data pendukung dari `README.md`/`docs/README.md` dan codepaths relevan.
- Tambahkan bagian QA (stakeholder: Product Lead, Eng Lead) dan checklist review.

## Urutan Pengerjaan
1) Security headers/CSP, RBAC, Rate limiting, Ensure tenant header (P0).
2) Metrics/Observability (P0).
3) Interrupt/Resume, Multimodal, Generative UI, Meta events (P1).
4) Analytics Heatmap (P1) dan Supabase client factories (P2).
5) CI Guard Secret Shield (P2).

## QA & Review
- Review oleh minimal 2 stakeholder; catat persetujuan di frontmatter `status` dan `changelog`.
- Update PRD secara berkala mengikuti perubahan kebutuhan.

## Output yang Diharapkan
- 12 file PRD baru di `workspace/01_PRD/` dengan ID unik, isi lengkap, referensi jelas, dan metrik sukses siap diuji.
- Dokumen `20251206-agentic-core-prd.md` diselaraskan sebagai umbrella PRD sesuai template di atas.

Silakan konfirmasi untuk melanjutkan pembuatan file PRD sesuai daftar di atas dan mengisi setiap bagian dengan data pendukung, user stories, acceptance criteria, serta diagram yang diperlukan.