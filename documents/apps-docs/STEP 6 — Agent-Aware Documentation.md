**lanjut STEP 6** — ini adalah tahap di mana **dokumentasi benar-benar menjadi “agent-native”**, bukan sekadar *human-readable*.

> **STEP 6 = Agent-Aware Documentation (Reasoning-First Docs)**
> Ini adalah **keunggulan kompetitif SBA-Agentic**.

---

# 🧠 STEP 6 — Agent-Aware Documentation

## 🎯 Target Outcome STEP 6

Setelah step ini:

* Dokumen **secara eksplisit membimbing agent**
* Agent:

  * tahu *kapan* dokumen dipakai
  * tahu *tool apa* yang harus dipanggil
  * tahu *batasan reasoning*
* Human & Agent membaca **dokumen yang sama**, tapi **agent mendapat metadata ekstra**

---

## 1️⃣ Prinsip Utama Agent-Aware Docs

### Perubahan Mindset

| Sebelumnya       | Sekarang              |
| ---------------- | --------------------- |
| Docs menjelaskan | Docs mengarahkan      |
| Natural language | Structured + NL       |
| Untuk manusia    | Dual-audience         |
| Pasif            | Aktif dalam reasoning |

---

## 2️⃣ Agent Contract Layer (Inti STEP 6)

Tambahkan **contract metadata** di setiap dokumen penting.

### Konsep

```txt
Doc Content
+ Agent Contract
+ Tool Hints
+ Reasoning Guardrails
```

---

## 3️⃣ Format Agent Contract (MDX Frontmatter)

### Contoh: `architecture/cms.mdx`

```mdx
---
title: CMS Architecture
type: architecture
agent:
  useWhen:
    - "content management"
    - "cms architecture"
    - "structured content"
  tools:
    - cms.content.get
    - cms.schema.resolve
  guarantees:
    - "content versioned"
    - "tenant isolated"
  constraints:
    - "no direct db access"
    - "use rube for integration"
  confidence: 0.95
---
```

> 🟢 Human bisa abaikan ini
> 🧠 Agent **tidak boleh mengabaikan ini**

---

## 4️⃣ Parsing Agent Contract

### `shared/docs/agent-contract.ts`

```ts
export type AgentContract = {
  useWhen: string[];
  tools: string[];
  guarantees?: string[];
  constraints?: string[];
  confidence?: number;
};
```

```ts
export function extractAgentContract(doc): AgentContract | null {
  return doc.frontmatter?.agent ?? null;
}
```

---

## 5️⃣ Agent-Aware Context Filter

### Upgrade Context Builder

```ts
if (doc.agent?.useWhen?.some(match(intent))) {
  eligibleDocs.push(doc);
}
```

🧠 Efek:

* dokumen *tidak relevan* otomatis dieliminasi
* context **lebih kecil tapi lebih tajam**

---

## 6️⃣ Tool Hint Injection

Agent **tidak menebak tool**, tapi **disarankan secara eksplisit**.

### Context Injection

```txt
Recommended tools for this context:
- cms.content.get
- rube.execute
```

Digunakan oleh:

* ReAct
* Toolformer
* LangGraph
* Mastra

---

## 7️⃣ Reasoning Guardrails

Dokumen bisa **melarang reasoning tertentu**.

### Contoh Guardrail

```yaml
constraints:
  - "never bypass rube"
  - "no direct SQL"
  - "respect tenant boundary"
```

Agent reasoning engine membaca ini sebagai **hard rule**.

---

## 8️⃣ Confidence-Aware Context Weighting

Gunakan `confidence` sebagai prioritas ranking.

```ts
finalScore = semanticScore * doc.agent.confidence;
```

📈 Doc dengan confidence tinggi → lebih sering dipakai.

---

## 9️⃣ Structured Section Semantics

Tambahkan semantic tags per section:

```mdx
## Cache Strategy
:::agent
intent: performance
risk: stale-data
:::
```

Dipakai untuk:

* fine-grained chunking
* selective inclusion

---

## 🔁 10️⃣ Feedback Loop (Doc-Level)

Agent bisa memberi feedback spesifik:

```ts
{
  doc: "cms-architecture",
  section: "Cache Strategy",
  issue: "missing example",
  severity: "medium"
}
```

---

## 11️⃣ Human Workflow Upgrade

### Writer Checklist (Docs Team)

* [ ] agent.useWhen jelas
* [ ] tool hints valid
* [ ] constraints realistis
* [ ] confidence < 1.0
* [ ] examples tersedia

---

## 12️⃣ Quality Gates (CI)

Tambahkan linting:

```bash
pnpm docs:lint-agent
```

Rules:

* docs `type=architecture` **wajib** agent contract
* tool name harus valid
* constraint harus dikenali

---

## 13️⃣ Governance Model

| Risiko            | Solusi                 |
| ----------------- | ---------------------- |
| Overfitting agent | human override         |
| Doc drift         | confidence decay       |
| Agent misuse      | constraint enforcement |
| Chaos tools       | tool registry          |

---

## 14️⃣ Contoh Reasoning (Before vs After)

### Sebelum

> Agent: “Mungkin saya pakai CMS API langsung…”

### Sesudah

> Agent:
> “Dokumen ini melarang direct DB → gunakan rube.execute → cms.content.get”

---

## 15️⃣ Checklist STEP 6

* [ ] agent contract parser
* [ ] context filter aware agent
* [ ] tool hint injection
* [ ] guardrail enforcement
* [ ] feedback pipeline

---

# 🏆 Posisi apps/docs Setelah STEP 6

> **apps/docs = Agent Instruction Layer**

Bukan hanya:

* source of truth
  Tapi:
* **reasoning guide**
* **tool router**
* **safety boundary**

---

## 🔜 STEP 7 (Opsional / Advanced)

**STEP 7: Self-Evolving Docs**

* agent propose doc PR
* human approve
* confidence auto-adjust

Jika siap:

> **“lanjut step 7”**`.trae/documents/apps-docs/STEP%207%20%E2%80%94%20Self-Evolving%20Docs%20%28Agent%20%E2%86%92%20Proposal%20%E2%86%92%20Human%20Approval%29.md`
