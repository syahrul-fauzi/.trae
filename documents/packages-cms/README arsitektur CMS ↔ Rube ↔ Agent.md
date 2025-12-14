Berikut **README KHUSUS `packages/cms`** yang **secara eksplisit mendeskripsikan arsitektur CMS ↔ Rube ↔ Agent**, ditulis **sebagai dokumen teknis inti**, bukan marketing, dan **siap hidup di repo**.

Disarankan path:

```
packages/cms/README.md
```

---

# 📦 `packages/cms`

## Agentic CMS — Architecture: CMS ↔ Rube ↔ Agent

**Status:** Core Infrastructure
**Scope:** Agentic Knowledge & Configuration Store
**Audience:** Backend, AI Agent Engineer, Platform Engineer

---

## 1. Purpose

`packages/cms` adalah **Agentic CMS** untuk SBA-Agentic.

Bukan CMS tradisional, melainkan **source of truth terstruktur** untuk:

* prompts
* workflows
* agent knowledge
* configuration
* versioned business content

CMS ini **tidak pernah melakukan reasoning** dan **tidak pernah dieksekusi langsung oleh Agent**.

> **Semua akses CMS harus melalui Rube (MCP Tool Hub).**

---

## 2. Architectural Position

```
Agent  ──(tool intent)──▶  Rube  ──(tool execution)──▶  CMS
```

### Inverted dependency rule:

* Agent **tidak tahu** CMS
* CMS **tidak tahu** Agent
* Rube adalah **satu-satunya boundary**

---

## 3. Non-Goals (Sangat Penting)

CMS **TIDAK BOLEH**:

* melakukan reasoning
* memanggil Agent
* menjalankan workflow
* mengandung business logic agent
* expose API publik langsung ke Agent/UI

Jika salah satu terjadi → **arsitektur rusak**.

---

## 4. Responsibilities

### CMS Bertanggung Jawab Atas:

* penyimpanan knowledge terstruktur
* validasi schema (Zod)
* versioning & lifecycle
* tenant isolation
* deterministic read

### CMS Tidak Bertanggung Jawab Atas:

* orchestration
* decision making
* retries
* policy enforcement
* observability execution

---

## 5. Dependency Graph

```
packages/cms
 ├─ depends on:
 │   ├─ zod
 │   ├─ db
 │   ├─ shared-utils
 │
 ├─ used by:
 │   └─ packages/rube (via tool adapter)
```

❌ `packages/cms` **tidak boleh** di-import oleh:

* `agentic-reasoning`
* `agui-client`
* UI apps

---

## 6. Internal Architecture

### 6.1 Folder Structure (Refactored)

```
packages/cms
├── src
│   ├── schemas          # Zod schemas (contract-first)
│   │   ├── prompt.schema.ts
│   │   ├── workflow.schema.ts
│   │   ├── knowledge.schema.ts
│   │   └── index.ts
│   │
│   ├── repositories     # Data access (no logic)
│   │   ├── PromptRepo.ts
│   │   ├── WorkflowRepo.ts
│   │   └── KnowledgeRepo.ts
│   │
│   ├── loaders          # Source abstraction
│   │   ├── dbLoader.ts
│   │   ├── gitLoader.ts
│   │   └── fsLoader.ts
│   │
│   ├── services         # Thin orchestration
│   │   └── CmsService.ts
│   │
│   ├── types            # Public types
│   │   └── index.ts
│   │
│   └── index.ts         # Public entry
```

---

## 7. Schema-First Design

Semua data CMS **harus lolos schema** sebelum keluar dari boundary CMS.

Contoh:

```ts
PromptSchema.parse(rawData)
```

Tidak ada:

* `any`
* untyped JSON
* implicit shape

Ini **wajib** untuk:

* tool determinism
* replayability
* audit

---

## 8. Versioning & Lifecycle

Setiap entitas CMS memiliki:

```ts
{
  tenantId: string
  key: string
  version: number
  status: 'draft' | 'published' | 'archived'
  createdAt: Date
}
```

### Rules:

* Agent hanya boleh menerima `published`
* `draft` hanya untuk admin/editor
* versi lama tidak pernah dihapus (audit)

---

## 9. CMS ↔ Rube Contract

CMS **tidak expose API langsung**.
CMS hanya dipanggil oleh **Rube tool adapter**.

### Example Tool Contract

```ts
cms.getKnowledge({
  tenantId,
  type: 'prompt' | 'workflow' | 'doc',
  key,
  version?
})
```

CMS **tidak tahu siapa pemanggilnya**.
CMS **hanya tahu tenant & query**.

---

## 10. Agent Interaction (Indirect)

Agent flow:

```
Agent
 → decides tool needed
 → sends intent to Rube
 → Rube executes cms tool
 → CMS returns typed knowledge
 → Agent reasons
```

📌 Agent **tidak pernah**:

* import CMS
* tahu schema CMS
* tahu loader CMS

---

## 11. Observability & Audit

CMS **tidak log execution**.

Namun CMS **menghasilkan metadata** yang dikonsumsi Rube:

* content version
* schema hash
* fetch duration
* source (db/git)

➡️ Rube yang mencatat audit & trace.

---

## 12. Multi-Tenant Isolation

* Semua query CMS **wajib tenantId**
* Tidak ada default tenant
* Tidak ada cross-tenant join
* Rube menyuntikkan tenantId (Agent tidak)

---

## 13. Migration Note (BaseHub)

CMS ini **menggantikan BaseHub sebagai core**.

BaseHub (jika masih ada):

* hanya untuk static / marketing content
* tidak masuk reasoning loop
* tidak dipanggil oleh Agent

---

## 14. Anti-Patterns (Dilarang Keras)

🚫 Agent → CMS langsung
🚫 CMS → Agent
🚫 CMS menyimpan prompt tanpa schema
🚫 CMS melakukan decision
🚫 CMS tahu tentang Rube internals

---

## 15. Design Principles Recap

1. **CMS knows**
2. **Agent thinks**
3. **Rube executes**
4. **Schema over freedom**
5. **Boundary over convenience**

---

## 16. Related Docs

* `packages/rube/README.md`
* `docs/architecture/agent-reasoning.md`
* `docs/architecture/mcp-tooling.md`

---

Jika mau, next step yang **paling logis** setelah README ini:

1. 📐 README `packages/rube`
2. 🧩 Zod schema final CMS (prompt + workflow)
3. 🔄 Migration script BaseHub → CMS
4. 🔍 Observability trace example (Agent ↔ Rube ↔ CMS)

Tinggal bilang: **lanjut nomor berapa**.
