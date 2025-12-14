Baik. Berikut **Checklist File-by-File (Migration-Safe)** untuk **ReOrganize / ReFactory `apps/marketing`** yang **aman, bertahap, dan tanpa breaking change**, disesuaikan dengan konteks **SBA-Agentic (Agent ↔ Rube ↔ CMS ↔ Observability)**.

Checklist ini **bisa langsung dipakai sebagai SOP eksekusi tim**.

---

# ✅ Migration-Safe Checklist — `apps/marketing`

## Prinsip Wajib (Sebelum Mulai)

* ❌ Tidak ada delete langsung
* ✅ Selalu **relocate + re-export**
* ✅ Semua path lama tetap hidup sampai Phase 3
* ✅ Test tetap hijau di setiap phase
* ✅ Observability aktif sejak awal

---

## 🟢 PHASE 0 — Baseline Safety (WAJIB)

### 0.1 Lock Baseline

* [ ] Tag git: `marketing-pre-agentic-refactor`
* [ ] Snapshot Lighthouse + SEO
* [ ] Snapshot test coverage
* [ ] Snapshot bundle size

### 0.2 Guardrail

* [ ] ESLint rule: forbid direct CMS import
* [ ] Path alias siap (`@/presentation`, `@/agentic-marketing`, dst)

---

## 🟢 PHASE 1 — Folder Creation (NO BREAKING)

> **Hanya create folder + index.ts kosong**

### Create folders

* [ ] `src/presentation/`
* [ ] `src/growth/`
* [ ] `src/agentic-marketing/`
* [ ] `src/content-runtime/`
* [ ] `src/observability/`
* [ ] `src/security/`

### Create barrel exports

* [ ] `presentation/index.ts`
* [ ] `agentic-marketing/index.ts`
* [ ] `content-runtime/index.ts`

✅ **Tidak ada file lama disentuh**

---

## 🟡 PHASE 2 — CMS Isolation (CRITICAL)

### 2.1 Content Runtime

* [ ] `content-runtime/resolvers/basehub/`
* [ ] `content-runtime/resolvers/mock/`
* [ ] `content-runtime/schemas/`

```ts
// content-runtime/contracts.ts
export interface ContentResolver {
  getPage(slug: string): Promise<PageContent>
  getBlock(id: string): Promise<Block>
}
```

### 2.2 Redirect CMS Calls

* [ ] `infrastructure/cms/*` → pindah ke `content-runtime/resolvers/basehub`
* [ ] Old import tetap via re-export

```ts
// OLD
import { getPage } from '@/infrastructure/cms'

// NEW (safe)
export { getPage } from '@/content-runtime'
```

### 2.3 Tests

* [ ] CMS contract test
* [ ] Mock resolver test

---

## 🟡 PHASE 3 — Presentation Purification

### Move UI (NO LOGIC)

* [ ] `features/hero` → `presentation/sections/hero`
* [ ] `features/feature-list` → `presentation/sections/feature-list`
* [ ] `layouts/*` → `presentation/layouts`

### Enforce rules

* [ ] No CMS import
* [ ] No telemetry import
* [ ] No agent import

```tsx
<HomeHero content={content.hero} />
```

---

## 🟠 PHASE 4 — Growth Extraction

### CTA & Funnel

* [ ] `features/cta-*` → `growth/cta`
* [ ] Pricing logic → `growth/funnels/pricing`
* [ ] Referral → `growth/referral`

### CTA now emits intent

* [ ] CTA click → `agentic-marketing/intent-capture`

---

## 🔴 PHASE 5 — Agentic Marketing Core (HIGH IMPACT)

### 5.1 Intent Capture

* [ ] `agentic-marketing/intent-capture`
* [ ] Event schema aligned with Rube

```ts
captureIntent({
  source,
  action,
  context
})
```

### 5.2 Adaptive Content

* [ ] `agentic-marketing/adaptive-content`
* [ ] Deterministic resolver
* [ ] Snapshot tested

### 5.3 Agent Ops UI

* [ ] `agentic-marketing/agent-ops-ui`
* [ ] Read-only transparency widgets

---

## 🔴 PHASE 6 — Observability Upgrade

### Centralize

* [ ] `observability/telemetry`
* [ ] `observability/replay-hooks`
* [ ] `observability/audit`

### Bind events

* [ ] Page view → MarketingEvent
* [ ] CTA → IntentEvent
* [ ] Adaptive decision → DecisionEvent

➡️ Semua → **Rube → Agent memory**

---

## 🟣 PHASE 7 — Security & Compliance

* [ ] CSP headers
* [ ] Consent-aware telemetry
* [ ] Rate limiting CTA
* [ ] Bot detection

Compliance ready:

* ISO 27001
* SOC2
* PDP (Indonesia)

---

## 🟣 PHASE 8 — Cleanup (AFTER STABLE)

### Only after 2–3 sprints stable

* [ ] Remove deprecated re-exports
* [ ] Delete old folders
* [ ] Update import paths
* [ ] Update docs

---

# 🔎 File-Level Safety Rules

| Rule                  | Status |
| --------------------- | ------ |
| No breaking import    | ✅      |
| CMS behind runtime    | ✅      |
| Agent decision logged | ✅      |
| Replayable UX         | ✅      |
| Deterministic tests   | ✅      |

---

# 🧭 What You Should See After Migration

* Marketing events appear in **Agent Replay**
* CMS can be swapped **without touching UI**
* Adaptive hero works but is explainable
* Trust UI visible
* Zero regression

---

## NEXT STRATEGIC OPTIONS

Saya siap lanjut langsung ke salah satu ini (tanpa ulang konteks):

1. **Event schema marketing → Rube → Agent** `.trae/documents/apps-marketing/Event schema marketing → Rube → Agent.md`
2. **Example: Adaptive Hero (real code)**
3. **CMS swap plan (Basehub → Rube / FS)**
4. **Observability dashboard spec**
5. **Docs update: “Agentic Marketing” positioning**

Pilih nomor → saya eksekusi.
