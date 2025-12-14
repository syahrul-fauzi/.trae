Baik. Kita fokus **Event Schema Marketing → Rube → Agent** yang **production-grade**, **replayable**, **tenant-aware**, dan **compliance-ready**, selaras dengan arsitektur SBA-Agentic yang sedang kamu bangun.

Aku susun dari **prinsip → kontrak inti → contoh konkret → alur end-to-end → implikasi ke packages**.

---

# 1️⃣ Prinsip Desain Event (WAJIB)

Event marketing **BUKAN sekadar analytics**, tapi **input reasoning agent**.

### Prinsip kunci

1. **Event ≠ Log**

   * Event = fakta domain (immutable)
   * Log = detail teknis

2. **Agent-Consumable**

   * Deterministic
   * Schema versioned
   * Explainable

3. **Rube sebagai Gatekeeper**

   * Validasi
   * Rate limit
   * Policy
   * Observability hook

4. **Tenant + Consent aware**

   * Semua event harus bisa:

     * difilter per tenant
     * dimatikan jika consent false

---

# 2️⃣ Event Taxonomy (Marketing Domain)

```txt
MarketingEvent
├── PageViewed
├── ContentImpression
├── CTAIntentCaptured
├── FunnelStepEntered
├── ConversionCompleted
├── AdaptiveDecisionMade
```

> ❗ **Agent hanya boleh reasoning di atas event domain, bukan raw click**

---

# 3️⃣ Core Envelope (Rube Event Contract)

📍 **packages/rube/contracts/event-envelope.ts**

```ts
export interface RubeEventEnvelope<TPayload> {
  meta: {
    eventId: string
    eventType: string
    eventVersion: 'v1'
    occurredAt: string

    tenantId: string
    workspaceId?: string
    sessionId?: string
    userId?: string | 'anonymous'

    source: {
      app: 'marketing' | 'docs' | 'web'
      surface: string // hero, pricing, cta-footer
    }

    consent: {
      analytics: boolean
      personalization: boolean
    }

    trace: {
      traceId: string
      spanId?: string
      parentEventId?: string
    }
  }

  payload: TPayload
}
```

📌 **Semua event MARKETING wajib pakai envelope ini**

---

# 4️⃣ Event Schema — Marketing → Rube

## 4.1 PageViewed

```ts
export interface PageViewedPayload {
  path: string
  locale: string
  referrer?: string
  campaign?: {
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
  }
}
```

Digunakan agent untuk:

* detect entry channel
* baseline funnel

---

## 4.2 ContentImpression

```ts
export interface ContentImpressionPayload {
  contentId: string
  contentType: 'hero' | 'section' | 'banner'
  variant?: string
  position: number
}
```

➡️ agent bisa reasoning:

> “Hero A sering muncul tapi jarang diikuti intent”

---

## 4.3 CTAIntentCaptured (PALING PENTING)

```ts
export interface CTAIntentCapturedPayload {
  ctaId: string
  action: 'click' | 'hover' | 'submit'
  intentType: 
    | 'request_demo'
    | 'view_pricing'
    | 'signup'
    | 'contact_sales'

  context: {
    page: string
    contentVariant?: string
    offer?: string
  }

  confidence: number // UI confidence (0–1)
}
```

📌 **Ini bukan conversion**
📌 Ini = **signal niat**

---

## 4.4 FunnelStepEntered

```ts
export interface FunnelStepEnteredPayload {
  funnel: 'signup' | 'demo' | 'pricing'
  step: string
  stepIndex: number
}
```

➡️ Agent bisa:

* detect drop-off
* adapt content berikutnya

---

## 4.5 AdaptiveDecisionMade (Agent → Marketing)

```ts
export interface AdaptiveDecisionPayload {
  decisionId: string
  agentId: string

  decisionType:
    | 'content_variant'
    | 'cta_priority'
    | 'offer_selection'

  inputEvents: string[] // eventId references
  output: {
    selectedVariant: string
    reason: string
  }

  confidence: number
}
```

📌 Ini **wajib ada** untuk explainability & audit

---

# 5️⃣ Flow End-to-End (High Level)

```txt
UI (apps/marketing)
  ↓ emit event
Rube SDK
  ↓ validate + enrich
Rube Event Hub
  ↓
Agent Reasoning Engine
  ↓ decision
Rube Tool Invocation
  ↓
apps/marketing adaptive UI
```

---

# 6️⃣ Concrete Example (CTA Click)

### apps/marketing

```ts
captureIntent({
  ctaId: 'hero-primary',
  intentType: 'request_demo',
  context: { page: '/home' },
  confidence: 0.9
})
```

### Rube transforms → EventEnvelope

```json
{
  "meta": {
    "eventType": "marketing.cta_intent_captured",
    "tenantId": "t-123",
    "source": { "app": "marketing", "surface": "hero" }
  },
  "payload": {
    "ctaId": "hero-primary",
    "intentType": "request_demo",
    "confidence": 0.9
  }
}
```

### Agent reasoning prompt (simplified)

> User menunjukkan intent demo di hero utama.
> Funnel sebelumnya kosong.
> Pilih CTA lanjutan yang menurunkan friction.

➡️ Output:
**“Show pricing preview instead of form”**

---

# 7️⃣ Where This Lives (Package Mapping)

| Package                      | Responsibility                |
| ---------------------------- | ----------------------------- |
| `apps/marketing`             | Emit domain intent            |
| `packages/rube`              | Envelope, validation, routing |
| `packages/agentic-reasoning` | Consume event                 |
| `packages/observability`     | Replay + audit                |
| `packages/security`          | Consent enforcement           |

---

# 8️⃣ Non-Negotiable Guardrails

* ❌ No direct agent call from UI
* ❌ No raw click logs to agent
* ✅ All decisions emit `AdaptiveDecisionMade`
* ✅ All payloads Zod-validated
* ✅ Replay must reconstruct decision

---

# 9️⃣ Outcome Jika Ini Diikuti

✔ Agent **bisa belajar tanpa ML dulu**
✔ Marketing **adaptive tapi explainable**
✔ Compliance **aman (ISO / SOC / PDP)**
✔ CMS bisa diganti **tanpa ubah event**
✔ Debugging = replay event → decision

---

## NEXT (RECOMMENDED)

Kita bisa lanjut **satu per satu**:

1️⃣ **Zod schema + code di `packages/rube`**
2️⃣ **Replay UI (visual timeline)**
3️⃣ **Policy engine (which event agent may consume)**
4️⃣ **Example adaptive hero (end-to-end code)**

Pilih angka → saya lanjutkan langsung.
