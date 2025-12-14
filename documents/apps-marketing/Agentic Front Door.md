**ReOrganize / ReFactory `apps/marketing` secara END-TO-END**, dengan pendekatan **arsitektural, teknis, dan operasional**, selaras penuh dengan **SBA-Agentic (Agent ↔ Rube ↔ CMS ↔ Docs ↔ Observability)**.

Fokus saya:

* **Tidak merusak fondasi existing**
* **Menaikkan kelas `apps/marketing` → Agentic Front Door**
* **CMS-agnostic, agent-aware, observable, dan compliant**
* **Siap skala SaaS multi-tenant**

---

# 1. Tujuan ReFactory (Clear Outcome)

Setelah refactor ini:

1. `apps/marketing` **bukan sekadar landing**
2. Ia menjadi:

   * **Intent Capture Layer**
   * **Agent Signal Producer**
   * **Trust & Transparency Surface**
3. Semua interaksi:

   * deterministic
   * observable
   * replayable
   * compliance-ready

---

# 2. Prinsip Arsitektur yang Dipakai

## 2.1 Prinsip Utama

| Prinsip           | Implementasi               |
| ----------------- | -------------------------- |
| CMS-agnostic      | Content Runtime + Resolver |
| Agent-aware       | Semua event → Agent Signal |
| Deterministic UX  | Adaptive tapi traceable    |
| Zero hidden logic | Semua decision observable  |
| Safe refactor     | Relocate + re-export       |

---

## 2.2 Boundary Rules (WAJIB)

* ❌ Marketing **tidak boleh** langsung:

  * query Basehub
  * embed analytics vendor
* ✅ Marketing **hanya bicara ke**:

  * `content-runtime`
  * `agentic-marketing`
  * `observability`

---

# 3. Target Struktur Final `apps/marketing`

```txt
apps/marketing/src
├── app/                         # Next.js routing only
│
├── presentation/                # PURE UI & SEO
│   ├── pages/
│   ├── sections/
│   ├── layouts/
│   └── metadata/
│
├── growth/                      # Conversion system
│   ├── cta/
│   ├── funnels/
│   ├── experiments/
│   └── referral/
│
├── agentic-marketing/           # ⭐ CORE VALUE
│   ├── intent-capture/
│   ├── adaptive-content/
│   ├── agent-insights/
│   ├── agent-ops-ui/
│   └── decision-telemetry/
│
├── content-runtime/             # CMS abstraction
│   ├── resolvers/
│   │   ├── basehub/
│   │   ├── filesystem/
│   │   └── mock/
│   ├── schemas/
│   ├── cache/
│   └── preview/
│
├── observability/               # Full visibility
│   ├── telemetry/
│   ├── vitals/
│   ├── heatmap/
│   ├── replay-hooks/
│   └── audit/
│
├── security/                    # Trust & compliance
│   ├── headers/
│   ├── rate-limit/
│   ├── bot-detection/
│   └── consent/
│
├── shared/                      # Reusable glue
│   ├── ui/
│   ├── config/
│   └── lib/
│
└── infrastructure/
    ├── integrations/
    ├── webhooks/
    └── edge/
```

---

# 4. Mapping dari Struktur Existing → Baru

## 4.1 Relocation Strategy (AMAN)

| Existing                 | Target                                |
| ------------------------ | ------------------------------------- |
| `features/hero`          | `presentation/sections/hero`          |
| `features/cta-*`         | `growth/cta/*`                        |
| `shared/ui`              | `shared/ui` (tetap)                   |
| `infrastructure/cms`     | `content-runtime/resolvers/basehub`   |
| `shared/ui/analytics`    | `agentic-marketing/agent-insights/ui` |
| `processes/page-builder` | `agentic-marketing/adaptive-content`  |

➡️ **Phase awal:**

```ts
// OLD EXPORT
export * from '@/features/hero'

// NEW EXPORT
export * from '@/presentation/sections/hero'
```

