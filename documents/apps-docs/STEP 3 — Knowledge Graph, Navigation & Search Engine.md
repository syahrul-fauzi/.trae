**lanjut STEP 3** — ini tahap yang mengubah `apps/docs` dari *static documentation site* menjadi **Knowledge System yang agent-ready, searchable, dan governable**.

Fokus STEP 3:

> **Navigation Graph + Taxonomy + Search Index (untuk Human & Agent Reasoning)**

---

# ✅ STEP 3 — Knowledge Graph, Navigation & Search Engine

## 🎯 Target Outcome STEP 3

* Semua dokumen membentuk **graph eksplisit**
* Navigasi tidak hardcoded
* Search **semantic-aware**
* Agent bisa:

  * discover
  * reason
  * cite
  * trace source

---

## 1️⃣ Prinsip Utama (WAJIB Dipahami)

### Docs ≠ Pages

Docs = **knowledge nodes**

Setiap dokumen:

* punya identity
* punya relationship
* punya audience & scope
* bisa direferensikan agent

---

## 2️⃣ Taksonomi Global (Single Source of Truth)

### `shared/config/docs-taxonomy.ts`

```ts
export const DOC_TYPES = [
  "architecture",
  "package",
  "agent",
  "governance",
  "concept",
  "api",
] as const;

export const DOC_AUDIENCE = [
  "product",
  "backend",
  "frontend",
  "ai",
  "infra",
  "security",
] as const;

export const DOC_LAYER = [
  "core",
  "support",
  "infra",
] as const;
```

Digunakan oleh:

* frontmatter validation
* sidebar filter
* agent reasoning

---

## 3️⃣ Navigation Builder (Filesystem → Graph)

### `shared/lib/navBuilder.ts`

```ts
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export type NavNode = {
  title: string;
  slug: string;
  locale: string;
  type?: string;
  children?: NavNode[];
};

async function walk(
  dir: string,
  locale: string,
  baseSlug: string[] = []
): Promise<NavNode[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const nodes: NavNode[] = [];

  for (const e of entries) {
    if (e.isDirectory()) {
      const children = await walk(
        path.join(dir, e.name),
        locale,
        [...baseSlug, e.name]
      );
      nodes.push({
        title: e.name,
        slug: [...baseSlug, e.name].join("/"),
        locale,
        children,
      });
    }

    if (e.isFile() && e.name.endsWith(".md")) {
      const raw = await fs.readFile(path.join(dir, e.name), "utf-8");
      const fm = matter(raw).data;

      nodes.push({
        title: fm.title ?? e.name.replace(".md", ""),
        slug: [...baseSlug, e.name.replace(".md", "")].join("/"),
        locale,
        type: fm.type,
      });
    }
  }

  return nodes;
}

export async function buildNav(locale: string) {
  return walk(path.join(CONTENT_ROOT, locale), locale);
}
```

### Keunggulan

* No hardcoded nav
* Locale-aware
* Agent bisa traverse graph

---

## 4️⃣ Knowledge Index (Search Foundation)

### `shared/lib/searchIndexer.ts`

```ts
export type SearchDoc = {
  slug: string;
  title: string;
  content: string;
  type: string;
  audience?: string[];
};

export function buildSearchIndex(docs: SearchDoc[]) {
  return docs.map((d) => ({
    id: d.slug,
    title: d.title,
    text: d.content.slice(0, 2000),
    type: d.type,
    audience: d.audience,
  }));
}
```

Output bisa digunakan untuk:

* simple keyword search
* vector embedding
* agent retrieval

---

## 5️⃣ Search API (Server Route)

### `app/api/search/route.ts`

```ts
import { NextResponse } from "next/server";
import { getAllDocs } from "@/shared/lib/docsRegistry";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";

  const docs = await getAllDocs();
  const results = docs.filter((d) =>
    d.content.toLowerCase().includes(q.toLowerCase())
  );

  return NextResponse.json(results.slice(0, 10));
}
```

> ⚠️ Sederhana dulu — semantic search nanti di STEP 6

---

## 6️⃣ Docs Registry (Central Memory)

### `shared/lib/docsRegistry.ts`

```ts
import { loadDocBySlug } from "./contentLoader";

export async function getAllDocs() {
  // glob all md files (implement via fs.readdir recursive)
  // return parsed docs
}
```

Dipakai oleh:

* search
* analytics
* agent context building

---

## 7️⃣ UI Navigation Consumption

Sidebar tidak tahu filesystem.

```tsx
const nav = await buildNav(locale);
<SidebarNavigation tree={nav} />;
```

---

## 8️⃣ Agent-Friendly Metadata

Contoh frontmatter:

```yaml
---
title: CMS ↔ Rube ↔ Agent
type: architecture
audience: [backend, ai]
layer: core
related:
  - packages/rube
  - packages/cms
---
```

Agent bisa:

* filter by `type`
* restrict by `audience`
* follow `related`

---

## 9️⃣ Governance Rules (HARUS ADA)

| Rule                  | Dampak          |
| --------------------- | --------------- |
| Frontmatter wajib     | Konsistensi     |
| Tidak ada orphan docs | Graph integrity |
| Type valid            | Agent reasoning |
| Version optional      | Change trace    |

Fail = CI fail.

---

## 10️⃣ Checklist STEP 3

* [ ] taxonomy global defined
* [ ] navigation auto-built
* [ ] docs registry exists
* [ ] search API works
* [ ] metadata usable by agent

---

# 🔥 NEXT STEP — STEP 4

**Agent Integration Layer**

* MCP exposure
* Context slicing
* Reasoning input preparation

Jika siap, jawab:

> **“lanjut step 4”**`.trae/documents/apps-docs/STEP%204%20%E2%80%94%20Agent%20Integration%20Layer%20%28Docs%20%E2%86%94%20Rube%20%E2%86%94%20Agent%29.md`
