## Tujuan
- Membandingkan struktur dan konten `docs/` vs `workspace/` dan menyusun rencana penguatan `workspace/_xref.md` agar menjadi indeks referensi silang yang skalabel, akuntabel, dan selaras dengan praktik dokumentasi proyek.

## Temuan Utama
- `docs/` berfungsi sebagai layer publikasi dan operasi (panduan, runbook, checklist, ADR teknis, observability, security) dengan banyak `.md`, `.mmd`, `.json/.jsonl` yang matang.
- `workspace/` adalah authoring layer dengan 5 domain (`01_PRD`, `02_Architecture`, `03_Design-System`, `04_Agent-Flows`, `05_API`) lengkap dengan indeks dan template, serta banyak diagram `.mmd` dan ADR lokal.
- `README.md` root mengarahkan penggunaan `workspace/` dan standar dokumentasi (frontmatter YAML, penamaan `YYYYMMDD-<DESCRIPTOR>.md`, validasi workspace) — lihat `/home/inbox/smart-ai/sba-agentic/README.md:37-44`, `/home/inbox/smart-ai/sba-agentic/README.md:47-49`.
- `workspace/_xref.md` masih minimal: hanya contoh format tautan PRD↔Arsitektur↔Flows↔API — lihat `/home/inbox/smart-ai/sba-agentic/workspace/_xref.md:21-26`.

## Prinsip Desain Penguatan `_xref.md`
- Skalabilitas: indeks many-to-many antar artefak (satu PRD → banyak diagram/API) dengan konsistensi penamaan.
- Akuntabilitas: adopsi RACI (Owner/Reviewer/Approver/Observer) per item, meniru praktik struktur organisasi proyek agar tugas tidak terlewat dan koordinasi jelas.
- Traceability: tautkan setiap item ke masterplan/roadmap sehingga PRD, ADR, flows, dan API selaras dengan tujuan jangka panjang.
- Validasi: checklist resolvability link dan kelengkapan minimal (≥1 PRD, ≥1 arsitektur, ≥1 flow, ≥1 API) yang dapat dicek oleh lint `check:workspace`.

## Struktur Baru `_xref.md`
- Frontmatter diperluas: `version`, `owner`, `domain`, `review_cycle`, `tags`, `masterplan_ref`, `links_count`, `validation`.
- Skema entitas XRefItem:
  - `id`, `title`, `summary`, `status` (`Draft/Review/Approved/Deprecated`)
  - `responsibility`: `{ owner, reviewer, approver, observer }` (RACI)
  - `tags`: label tematik (mis. `agentic`, `security`, `observability`)
  - `prd[]`, `architecture[]` (ADR + diagram), `flows[]` (BPMN/sequence), `api[]` (spec/guides)
  - `validation`: `{ has_prd, has_arch, has_flow, has_api }`
- Konvensi penamaan: tegaskan `YYYYMMDD-<descriptor>.md` dan keluarga diagram `*-sequence.mmd`, `*-component.mmd`, `*-dataflow.mmd`, `*-erd.mmd`.

## Contoh XRefItem
- `id: 20251206-agent_interrupt_resume`
- `title: Agent Interrupt & Resume`
- `prd: ["workspace/01_PRD/agent_interrupt_resume.md"]`
- `architecture: ["workspace/02_Architecture/diagrams/agent_interrupt_resume-sequence.mmd", "workspace/02_Architecture/ADR-011.md"]`
- `flows: ["workspace/04_Agent-Flows/bpmn/agent_interrupt_resume.bpmn"]`
- `api: ["workspace/05_API/_templates/API-doc-template.md"]`
- `responsibility: { owner: "lead@sba", reviewer: "qa@sba", approver: "pm@sba" }`
- `status: Approved`, `tags: ["agentic", "lifecycle", "approval"]`
- `validation: { has_prd: true, has_arch: true, has_flow: true, has_api: true }`

## Integrasi Praktik Eksternal
- Pengelolaan folder/file terstruktur untuk kemudahan pencarian; terapkan struktur dan penamaan konsisten lintas domain.
- Struktur organisasi proyek (RACI) untuk memastikan pembagian tugas, koordinasi, dan mekanisme kontrol yang jelas.
- Masterplan sebagai panduan jangka panjang; lakukan evaluasi berkala dan penyesuaian untuk menjaga relevansi terhadap peluang/risiko.

## Rencana Implementasi
1. Perluas frontmatter `_xref.md` dengan field baru (version, domain, RACI, tags, masterplan_ref, validation).
2. Tambahkan blok XRefItem terstruktur untuk 8–12 fitur inti yang sudah ada di `workspace/01_PRD/*` dan `workspace/02_Architecture/diagrams/*` (interrupt/resume, multimodal, meta-events, RBAC, rate limiting, tenant header, supabase factories, analytics heatmap, generative UI).
3. Tegaskan konvensi penamaan file dan keluarga diagram; dokumentasikan di `_xref.md` sebagai aturan.
4. Masukkan “Validation Checklist” per item; siapkan output yang dapat dimanfaatkan oleh skrip `check:workspace`.
5. Tetapkan siklus review mingguan: Draft → Review → Approved; sinkronkan artefak matang ke `docs/` dan catat di `changelog` frontmatter.

## Deliverables
- Laporan analisis komparatif `docs/` vs `workspace/` (tersaji di pesan ini).
- Rekomendasi spesifik penguatan `_xref.md` (struktur, RACI, validasi, konvensi).
- Rencana implementasi bertahap dengan prioritas pada fitur inti SBA-Agentic.
- Dokumentasi perubahan yang diusulkan (frontmatter baru dan skema XRefItem) siap diterapkan setelah konfirmasi.

## Permintaan Konfirmasi
- Setujui rencana di atas untuk saya terapkan pembaruan pada `workspace/_xref.md` dan mulai mengisi XRefItem untuk fitur inti.