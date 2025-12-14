Baik.
Ini **tahap sangat strategis** dan *jarang dilakukan dengan benar*.

> 🧰 **Rube-aware Docs = Tool Capability Matrix**
> Tujuannya: **agent TIDAK menebak kemampuan tool** — agent *diberi peta kemampuan resmi, tervalidasi, dan aman*.

---

# 🧰 RUBE-AWARE DOCS — TOOL CAPABILITY MATRIX

## 🎯 Outcome

Setelah ini:

* Agent **tahu tool apa bisa apa**
* Docs **tidak bisa “mengarang” kemampuan tool**
* Rube menjadi **single source of truth** untuk:

  * capability
  * constraints
  * cost
  * safety

---

## 1️⃣ Masalah yang Diselesaikan

Tanpa matrix:

> “Mungkin tool ini bisa update data…”

Dengan matrix:

> “Tool X hanya READ, tidak WRITE.”

---

## 2️⃣ Konsep Inti

```
Tool Registry (Rube)
   ↓
Capability Matrix
   ↓
Docs (Read-only projection)
   ↓
Agent Reasoning
```

📌 **Docs membaca matrix, bukan sebaliknya**

---

## 3️⃣ Tool Capability Model (Canonical)

### `packages/rube/src/registry/tool.ts`

```ts
export type ToolCapability = {
  name: string;
  description: string;
  domain: "cms" | "billing" | "analytics" | "agent";
  actions: ("read" | "write" | "execute")[];
  inputs: string[];
  outputs: string[];
  tenantScoped: boolean;
  sideEffects: boolean;
  cost: "low" | "medium" | "high";
  safety: {
    pii: boolean;
    destructive: boolean;
  };
};
```

> ⚠️ Ini **tidak boleh** didefinisikan di docs.

---

## 4️⃣ Capability Registry (Rube)

```ts
export const CMS_CONTENT_GET: ToolCapability = {
  name: "cms.content.get",
  description: "Read CMS content",
  domain: "cms",
  actions: ["read"],
  inputs: ["slug", "version"],
  outputs: ["content"],
  tenantScoped: true,
  sideEffects: false,
  cost: "low",
  safety: {
    pii: false,
    destructive: false,
  },
};
```

---

## 5️⃣ Matrix Builder (Docs Projection)

Docs **tidak hardcode**, tapi **consume snapshot**.

### `apps/docs/shared/tools/capabilities.ts`

```ts
export type ToolCapabilityDoc = Pick<
  ToolCapability,
  "name" | "description" | "actions" | "tenantScoped" | "sideEffects" | "cost"
>;
```

---

## 6️⃣ Sync Strategy (Safe)

### Recommended

* **CI job**
* Export JSON dari Rube
* Import ke docs

```bash
pnpm rube export:capabilities > apps/docs/data/tools.json
```

📌 No runtime coupling.

---

## 7️⃣ Docs Structure

```txt
apps/docs/content/tools/
├── index.mdx
├── cms.mdx
├── analytics.mdx
└── agent.mdx
```

---

## 8️⃣ Tool Matrix Rendering (Human + Agent)

### Example: `tools/cms.mdx`

```mdx
---
type: tool-matrix
agent:
  useWhen:
    - "cms operation"
    - "content fetch"
---

## CMS Tools

<ToolMatrix domain="cms" />
```

---

## 9️⃣ ToolMatrix Component

```tsx
export function ToolMatrix({ domain }) {
  const tools = toolsData.filter(t => t.domain === domain);

  return (
    <table>
      <thead>
        <tr>
          <th>Tool</th>
          <th>Actions</th>
          <th>Side Effects</th>
          <th>Tenant</th>
          <th>Cost</th>
        </tr>
      </thead>
      <tbody>
        {tools.map(t => (
          <tr key={t.name}>
            <td>{t.name}</td>
            <td>{t.actions.join(", ")}</td>
            <td>{t.sideEffects ? "Yes" : "No"}</td>
            <td>{t.tenantScoped ? "Scoped" : "Global"}</td>
            <td>{t.cost}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## 🔐 10️⃣ Agent Consumption Rules

Agent **HARUS**:

* check capability before tool use
* never assume extra ability
* reject mismatched doc hint

### Agent Policy Snippet

```txt
Before invoking any tool:
- Verify capability matrix
- Reject if action not allowed
```

---

## 11️⃣ Tool Hint Validation

Jika doc menulis:

```yaml
tools:
  - cms.content.delete
```

Tapi matrix:

```ts
actions: ["read"]
```

➡️ **Docs lint FAIL**

---

## 12️⃣ Security Guarantees

| Risk                 | Mitigated |
| -------------------- | --------- |
| Tool hallucination   | ✔         |
| Privilege escalation | ✔         |
| Doc-driven execution | ✔         |
| Cost explosion       | ✔         |

---

## 13️⃣ Observability Signals

* attempted invalid action
* matrix mismatch
* most-used tools
* cost per tool

---

## 14️⃣ Governance Rules

* Tool changes **harus lewat Rube**
* Docs hanya read-only projection
* CI blocks mismatch
* Agent obeys matrix

---

## 15️⃣ End-to-End Flow

```
1. Dev adds tool in Rube
2. Capability defined
3. CI exports matrix
4. Docs updated
5. Agent sees updated matrix
6. Agent reasons safely
```

---

# 🏆 Final Positioning

> **Rube = Authority**
> **Docs = Instruction Layer**
> **Agent = Executor with Constraints**

Ini **arsitektur agentic paling aman dan scalable**.

---

## 🔜 Lanjutan Terbaik

Rekomendasi berikutnya (urut prioritas):

1. **Reasoning Replay & Tool Safety Simulation** `.trae/documents/apps-docs/Reasoning Replay & Tool Safety Simulation.md` ⭐⭐⭐⭐⭐
2. Docs Security Test Harness
3. Cost-aware Agent Planning
4. Compliance Evidence Generator
