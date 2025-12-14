Baik.
Kita **masuk STEP 4** — ini tahap **kritis** yang menjadikan `apps/docs` **agent-native**, bukan sekadar “dibaca manusia”.

> STEP 4 = **Agent Integration Layer (Docs → Rube → Agent Reasoning)**

Aku jelaskan **tujuan, arsitektur, alur reasoning, struktur file, dan contoh implementasi** secara runtut.

---

# 🚀 STEP 4 — Agent Integration Layer (Docs ↔ Rube ↔ Agent)

## 🎯 Target Outcome STEP 4

Setelah step ini:

* Agent **bisa meminta dokumen secara kontekstual**
* Docs **tidak dikirim mentah**, tapi:

  * dipilih
  * dipotong
  * diberi metadata
* Reasoning agent **traceable & explainable**
* `apps/docs` menjadi **knowledge provider**, bukan UI-only app

---

## 1️⃣ Prinsip Arsitektural STEP 4

### ❌ Yang kita HINDARI

* Agent fetch HTML
* Agent scraping page
* Agent baca full docs tanpa filter

### ✅ Yang kita BANGUN

* **Context API**
* **Reasoning-ready payload**
* **MCP-compatible tool**

---

## 2️⃣ Arsitektur Global (Mental Model)

```
Agent
  ↓ (intent)
Rube (MCP Tool)
  ↓ (query + constraints)
apps/docs (Context API)
  ↓
Structured Knowledge Slice
```

Agent **tidak tahu**:

* filesystem
* routing
* markdown format

Agent **hanya tahu**:

> “beri saya konteks yang relevan untuk X”

---

## 3️⃣ New Capability di apps/docs

### Tambahan API Layer

```
app/api/
 └── context/
     ├── route.ts        ← 🔥 utama
     ├── schema.ts
     └── __tests__/
```

Ini **BUKAN search API**, tapi **context builder**.

---

## 4️⃣ Context Request Contract (Agent → Docs)

### `app/api/context/schema.ts`

```ts
import { z } from "zod";

export const ContextRequestSchema = z.object({
  intent: z.string(),                 // "explain cms to agent"
  topics: z.array(z.string()).optional(),
  type: z.enum([
    "architecture",
    "package",
    "agent",
    "api",
    "concept",
  ]).optional(),
  audience: z.array(z.string()).optional(),
  maxTokens: z.number().default(1500),
});
```

👉 **Intent-driven**, bukan keyword-driven.

---

## 5️⃣ Context Response Contract (Docs → Agent)

```ts
export type AgentContextResponse = {
  summary: string;
  sources: {
    slug: string;
    title: string;
    type: string;
    excerpt: string;
  }[];
  confidence: number;
};
```

Agent:

* bisa reasoning
* bisa cite
* bisa decide cukup / kurang

---

## 6️⃣ Context Builder (Core Logic)

### `shared/lib/contextBuilder.ts`

```ts
import { getAllDocs } from "./docsRegistry";

export async function buildContext({
  intent,
  topics,
  type,
  audience,
  maxTokens,
}) {
  const docs = await getAllDocs();

  const filtered = docs.filter((d) => {
    if (type && d.type !== type) return false;
    if (audience && !audience.some((a) => d.audience?.includes(a)))
      return false;
    if (topics && !topics.some((t) => d.content.includes(t)))
      return false;
    return true;
  });

  const slices = filtered.slice(0, 5).map((d) => ({
    slug: d.slug,
    title: d.title,
    type: d.type,
    excerpt: d.content.slice(0, 400),
  }));

  return {
    summary: `Context for intent: ${intent}`,
    sources: slices,
    confidence: Math.min(1, slices.length / 3),
  };
}
```

> Ini **deliberately simple** → nanti bisa diupgrade ke semantic ranking.

---

## 7️⃣ Context API Route

### `app/api/context/route.ts`

```ts
import { NextResponse } from "next/server";
import { ContextRequestSchema } from "./schema";
import { buildContext } from "@/shared/lib/contextBuilder";

export async function POST(req: Request) {
  const body = ContextRequestSchema.parse(await req.json());

  const context = await buildContext(body);

  return NextResponse.json(context);
}
```

---

## 8️⃣ Integrasi ke Rube (MCP Tool)

### `packages/rube/tools/docsContext.tool.ts`

```ts
export const DocsContextTool = {
  name: "docs_context",
  description: "Retrieve SBA documentation context for agent reasoning",
  inputSchema: {
    intent: "string",
    type: "string?",
    audience: "string[]?",
  },
  async execute(input, ctx) {
    const res = await fetch(
      `${ctx.env.DOCS_BASE_URL}/api/context`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );

    return res.json();
  },
};
```

🔥 Sekarang **Agent → Rube → Docs** sudah hidup.

---

## 9️⃣ Agent Reasoning Flow (Explicit)

1. Agent menerima task
2. Agent menentukan:

   * intent
   * domain
3. Agent memanggil:

   ```
   docs_context({
     intent: "...",
     type: "architecture",
     audience: ["backend"]
   })
   ```
4. Agent:

   * membaca summary
   * reasoning dengan sources
   * optionally follow-up

---

## 10️⃣ Observability & Governance

Tambahkan log di context API:

```ts
logger.info("docs.context.request", {
  intent,
  topics,
  type,
});
```

Metrics:

* context hit rate
* average sources returned
* token estimate

---

## 11️⃣ Dampak ke apps/docs (Ringkas)

| Area       | Dampak            |
| ---------- | ----------------- |
| UI         | ❌ tidak berubah   |
| API        | ✅ bertambah       |
| Search     | ⬆️ dipakai agent  |
| Governance | ⬆️ wajib metadata |
| Value      | 🚀 massive        |

---

## 12️⃣ Checklist STEP 4

* [ ] context API tersedia
* [ ] schema tervalidasi
* [ ] docsRegistry reusable
* [ ] Rube tool terdaftar
* [ ] agent bisa reasoning dari docs

---

# 🔜 NEXT — STEP 5

**STEP 5: Semantic Layer**

* embeddings
* relevance scoring
* agent feedback loop
* “doc confidence per answer”

Jika siap:

> **“lanjut step 5”**`.trae/documents/apps-docs/STEP%205%20%E2%80%94%20Semantic%20Layer%20%26%20Agent%20Feedback%20Loop.md`
