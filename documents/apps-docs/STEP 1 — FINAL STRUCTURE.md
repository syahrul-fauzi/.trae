**langsung eksekusi STEP 1**:
**Struktur FINAL `apps/docs` (folder + file konkret)**
→ fokus **hard separation, clarity, scalability**, dan **siap diimplementasikan tanpa BaseHub**.

---

# ✅ STEP 1 — FINAL STRUCTURE `apps/docs`

## 🎯 Tujuan Step 1

* Memutus total ketergantungan ke BaseHub
* Menjadikan docs **Git-based, deterministic**
* Menyediakan pondasi kuat untuk fitur lanjutan (search, diagram, governance)
* Tidak menyentuh CMS / Rube runtime

---

## 1️⃣ High-Level Struktur (FINAL)

```
apps/docs
├── app
├── content
├── shared
├── tooling
├── public
├── tests
├── package.json
├── tsconfig.json
└── README.md
```

---

## 2️⃣ `app/` — Next.js App Router (Docs-only)

```
app
├── api
│   ├── search
│   │   └── route.ts
│   ├── diagrams
│   │   └── render
│   │       └── route.ts
│   ├── analytics
│   │   └── route.ts
│   └── feedback
│       └── route.ts
│
├── [locale]
│   ├── layout.tsx
│   ├── page.tsx
│   └── docs
│       └── [...slug]
│           ├── page.tsx
│           └── not-found.tsx
│
├── layout.tsx
└── globals.css
```

### Prinsip:

* ❌ Tidak ada `mcp/`
* ❌ Tidak ada `basehub`
* API **khusus docs utility**, bukan runtime

---

## 3️⃣ `content/` — CORE VALUE (Docs as Code)

> **Ini jantung `apps/docs`**

```
content
├── architecture
│   ├── overview.md
│   ├── cms
│   │   └── cms-rube-agent.md
│   ├── rube
│   │   └── mcp-tooling.md
│   ├── agent
│   │   ├── reasoning.md
│   │   ├── memory.md
│   │   └── lifecycle.md
│   └── data-flow
│       └── end-to-end.md
│
├── packages
│   ├── cms.md
│   ├── rube.md
│   ├── integrations.md
│   ├── agentic-reasoning.md
│   └── observability.md
│
├── agents
│   ├── tool-usage.md
│   ├── prompt-lifecycle.md
│   └── failure-modes.md
│
├── governance
│   ├── multi-tenant.md
│   ├── security.md
│   ├── audit.md
│   └── compliance-id.md
│
├── glossary
│   └── index.md
│
└── _meta
    ├── navigation.ts
    └── taxonomy.ts
```

### Aturan Keras:

* ✅ Markdown / MDX only
* ✅ Git-versioned
* ❌ Tidak fetch API eksternal
* ❌ Tidak runtime logic

---

## 4️⃣ Frontmatter Standard (WAJIB)

Setiap `.md`:

```md
---
title: CMS ↔ Rube ↔ Agent
description: Boundary & data flow
type: architecture
layer: core
audience:
  - backend
  - agent-engineer
related:
  - packages/cms
  - packages/rube
version: ">=0.4"
owner: platform
---
```

➡️ Dipakai untuk:

* navigation
* filter
* search
* governance
* future RBAC

---

## 5️⃣ `shared/` — Engine Docs (NO UI LOGIC)

```
shared
├── lib
│   ├── contentLoader.ts      # FS-based loader
│   ├── mdxCompiler.ts        # MDX → React
│   ├── metadata.ts           # frontmatter parser
│   ├── diagramRenderer.ts    # mermaid / flow
│   ├── toc.ts
│   └── cache.ts
│
└── ui
    ├── DocLayout.tsx
    ├── DocSidebar.tsx
    ├── DocHeader.tsx
    ├── Callout.tsx
    ├── Diagram.tsx
    └── CodeBlock.tsx
```

### Prinsip:

* `shared/lib` → pure logic
* `shared/ui` → reusable components
* Tidak tahu CMS / Rube / Agent runtime

---

## 6️⃣ `tooling/` — Governance & Quality (Future-proof)

```
tooling
├── content-lint
│   └── index.ts
├── link-checker
│   └── index.ts
└── diagram-validator
    └── index.ts
```

Digunakan di:

* CI
* pre-commit
* audit docs

---

## 7️⃣ `tests/` — Docs Reliability

```
tests
├── content.test.ts        # frontmatter + slug
├── navigation.test.ts     # sidebar consistency
├── diagrams.test.ts       # mermaid validity
└── search-index.test.ts
```

Docs **harus dites**, bukan dipercaya.

---

## 8️⃣ `README.md` (apps/docs)

Isi minimum:

* Purpose
* Non-goals
* Content rules
* Contribution guide
* Boundary rules (no runtime dependency)

---

## 9️⃣ Apa yang DIHAPUS dari Struktur Lama

| Item Lama          | Status  |
| ------------------ | ------- |
| BaseHub config     | ❌ HAPUS |
| MCP routes         | ❌ HAPUS |
| CMS-like services  | ❌ HAPUS |
| Webhook revalidate | ❌ HAPUS |

---

## 10️⃣ Checklist Step 1 (Harus Done)

* [ ] Folder `content/` ada & populated
* [ ] Tidak ada `basehub` import
* [ ] Tidak ada MCP endpoint
* [ ] `contentLoader` pakai FS
* [ ] App bisa render docs static

Jika ini DONE → fondasi **sudah benar dan bersih**.

---

# 🔥 NEXT STEP (STEP 2)

Setelah struktur ini:
👉 **Implementasi `contentLoader.ts` + MDX pipeline**

Aku akan:

* turunkan kode real
* jelaskan caching & perf
* siap dipakai di `app/[locale]/docs/[...slug]`

Tinggal bilang:

> **“lanjut step 2”**`.trae/documents/apps-docs/STEP%202%20%E2%80%94%20Content%20Loader%20%26%20MDX%20Pipeline%20%28FINAL%29.md`
