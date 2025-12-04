# RANCANGAN LENGKAP & MENDALAM — `apps/docs` (SBA · BaseHub docs site)

Dokumen ini merinci rancangan lengkap untuk `apps/docs` — dokumentasi, docsite, dan integrasi BaseHub (CMS) pada workspace SBA-Agentic.
Tujuan: menjadikan `apps/docs` sebagai dokumentasi publik & internal yang cepat, terlokalisasi, aman, dan terintegrasi dengan BaseHub untuk konten terstruktur, revalidation via webhooks, dan analytics.

---

## 1. Ringkasan Fungsi & Tujuan

`apps/docs` bertugas:

* Menyajikan dokumentasi (developer & user) dalam berbagai locale
* Mengindeks konten BaseHub sehingga website docs selalu up-to-date
* Menyediakan webhook endpoint untuk revalidate cache / ISR
* Menyimpan analytics page-view & telemetry
* Menjadi sumber truth untuk ADR, QA plans, dan API contracts

Pengguna utama: developer, integrator, product, customer support, dan publik.

---

## 2. Peta Arsitektur High-Level

```mermaid
graph LR
  User[Visitor] --> CDN
  CDN --> DocsApp[apps/docs - Next/Vite static SSR]
  DocsApp -->|read| BaseHub[BaseHub CMS]
  DocsApp -->|webhook| /api/webhooks/revalidate
  DocsApp -->|analytics| Analytics[Telemetry Service]
  DocsApp -->|search| VectorDB/pgvector
  DocsApp -->|cache| CDN & Edge Cache
```

* DocsApp fetches content at build-time (SSG) and runtime (ISR/SSR) depending on route.
* BaseHub acts as canonical content source; webhooks notify docs app to revalidate.

---

## 3. Struktur Kode & Folder (current + recommended)

```
apps/docs/
├─ app/                # Next.js app router (pages / layout / api)
│  ├─ api/
│  │  ├─ mcp/basehub/route.ts   # MCP protocol / BaseHub integration
│  │  ├─ webhooks/revalidate/route.ts
│  │  └─ analytics/route.ts
│  ├─ [locale]/docs/[...slug]/page.tsx
│  └─ ...
├─ shared/              # shared lib: basehub client, telemetry, supabase
├─ features/            # search, docs UI, hero, navigation
├─ entities/            # types & validators
├─ e2e/                 # tests (playwright)
├─ public/
└─ vitest/              # unit tests
```

Rekomendasi tambahan:

* `/src/lib/basehub.ts` (strongly typed BaseHub client)
* `/src/lib/cache-control.ts` (edge caching helpers)
* `/src/incremental/` (ISR helper util)

---

## 4. Integrasi BaseHub — spesifikasi teknis

### 4.1 Modes

* **Read-only Content Fetch**: fetch content from BaseHub via REST/GraphQL for rendering.
* **Webhook-driven Revalidate**: BaseHub sends webhook when content changes → docs app revalidates cache for affected routes.
* **MCP Protocol**: docs app exposes `api/mcp/basehub` to support provider-specific operations (preview, fetch by ID).

### 4.2 Webhook Handler (revalidate)

* **Endpoint**: `POST /api/webhooks/revalidate`
* **Auth**: HMAC signature header `x-basehub-signature` (shared secret stored in Vault)
* **Payload**: `{ type: 'content.updated', ids: ['block-id', ...], locales: ['en','id'], paths: ['/docs/...'] }`
* **Behavior**:

  1. Verify HMAC signature
  2. Validate payload schema (Zod)
  3. Map block IDs → slugs (via BaseHub client)
  4. Call `revalidatePath(path)` or trigger ISR regeneration per path
  5. Invalidate CDN/edge cache selectively (via CDN API)
  6. Emit telemetry & audit log

Security: rate-limit webhook; verify timestamps/nonce for replay protection.

### 4.3 Preview Mode

* Implement preview tokens: temporary signed token to fetch draft content
* Endpoint: `/api/mcp/basehub/preview?token=...&path=/docs/...`
* Server-side validate token via BaseHub preview API

---

## 5. Content Fetching Strategy (SSG, ISR, SSR)

* **Public docs (marketing, changelog)**: SSG at build-time + long TTL on CDN
* **Docs with frequent updates (API contracts, ADRs)**: ISR (revalidate on webhook)
* **Preview & protected docs**: SSR on-demand with preview token

Cache policy examples:

* Marketing pages: Cache-Control: public, max-age=3600, stale-while-revalidate=86400
* Docs pages: ISR + Edge CDNs revalidate on webhook

