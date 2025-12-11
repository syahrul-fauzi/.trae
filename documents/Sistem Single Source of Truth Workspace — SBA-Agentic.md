## Tujuan
- Mewujudkan sistem Single Source of Truth (SSoT) berpusat di `workspace/` sebagai PRD hidup yang tersinkron dengan Sigma Chat, Figma, AI agents, dan `packages/ui`.
- Menjaga konsistensi versi, traceability, dan otomatisasi scaffolding/PR.

## Arsitektur Sistem
- **Pusat dokumen**: `workspace/` (Terminal#0–116) sebagai repositori PRD, arsitektur, design system, agentic workflows, dan indeks cross-ref (`workspace/_xref.md`).
- **Adapter sinkronisasi**:
  - Sigma Chat: webhook + mapping file → menulis/menautkan diskusi & tugas ke artefak `workspace/*`.
  - Figma: API export tokens/components → normalize → commit ke `workspace/03_Design-System/tokens` dan sinkron ke `packages/ui`.
  - AI Agents: prompt-runner untuk generate file/scaffolds dan draft PR; log ke `workspace/01_PRD/` dan `_xref.md`.
  - `packages/ui`: konsumen tokens (Style Dictionary/Tailwind) + lokasi scaffolds komponen.
- **CI/CD orkestrasi**: job `sync-figma`, `sync-sigma`, `agent-scaffold`, `doc-lint`, `xref-check`, `auto-pr`.

## Struktur Workspace (SSoT)
- **Tetap dan diperluas**:
  - `workspace/01_PRD/` → PRD fitur, `_templates/*`, `_index.md`
  - `workspace/02_Architecture/` → ADR + `diagrams/*.mmd`, `_templates/*`
  - `workspace/03_Design-System/` → `_index.md`, `_templates/*`, `tokens/` (hasil export Figma), `components-map.yaml`
  - `workspace/04_Agent-Flows/` → `bpmn/`, `_templates/*`, `workflows.md`
  - `workspace/05_API/` → `_templates/*`, `specs/` (kontrak OpenAPI konvergen)
  - `workspace/_xref.md` → indeks referensi silang PRD↔Arsitektur↔Flows↔API + dependencies + RACI
  - `workspace/integrations/` (baru, logical) → `sigma/`, `figma/`, `agents/` metadata & mapping
- **Metadata frontmatter wajib**: `version`, `changelog`, `owner/reviewer/approver`, `tags`, `links_count`, `masterplan_ref`, `validation`.

## Skema & Mapping
- **Mapping Sigma Chat** (`workspace/integrations/sigma/map.json`):
  - `thread_id`, `message_ids[]`, `artifact_paths[]` (PRD/diagram/flows/API), `status` (open/merged), `labels[]`
- **Mapping Figma** (`workspace/integrations/figma/map.json`):
  - `file_id`, `component_ids[]`, `token_export_url`, `packages_ui_targets[]`, `last_sync_at`
- **AI Agents prompts** (`workspace/integrations/agents/prompts/*`):
  - `scaffold_component.md`, `generate_prd.md`, `update_api_spec.md`
- **Design tokens** (`workspace/03_Design-System/tokens/*.json`):
  - Format kompatibel Style Dictionary (design/semantic tokens) + konversi Tailwind/CS vars.

## Persyaratan Integrasi
- **Sigma Chat**
  - Link langsung dari Sigma ke artefak: setiap tugas memuat path `workspace/*` dan XRef `id`.
  - Webhook: ketika status tugas berubah → update frontmatter `changelog` + `links_count` + `_xref.md`.
- **Figma**
  - Export tokens/components via API → normalisasi ke `tokens/*.json` + `components-map.yaml`.
  - Sinkron otomatis ke `packages/ui` (generate `src/tokens.ts` & import ke tema/UI).
- **AI Agents**
  - Mendukung prompt untuk: generate file PRD/ADR/API/spec, scaffolding komponen, draft PR otomatis.
  - Tulisan ke `workspace/` terlebih dahulu; PR dibuat dari diffs yang lolos lint & xref-check.
- **`packages/ui`**
  - Menerima tokens dari `workspace/03_Design-System/tokens/*.json`; script transform → `packages/ui/src/theme`.
  - Menerima scaffolds dari `agents` runner → `packages/ui/src/components/new/*` dengan test & stories.

## Alur Kerja
- **Perubahan Figma → Workspace**
  - Event Figma → job `sync-figma` → unduh tokens/components → update `workspace/03_Design-System/tokens` dan `components-map.yaml` → commit & lint → update `_xref.md` dependencies.
- **Update Workspace → Notifikasi Tools**
  - Merge di `workspace/*` → job `notify-tools` → kirim notifikasi ke Sigma Chat (tautan artefak) dan ke agents (trigger scaffolding bila perlu).
- **Versi dokumen konsisten**
  - Frontmatter `version`/`changelog` di PRD & `_xref.md`; gate CI `xref-check` memastikan keselarasan versi lintas artefak.

## Validasi & Kualitas
- **Lint**: `docs:validate`, `check:workspace` (resolvability link, penamaan, kelengkapan PRD/arch/flows/API).
- **Coverage**: laporan coverage XRef (≥1 PRD, ≥1 diagram, ≥1 flow, ≥1 API per fitur).
- **Security**: `ci:guard` pada PR; kunci Figma/Sigma disimpan di secrets CI; tidak ada rahasia di klien.
- **Observability**: log sinkronisasi (success/error) + dashboard kecil (counts per sinkronisasi, latensi, error rate).

## RACI & Operasi
- **RACI per fitur** di `_xref.md` (owner/reviewer/approver/observer) untuk akuntabilitas.
- **Review mingguan**: status Draft→Review→Approved; kurasi ke `docs/` bila matang; catat `changelog`.

## Implementasi Bertahap
- **Fase 1** (minggu 1)
  - Tambah struktur `workspace/integrations/*` & mapping skema.
  - Perluas `_xref.md` untuk dependencies & versi; siapkan lint `xref-check`.
  - Draft adapter Figma: ekspor tokens → `workspace/03_Design-System/tokens`.
- **Fase 2** (minggu 2)
  - Integrasi Sigma Chat webhook + notifikasi; tautan dua arah artefak↔tugas.
  - Integrasi AI agents prompt-runner (generate PRD/ADR/API & scaffolds), auto PR.
  - Transform tokens ke `packages/ui` + import tema; validasi build UI.
- **Fase 3** (minggu 3)
  - Lengkapi orkestrasi CI: `sync-figma`, `sync-sigma`, `agent-scaffold`, `doc-lint`, `xref-check`, `auto-pr`.
  - Tambah laporan coverage cross-ref; dokumentasikan runbook operasi & rollback.

## Keberhasilan & Pengukuran
- Semua dokumen produk tersedia & terupdate di `workspace/` (cek lint & coverage).
- Tidak ada duplikasi/inkonsistensi (gate `xref-check`).
- Sinkronisasi otomatis tanpa error (error rate <0.5%).
- Scaffolding & automation bekerja (komponen baru di `packages/ui` dengan tests & stories, PR otomatis dibuat).