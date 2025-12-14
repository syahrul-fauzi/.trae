**lanjut STEP 5** — ini adalah **loncatan kualitas terbesar** untuk `apps/docs` karena di tahap ini **docs menjadi reasoning substrate**, bukan sekadar context fetcher.

> **STEP 5 = Semantic Layer + Feedback Loop (Docs ↔ Agent ↔ Memory)**

Aku susun **sangat sistematis**: tujuan → arsitektur → struktur folder → flow reasoning → implementasi → governance.

---

# 🧠 STEP 5 — Semantic Layer & Agent Feedback Loop

## 🎯 Target Outcome STEP 5

Setelah step ini:

* Agent **tidak lagi mengandalkan keyword**
* Context dipilih berdasarkan **makna**
* Agent bisa:

  * memberi feedback kualitas dokumen
  * memicu peningkatan docs
* `apps/docs` menjadi **living knowledge system**

---

## 1️⃣ Prinsip Inti STEP 5

### Upgrade Paradigma

| Dari         | Ke                     |
| ------------ | ---------------------- |
| String match | Semantic relevance     |
| Static docs  | Adaptive knowledge     |
| One-way read | Bidirectional learning |
| Human-only   | Human + Agent          |

---

## 2️⃣ Arsitektur Tingkat Tinggi

```
Docs (MDX)
   ↓
Embedding Index
   ↓
Semantic Context Builder
   ↓
Agent Reasoning
   ↓
Feedback / Score
   ↓
Docs Quality Signal
```

> ⚠️ Embedding **bukan search**, tapi **alignment engine**.

---

## 3️⃣ Struktur Folder Baru (apps/docs)

```txt
apps/docs/
├── app/api/
│   ├── context/
│   │   ├── route.ts
│   │   └── semantic.ts        ← NEW
│   ├── feedback/
│   │   └── route.ts           ← NEW
├── shared/
│   ├── semantic/
│   │   ├── embedder.ts
│   │   ├── index.ts
│   │   ├── ranker.ts
│   │   └── types.ts
│   └── docs/
│       ├── registry.ts
│       └── loader.ts
```

---

## 4️⃣ Semantic Index Model

### `shared/semantic/types.ts`

```ts
export type SemanticDoc = {
  id: string;
  slug: string;
  type: "architecture" | "package" | "agent" | "api";
  embedding: number[];
  tokenCount: number;
};
```

---

## 5️⃣ Embedding Strategy (Pragmatis)

### Prinsip

* **Chunk per section**, bukan per file
* Embed **title + heading + paragraph**
* Cache hasil embed (tidak real-time)

### `shared/semantic/embedder.ts`

```ts
export async function embedText(text: string): Promise<number[]> {
  // abstraction — provider agnostic
  return embeddingProvider.embed(text);
}
```

> Provider bisa:
>
> * OpenAI
> * Local embedding model
> * Supabase vector
> * pgvector

---

## 6️⃣ Semantic Index Build (Offline / CI)

### `tools/docs/build-semantic-index.ts`

```ts
for (const doc of docs) {
  const chunks = splitIntoChunks(doc.content);

  for (const chunk of chunks) {
    const embedding = await embedText(chunk.text);

    await saveIndex({
      id: chunk.id,
      slug: doc.slug,
      type: doc.type,
      embedding,
      tokenCount: chunk.tokens,
    });
  }
}
```

🔐 **Rule**:

> *Embedding build tidak dijalankan oleh agent.*

---

## 7️⃣ Semantic Ranker (Runtime)

### `shared/semantic/ranker.ts`

```ts
export function rankBySimilarity(
  queryEmbedding: number[],
  docs: SemanticDoc[]
) {
  return docs
    .map((d) => ({
      ...d,
      score: cosineSimilarity(queryEmbedding, d.embedding),
    }))
    .sort((a, b) => b.score - a.score);
}
```

---

## 8️⃣ Semantic Context Builder

### `app/api/context/semantic.ts`

```ts
export async function buildSemanticContext({
  intent,
  type,
  maxTokens,
}) {
  const queryEmbedding = await embedText(intent);

  const candidates = await loadSemanticDocs(type);

  const ranked = rankBySimilarity(queryEmbedding, candidates);

  return assembleContext(ranked.slice(0, 6), maxTokens);
}
```

---

## 9️⃣ Context API Upgrade (Hybrid)

```ts
if (semanticEnabled) {
  return buildSemanticContext(input);
}

return buildContext(input);
```

> Ini membuat **safe rollout** & fallback.

---

## 🔁 10️⃣ Agent Feedback Loop

### Feedback API

```txt
POST /api/feedback
```

```ts
{
  answerId: "uuid",
  usedDocs: ["cms-architecture", "rube-agent"],
  confidence: 0.82,
  missing: ["example", "diagram"]
}
```

---

## 11️⃣ Feedback Storage (Minimal)

```ts
type DocFeedback = {
  docSlug: string;
  score: number;
  notes?: string;
};
```

Stored di:

* DB
* analytics package
* future CMS back-prop

---

## 12️⃣ How Agent Uses Feedback

Agent reasoning pattern:

```
1. Retrieve context
2. Answer
3. Evaluate confidence
4. Send feedback
```

Ini membuat:

* doc yang buruk → jarang dipakai
* doc bagus → naik rank

---

## 13️⃣ Governance & Safety

| Risk            | Control           |
| --------------- | ----------------- |
| Agent poisoning | feedback weighted |
| Drift           | human override    |
| Cost            | embedding cached  |
| Bias            | multi-doc context |

---

## 14️⃣ Observability Signals

Metrics:

* avg similarity score
* context length
* doc reuse rate
* feedback confidence trend

---

## 15️⃣ Checklist STEP 5

* [ ] embedding pipeline ready
* [ ] semantic index stored
* [ ] ranker working
* [ ] hybrid context enabled
* [ ] feedback endpoint live

---

# 🎯 Posisi apps/docs Sekarang

Setelah STEP 5:

> `apps/docs` = **Knowledge Substrate for Agentic Reasoning**

Bukan:

* blog
* wiki
* static docs

---

## 🔜 STEP 6 (Opsional tapi Powerful)

**STEP 6: Agent-Aware Documentation**

* doc ditulis untuk agent
* “reasoning hints”
* expected tool usage
* guardrails per section

Jika siap:

> **“lanjut step 6”**`.trae/documents/apps-docs/STEP%206%20%E2%80%94%20Agent-Aware%20Documentation.md`