---

## 6. Search & Indexing

### 6.1 Search API

* Provide client `features/search/api.ts` which queries server search route
* Server uses Postgres+pgvector or an external vector DB for semantic search
* Index pipeline:

  * BaseHub webhook -> enqueue `index-job` -> extract blocks -> embed -> upsert to vector index

### 6.2 Relevance & Ranking

* Combine BM25 keyword score with semantic similarity
* Boost based on popularity, recency, locale match

---

## 7. I18n & Localization

* Folder `[locale]/docs/[...slug]` pattern already present
* BaseHub should provide locale variants (content per locale)
* If missing locale, fallback to default with UI indicator
* Generate sitemap per locale

---

## 8. Observability & Analytics

* **Metrics**: page_view_count, revalidate_count, webhook_failures, search_latency
* **Traces**: instrument BaseHub fetch, webhook handler, revalidation operations via OTEL
* **Logs**: structured logs for webhook events and revalidation
* **Errors**: Sentry for frontend errors; server-side exceptions reported
* **Dashboards**: Grafana/Prometheus for metrics; Sentry for errors

---

## 9. Security & Rate Limiting

* CSP headers in `middleware.ts` (see existing ADR)
* HMAC signature verification for BaseHub webhooks
* Rate limit webhooks + search API
* Sanitize HTML server-side (use `sanitize-html.ts`) before rendering
* Use preview tokens for draft preview; token expires quickly

---

## 10. API Contracts & Zod Schemas

* Centralize Zod schemas under `entities/validators.ts`
* Example webhook schema:

```ts
const WebhookPayload = z.object({
  event: z.string(),
  data: z.object({ ids: z.array(z.string()), paths: z.array(z.string()).optional(), locales: z.array(z.string()).optional() })
});
```

* All incoming api routes validate via Zod; return 400 on invalid payloads.

---

## 11. Testing Strategy

* **Unit tests**: validators, basehub client mocks (vitest)
* **Integration tests**: webhook end-to-end (Playwright + test staging webhook)
* **E2E tests**: SEO, i18n navigation, perf, renderer-blocks (playwright)
* **Security tests**: CSP report simulation

---

## 12. Deployment & CI/CD

* Build docs static assets in CI (Turborepo caching)
* CI steps: lint → typecheck → unit tests → build → run e2e smoke
* Deploy to edge (Vercel/Cloudflare Pages) with environment secrets
* Setup webhook secret in BaseHub config (per environment)
* On webhook event, trigger revalidate path via Next's revalidate or call revalidate API

---

## 13. Operational Runbook (examples)

**Webhook failure**: retry queue with exponential backoff; alert on >5 failures
**Stale cache detected**: force revalidate paths; run full reindex job for affected content
**Search mismatch**: re-run indexing pipeline for affected tenant/locales

---

## 14. Roadmap & Backlog (priority)

1. Harden webhook auth & replay protection (P0)
2. Implement preview token flows (P0)
3. Migrate search indexing pipeline to vector DB w/ embeddings (P1)
4. Add CDN selective purge (P1)
5. Improve relevance scoring (P2)
6. Add content contribution UI (P3)

---

## 15. Example Code Snippets

**Webhook handler skeleton (Next route)**

```ts
// route.ts
export async function POST(req: Request) {
  const sig = req.headers.get('x-basehub-signature');
  const body = await req.text();
  if(!verifyHmac(body, sig)) return new Response('invalid', { status: 401 });
  const payload = JSON.parse(body);
  const parsed = WebhookPayload.parse(payload);
  await revalidatePaths(parsed.data.paths || mapIdsToPaths(parsed.data.ids));
  return new Response('ok');
}
```

---

## 16. Risks & Mitigations

* **Risk**: Webhook spoofing → mitigate via HMAC + timestamp
* **Risk**: Revalidate storms → debounce events + queue
* **Risk**: Content desync → periodic full sync job

---

## 17. Deliverables

* BaseHub client + typed SDK (src/lib/basehub.ts)
* Webhook revalidate route with HMAC & Zod validation
* ISR / preview flow implemented
* Search index pipeline (index worker + embeddings)
* Test suite (unit + integration + e2e)

---

Jika Anda ingin, saya bisa:

* Generate `route.ts` webhook handler code + test
* Create Zod schema files for webhook payloads
* Draft BaseHub client wrapper with typed responses
* Produce sequence diagrams for revalidation and preview

Ketik: **"buatkan webhook handler"**, **"buatkan basehub client"**, atau **"buatkan sequence diagram"** untuk saya kerjakan selanjutnya.
