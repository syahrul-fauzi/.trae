**lanjut STEP 2** — ini tahap **paling krusial secara teknis** karena di sinilah `apps/docs` berubah dari “struktur rapi” menjadi **engine dokumentasi production-grade**.

Fokus STEP 2:

> **Implementasi Content Engine (FS → MDX → React) yang deterministic, scalable, dan agent-friendly**

---

# ✅ STEP 2 — Content Loader & MDX Pipeline (FINAL)

## 🎯 Target Outcome STEP 2

* Docs **dibaca langsung dari filesystem**
* Frontmatter → metadata → navigation → search
* Tidak ada BaseHub / CMS runtime
* Aman untuk agent reasoning & governance

---

## 1️⃣ Arsitektur Alur Data (Mental Model)

```
Markdown Files (content/)
        ↓
contentLoader.ts
        ↓
frontmatter + raw MDX
        ↓
mdxCompiler.ts
        ↓
React Component
        ↓
DocLayout (UI)
```

Semua **pure**, deterministic, cacheable.

---

## 2️⃣ `shared/lib/contentLoader.ts`

### Tanggung Jawab

* Resolve slug → file
* Load konten dari `content/`
* Parse frontmatter
* Tidak render UI

### Implementasi

```ts
// shared/lib/contentLoader.ts
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export type DocFile = {
  slug: string[];
  locale: string;
  content: string;
  frontmatter: Record<string, any>;
};

export async function loadDocBySlug(
  slug: string[],
  locale = "en"
): Promise<DocFile | null> {
  const filePath = path.join(
    CONTENT_ROOT,
    locale,
    ...slug
  ) + ".md";

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = matter(raw);

    return {
      slug,
      locale,
      content: parsed.content,
      frontmatter: parsed.data,
    };
  } catch {
    return null;
  }
}
```

### Prinsip Clean Code

* ❌ Tidak ada React
* ❌ Tidak ada Next import
* ✅ Pure function
* ✅ Testable

---

## 3️⃣ `shared/lib/mdxCompiler.ts`

### Tanggung Jawab

* Compile MDX → React
* Inject custom components
* Aman untuk server rendering

### Implementasi

```ts
// shared/lib/mdxCompiler.ts
import { compile } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

export async function compileMDX(source: string) {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    providerImportSource: "@mdx-js/react",
  });

  // eslint-disable-next-line no-new-func
  const fn = new Function(String(compiled));
  return fn({ ...runtime });
}
```

### Kenapa aman?

* Tidak eval user input (repo-owned docs)
* Compile time server-side
* No browser execution

---

## 4️⃣ `shared/lib/metadata.ts`

### Validasi Frontmatter (WAJIB)

```ts
// shared/lib/metadata.ts
import { z } from "zod";

export const DocFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.enum([
    "architecture",
    "package",
    "agent",
    "governance",
    "concept",
  ]),
  layer: z.enum(["core", "support", "infra"]).optional(),
  audience: z.array(z.string()).optional(),
  related: z.array(z.string()).optional(),
  version: z.string().optional(),
  owner: z.string().optional(),
});

export type DocMetadata = z.infer<typeof DocFrontmatterSchema>;
```

Dipakai di:

* runtime validation
* CI lint
* agent reasoning guardrails

---

## 5️⃣ Integrasi di Page Route

### `app/[locale]/docs/[...slug]/page.tsx`

```tsx
import { notFound } from "next/navigation";
import { loadDocBySlug } from "@/shared/lib/contentLoader";
import { compileMDX } from "@/shared/lib/mdxCompiler";
import { DocFrontmatterSchema } from "@/shared/lib/metadata";
import { DocLayout } from "@/shared/ui/DocLayout";

export default async function DocPage({
  params,
}: {
  params: { slug: string[]; locale: string };
}) {
  const doc = await loadDocBySlug(params.slug, params.locale);
  if (!doc) notFound();

  const metadata = DocFrontmatterSchema.parse(doc.frontmatter);
  const MDXContent = await compileMDX(doc.content);

  return (
    <DocLayout metadata={metadata}>
      <MDXContent />
    </DocLayout>
  );
}
```

### Prinsip Penting

* Validation **before render**
* Error = build/runtime fail → docs tidak boleh “silent wrong”

---

## 6️⃣ Table of Contents (Static Analysis)

```ts
// shared/lib/toc.ts
export function extractTOC(markdown: string) {
  return markdown
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => ({
      title: l.replace("## ", ""),
      id: l
        .replace("## ", "")
        .toLowerCase()
        .replace(/\s+/g, "-"),
    }));
}
```

Digunakan di `DocLayout` sidebar.

---

## 7️⃣ Cache Strategy (WAJIB)

```ts
// shared/lib/cache.ts
const cache = new Map<string, any>();

export function withCache<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  if (cache.has(key)) return cache.get(key);
  const value = fn();
  cache.set(key, value);
  return value;
}
```

Digunakan untuk:

* MDX compile
* content load
* metadata resolve

---

## 8️⃣ Tests Minimum (Harus Ada)

```ts
// tests/content.test.ts
import { loadDocBySlug } from "@/shared/lib/contentLoader";

it("loads existing doc", async () => {
  const doc = await loadDocBySlug(["architecture", "overview"], "en");
  expect(doc?.frontmatter.title).toBeDefined();
});
```

Docs tanpa test = hutang teknis.

---

## 9️⃣ Apa yang SECARA RESMI DITOLAK

❌ Fetch CMS runtime
❌ Hot reload webhook
❌ Dynamic DB docs
❌ AI generate docs on runtime

Docs = **source of truth**, bukan side-effect.

---

## 10️⃣ Checklist STEP 2

* [ ] `contentLoader.ts` implemented
* [ ] MDX compile works
* [ ] Frontmatter validated
* [ ] Doc page render via FS
* [ ] Tests passing

Jika ini DONE → **engine docs SBA-Agentic sudah matang**.

---

# 🔥 NEXT STEP — STEP 3

**Navigation, Taxonomy & Search Index (Agent-ready)**
→ membuat docs:

* bisa di-query agent
* bisa difilter role
* bisa jadi input reasoning

Jika siap, jawab:

> **“lanjut step 3”**`.trae/documents/apps-docs/STEP%203%20%E2%80%94%20Knowledge%20Graph%2C%20Navigation%20%26%20Search%20Engine.md`
