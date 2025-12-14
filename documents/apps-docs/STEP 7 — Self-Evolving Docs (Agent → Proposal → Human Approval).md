**lanjut STEP 7** — ini adalah tahap **paling matang** dan *enterprise-grade* dari `apps/docs`.

> **STEP 7 = Self-Evolving Documentation System (Human-in-the-Loop)**
> Dokumentasi **tidak lagi statis**, tapi **berkembang berdasarkan pemakaian nyata agent** — dengan kontrol penuh di tangan manusia.

---

# 🧬 STEP 7 — Self-Evolving Docs (Agent → Proposal → Human Approval)

## 🎯 Target Outcome STEP 7

Setelah step ini:

* Agent **boleh mengusulkan perbaikan dokumen**
* Tidak ada auto-write ke docs (AMAN)
* Human tetap gatekeeper
* Docs berevolusi berdasarkan:

  * failure reasoning
  * missing context
  * repeated clarification

Ini adalah **knowledge flywheel**.

---

## 1️⃣ Prinsip Keamanan (WAJIB)

> ❌ Agent **tidak pernah** menulis langsung ke repo
> ✅ Agent **hanya membuat proposal terstruktur**

---

## 2️⃣ Arsitektur Tingkat Tinggi

```
Agent Reasoning
   ↓
Gap Detection
   ↓
Doc Change Proposal
   ↓
Review Queue
   ↓
Human Approval
   ↓
Docs Updated
   ↓
Confidence Adjusted
```

---

## 3️⃣ Jenis Proposal yang Diizinkan

| Type              | Contoh                     |
| ----------------- | -------------------------- |
| missing-example   | “Tambahkan contoh API”     |
| unclear-section   | “Penjelasan ambigu”        |
| outdated          | “API sudah berubah”        |
| missing-guardrail | “Constraint belum ditulis” |
| tool-hint         | “Tool X harus disebut”     |

❌ **Tidak diizinkan**:

* perubahan arsitektur
* opini bisnis
* rewrite total

---

## 4️⃣ Proposal Schema (Contract Ketat)

### `shared/docs/proposals.ts`

```ts
export type DocProposal = {
  id: string;
  docSlug: string;
  section?: string;
  type:
    | "missing-example"
    | "clarification"
    | "outdated"
    | "tool-hint"
    | "guardrail";
  description: string;
  suggestedChange?: string;
  evidence: {
    agentRunId: string;
    question: string;
  };
  confidence: number;
};
```

---

## 5️⃣ Proposal Creation (Agent Side)

Agent **hanya boleh memanggil tool ini**:

```txt
docs.proposeChange
```

Contoh payload:

```json
{
  "docSlug": "cms-architecture",
  "section": "Cache Strategy",
  "type": "missing-example",
  "description": "Tidak ada contoh penggunaan cache invalidation",
  "confidence": 0.78,
  "evidence": {
    "agentRunId": "run_123",
    "question": "Bagaimana invalidasi cache CMS?"
  }
}
```

---

## 6️⃣ Proposal API (apps/docs)

```txt
POST /api/docs/proposals
```

### Behavior

* validate schema
* rate limit
* attach metadata
* store immutable

---

## 7️⃣ Review Queue (Human-Facing)

Bisa berupa:

* dashboard internal
* GitHub issue generator
* PR draft generator (advanced)

### Minimal UI Fields

* doc
* section
* proposal type
* confidence
* evidence
* suggested change

---

## 8️⃣ Confidence Auto-Adjustment

Saat proposal **diterima**:

```ts
doc.agent.confidence += 0.01;
```

Saat proposal **sering muncul**:

```ts
doc.agent.confidence -= 0.02;
```

📉 Doc bermasalah → turun prioritas
📈 Doc solid → naik ranking

---

## 9️⃣ Proposal Deduplication

Hindari spam:

```ts
hash = hash(docSlug + section + type);
```

* proposal sama → di-merge
* confidence di-aggregate

---

## 10️⃣ Observability & Signals

Metrics penting:

* proposals per doc
* accepted vs rejected
* mean confidence
* time to resolution

Ini jadi **doc quality KPI**.

---

## 11️⃣ Governance Rules

| Risiko         | Kontrol            |
| -------------- | ------------------ |
| Agent flood    | quota              |
| Bias agent     | human review       |
| Doc hijack     | schema + allowlist |
| Over-evolution | confidence decay   |

---

## 12️⃣ CI Integration (Opsional)

Saat PR docs:

* tampilkan:

  * proposal history
  * affected agent flows
  * confidence delta

Human reviewer **punya konteks lengkap**.

---

## 13️⃣ End-to-End Example

1. Agent gagal menjawab optimal
2. Agent sadar:

   > “Dokumen tidak punya contoh”
3. Agent submit proposal
4. Human approve
5. Docs ditambah contoh
6. Confidence naik
7. Agent jawab lebih baik next time

🔁 **Closed learning loop**

---

## 14️⃣ Checklist STEP 7

* [ ] proposal schema locked
* [ ] proposal API live
* [ ] review workflow defined
* [ ] confidence adjustment logic
* [ ] observability enabled

---

# 🏆 FINAL POSITIONING `apps/docs`

Setelah STEP 1 → 7:

> **apps/docs = Agentic Knowledge System**

Bukan:

* docs
* wiki
* CMS

Tapi:

* **reasoning substrate**
* **tool instruction layer**
* **self-improving knowledge base**

---

## 🔚 Apa Selanjutnya?

Rekomendasi urutan lanjutan:

1. 🔐 **Security hardening untuk agent ↔ docs**
2. ⚙️ **Rube-aware docs (tool capability matrix)**
3. 🧪 **Reasoning replay & simulation**
4. 📊 **Docs quality dashboard**