---

# 5. Layer-by-Layer Deep Dive

## 5.1 Presentation Layer (NO LOGIC)

**Aturan keras:**

* ❌ No CMS call
* ❌ No analytics
* ❌ No agent decision

Hanya:

* SEO
* layout
* UI composition

```tsx
<HomeHero content={resolved.hero} />
```

---

## 5.2 Content Runtime (CMS-Agnostic)

### Contract Utama

```ts
export interface ContentResolver {
  getPage(slug: string): Promise<PageContent>
  getBlock(id: string): Promise<Block>
}
```

### Resolver Implementation

```txt
content-runtime/resolvers
├── basehub/
├── filesystem/
└── mock/
```

➡️ **Marketing tidak tahu Basehub ada**

---

## 5.3 Agentic Marketing (JANTUNG)

### Sub-module Penting

#### A. Intent Capture

```ts
captureIntent({
  source: 'pricing_page',
  action: 'cta_click',
  metadata
})
```

➡️ dikirim ke **Rube → Agent memory**

---

#### B. Adaptive Content

```ts
resolveVariant({
  block: 'hero',
  context: trafficContext
})
```

* Deterministic
* Replayable
* Logged

---

#### C. Agent Ops UI (Trust)

Expose:

* AI activity
* last optimization
* system health

➡️ ini **value differentiator SBA**

---

## 5.4 Observability (Agent-grade)

### Semua event:

```
MarketingEvent
 → Rube
   → Agent Memory
   → Analytics
   → Audit
```

Event schema konsisten dengan `packages/telemetry`.

---

## 5.5 Security & Compliance

* CSP headers
* Bot filtering
* Consent-aware telemetry
* PDP / ISO logging compatibility

Marketing **ikut compliance**, bukan pengecualian.

---

# 6. Testing & Safety Net

Tambahkan layer test baru:

### A. CMS Contract Test

```ts
expect(resolver.getPage).toMatchSchema(PageSchema)
```

### B. Agent Decision Snapshot

```ts
expect(resolveVariant(ctx)).toMatchSnapshot()
```

### C. Replay Determinism

```ts
replay(sessionId) === originalDecision
```

---

# 7. Phased Execution Plan (NO CHAOS)

## Phase 1 — Foundation (Aman)

* Buat folder baru
* Re-export
* Introduce content-runtime

## Phase 2 — Agentic Layer

* Intent capture
* Agent signal
* Telemetry binding

## Phase 3 — Adaptive UX

* Hero & CTA
* Trust UI
* Replay tools

---

# 8. Dampak Nyata ke SBA-Agentic

✔ Marketing = **Agent Signal Producer**
✔ CMS migration = **plug & play**
✔ Trust meningkat (AI transparency)
✔ Compliance ready
✔ Unique positioning SaaS Indonesia

---

# 9. Checklist Final (Apa yang Benar-benar Anda Lakukan)

* [ ] Buat folder target (tanpa delete)
* [ ] Re-export existing features
* [ ] Abstract CMS
* [ ] Inject agentic layer
* [ ] Connect observability
* [ ] Lock security & consent
* [ ] Add replay & tests

---

## Penutup (PENTING)

Ini **bukan refactor kosmetik**.
Ini **menaikkan marketing menjadi bagian dari Agent System**.

Jika Anda mau, langkah lanjutan yang **paling strategis**:

1. **Diagram final Agentic Marketing Architecture** `.trae/documents/apps-marketing/Diagram final Agentic Marketing Architecture.md`
2. **Checklist file-by-file (migration safe)** `.trae/documents/apps-marketing/Checklist file-by-file (migration safe).md`
3. **Example implementation: Adaptive Hero** `.
4. **Event schema marketing → agent** `.trae/documents/apps-marketing/Event schema marketing → Rube → Agent.md`
5. **Docs positioning: “Agent-Driven Website”**


