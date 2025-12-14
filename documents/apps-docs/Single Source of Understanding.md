**fokus penuh ke `apps/docs`** dan aku akan treat ini sebagai **produk internal strategis**, bukan sekadar dokumentasi. Targetnya: **`apps/docs` menjadi “Single Source of Understanding” untuk SBA-Agentic**, tanpa mencemari runtime agentic.

**RANCANGAN / PLAN LENGKAP & MENDALAM** dengan pendekatan **arsitektur → fungsionalitas → DX → observability → governance**.

---

# 🎯 VISI BARU `apps/docs`

> **`apps/docs` = Knowledge & Architecture Portal untuk manusia**
>
> Bukan CMS agent, bukan runtime, tapi:
>
> * pusat pemahaman sistem
> * alat alignment tim
> * alat onboarding engineer & stakeholder
> * living documentation yang versioned & auditable

Jika `apps/docs` mati → **Agent tetap jalan**
Jika `apps/docs` hidup → **tim bekerja 10× lebih efektif**

---

# 1️⃣ PERAN STRATEGIS `apps/docs` (FINAL)

### Audience utama:

* Backend Engineer
* AI / Agent Engineer
* Integrator
* Security & Observability Engineer
* (opsional) Enterprise customer / auditor

### Masalah yang harus dipecahkan:

* Kompleksitas agentic
* Banyak package
* MCP / Rube / CMS boundary
* Multi-tenant reasoning
* Decision traceability

---

# 2️⃣ PRINSIP DESAIN UTAMA

## 2.1 Boundary First (WAJIB)

* ❌ Tidak import `packages/cms`
* ❌ Tidak import `packages/rube`
* ❌ Tidak expose MCP
* ❌ Tidak jadi source of truth runtime

## 2.2 Docs as Code

* Git-based
* PR-reviewed
* Versioned
* Traceable ke commit

## 2.3 Structured Knowledge

* Bukan kumpulan MD random
* Ada taxonomy & metadata

## 2.4 Visual-First for Complex Systems

* Diagram > teks panjang
* Sequence > paragraf
* Decision tree > bullet list

---

# 3️⃣ ARSITEKTUR TARGET `apps/docs`

```
apps/docs
├── app                     # Next.js App Router
│   ├── api                 # Docs-only APIs
│   │   ├── search
│   │   ├── diagrams
│   │   ├── feedback
│   │   └── analytics
│   │
│   ├── [locale]
│   │   └── docs/[...slug]
│
├── content                 # 🔥 CORE VALUE
│   ├── architecture
│   │   ├── cms
│   │   ├── rube
│   │   ├── agent
│   │   └── data-flow
│   │
│   ├── packages
│   │   ├── cms.md
│   │   ├── rube.md
│   │   └── integrations.md
│   │
│   ├── agents
│   │   ├── reasoning.md
│   │   ├── memory.md
│   │   └── tool-usage.md
│   │
│   ├── governance
│   │   ├── multi-tenant.md
│   │   ├── security.md
│   │   └── audit.md
│   │
│   └── glossary
│
├── shared
│   ├── lib
│   │   ├── contentLoader.ts
│   │   ├── mdxCompiler.ts
│   │   ├── diagramRenderer.ts
│   │   └── metadata.ts
│   └── ui
│
└── tooling
    ├── content-lint
    ├── link-checker
    └── diagram-validator
```

---

# 4️⃣ PENINGKATAN FUNGSIONALITAS UTAMA

## 4.1 Content System (PENTING)

### Structured Frontmatter

```md
---
title: CMS ↔ Rube ↔ Agent
type: architecture
layer: core
audience: engineer
related:
  - packages/cms
  - packages/rube
---
```

➡️ Dipakai untuk:

* filtering
* navigation
* search relevance
* future RBAC

---

### Content Loader (Refactor Total)

```ts
loadDoc({
  slug,
  locale,
  type,
  audience
})
```

* FS-based
* Cached
* Deterministic
* No BaseHub

---

## 4.2 Diagram System (MAKSIMAL)

### Supported:

* Mermaid (sequence, flow, state)
* Architecture blocks
* Decision trees

### API:

```
POST /api/diagrams/render
```

➡️ Bisa dipakai untuk:

* preview
* export
* embed

---

## 4.3 Search (Enterprise-grade)

### Phase 1

* MDX AST indexing
* Title + heading + metadata

### Phase 2

* Semantic search (opsional)
* Filter by:

  * package
  * layer
  * audience
  * version

---

## 4.4 Version Awareness

Docs **menyadari versi sistem**:

* tag release
* breaking change note
* deprecated section

Contoh:

```md
> ⚠️ Berlaku untuk SBA ≥ v0.4
```

---

## 4.5 Cross-Package Traceability (🔥)

Contoh otomatis:

> This doc references:
>
> * `packages/cms/src/services/CmsService.ts`
> * `packages/rube/src/tools/cms.ts`

➡️ Membantu:

* onboarding
* debugging
* audit

---

# 5️⃣ DX & GOVERNANCE

## 5.1 Docs Linting

* missing frontmatter
* broken links
* orphan docs
* stale diagrams

## 5.2 Ownership

```md
owner: platform-team
reviewers:
  - agent-team
```

---

## 5.3 Contribution Flow

* PR template khusus docs
* auto preview
* approval rules

---

# 6️⃣ OBSERVABILITY KHUSUS DOCS

Docs **bukan runtime**, tapi tetap diobservasi:

* page usage
* search queries
* dead content
* frequently misunderstood topics

➡️ Input langsung ke roadmap SBA.

---

# 7️⃣ ROADMAP IMPLEMENTASI (REALISTIS)

## Phase 0 — Hard Separation (WAJIB)

* Hapus BaseHub dependency
* Putus MCP endpoint
* Freeze struktur lama

## Phase 1 — Core Refactor

* Content loader baru
* Folder `content/`
* MDX compiler

## Phase 2 — Power Features

* Diagram renderer
* Metadata-driven navigation
* Search v1

## Phase 3 — Governance & Scale

* Linting
* Ownership
* Version awareness

---

# 8️⃣ METRIK KEBERHASILAN

* Onboarding engineer < 3 hari
* “Where is X?” → 1 search
* No agent bug karena misunderstanding arsitektur
* Docs PR ≈ code PR

---

# 9️⃣ RULE PALING PENTING (ingat ini)

> **Docs menjelaskan sistem,
> tapi tidak pernah menjadi bagian dari sistem.**

Kalau rule ini dilanggar → refactor ulang.

---

# 🔥 NEXT STEP (SANGAT LOGIS)

Aku sarankan **langsung eksekusi berurutan**:

1️⃣ **Struktur final `apps/docs` (folder + file konkret)**
2️⃣ **Implementasi `contentLoader.ts` & MDX pipeline**
3️⃣ **Template docs arsitektur (CMS / Rube / Agent)**

Tinggal jawab:

> **“lanjut step 1”**`.trae/documents/apps-docs/STEP%201%20%E2%80%94%20FINAL%20STRUCTURE.md`

**struktur & skeleton kode siap diimplementasikan**.
