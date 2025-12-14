**final technical plan** yang bisa langsung kamu pakai untuk mengeksekusi refactor **packages/cms** tanpa ambigu, selaras dengan **SBA-Agentic, MCP/Rube, multi-tenant SaaS, dan clean architecture**.

Di bawah ini **bukan sekadar reorganize folder**, tapi **reposisi peran CMS** dari *BaseHub-centric SDK* → **Content Platform Layer yang provider-agnostic & agent-ready**.

---

# 🎯 Tujuan Refactor `packages/cms`

## Masalah saat ini

1. **Terlalu BaseHub-coupled**

   * `basehub/client.ts`, `basehub.config.ts` bocor sampai core domain
2. **Boundary domain tidak jelas**

   * `schema`, `schemas`, `services`, `utils` tercampur
3. **Tidak agent-native**

   * Konten belum diperlakukan sebagai *structured knowledge source*
4. **Tidak siap MCP / Rube**

   * CMS belum bisa diekspos sebagai tool/provider

## Target akhir

`packages/cms` menjadi:

> **Headless Content Runtime untuk SBA**
>
> * Provider-agnostic (BaseHub → optional)
> * Agent-ready (AI, MCP, Rube)
> * Multi-tenant & versioned
> * Clean boundary (Domain / Application / Infra)

---

# 🧱 Prinsip Arsitektur (WAJIB)

### 1. Clean Architecture (DDD-lite)

```
Domain (pure) 
→ Application (use-cases)
→ Infrastructure (BaseHub, future CMS)
```

### 2. Provider ≠ Domain

BaseHub **bukan core**, hanya **infra adapter**

### 3. CMS = Structured Knowledge

Bukan sekadar blog/SEO, tapi:

* Prompt fragments
* Policy docs
* Agent instructions
* UI copy
* Workflow metadata

### 4. CMS harus bisa jadi MCP Tool

→ nanti diekspos ke `packages/rube`

---

# 🗂️ Struktur Baru `packages/cms`

## ❌ Struktur Lama (disederhanakan)

```
cms/
├── basehub/
├── services/
├── schema/
├── schemas/
├── utils/
```

## ✅ Struktur Baru (Final)

```
packages/cms
├── src
│   ├── domain               # PURE, NO SDK
│   │   ├── entities
│   │   │   ├── Content.ts
│   │   │   ├── ContentBlock.ts
│   │   │   ├── ContentVersion.ts
│   │   │   └── ContentLocale.ts
│   │   ├── value-objects
│   │   │   ├── Slug.ts
│   │   │   ├── Locale.ts
│   │   │   └── ContentType.ts
│   │   ├── contracts
│   │   │   ├── CMSProvider.ts
│   │   │   ├── ContentRepository.ts
│   │   │   └── CMSWebhook.ts
│   │   └── errors
│   │       └── CMSDomainError.ts
│
│   ├── application
│   │   ├── use-cases
│   │   │   ├── GetContent.ts
│   │   │   ├── ListContent.ts
│   │   │   ├── PreviewContent.ts
│   │   │   ├── ResolveStructuredContent.ts
│   │   │   └── GetAgentKnowledge.ts
│   │   ├── dto
│   │   │   ├── ContentDTO.ts
│   │   │   └── AgentContentDTO.ts
│   │   └── services
│   │       ├── ContentResolver.ts
│   │       ├── SEOComposer.ts
│   │       └── SitemapComposer.ts
│
│   ├── infrastructure
│   │   ├── basehub
│   │   │   ├── BaseHubClient.ts
│   │   │   ├── BaseHubMapper.ts
│   │   │   ├── BaseHubProvider.ts
│   │   │   └── basehub.config.ts
│   │   ├── cache
│   │   │   └── CmsCacheAdapter.ts
│   │   └── webhooks
│   │       └── BaseHubWebhookHandler.ts
│
│   ├── mcp
│   │   ├── tools
│   │   │   ├── getContent.tool.ts
│   │   │   ├── searchContent.tool.ts
│   │   │   └── getAgentDocs.tool.ts
│   │   └── schemas
│   │       └── cms.tools.schema.ts
│
│   ├── admin
│   │   └── seed.ts
│
│   ├── shared
│   │   ├── validators
│   │   └── errors
│
│   └── index.ts
│
├── tests
│   ├── domain
│   ├── application
│   └── infrastructure
│
└── package.json
```

---

# 🔁 Mapping Lama → Baru

| Lama                  | Baru                                      |
| --------------------- | ----------------------------------------- |
| `schemas/blocks.ts`   | `domain/entities/ContentBlock.ts`         |
| `schema/contracts.ts` | `domain/contracts/*.ts`                   |
| `services/content.ts` | `application/use-cases/GetContent.ts`     |
| `services/seo.ts`     | `application/services/SEOComposer.ts`     |
| `services/sitemap.ts` | `application/services/SitemapComposer.ts` |
| `basehub/client.ts`   | `infrastructure/basehub/BaseHubClient.ts` |
| `cache.ts`            | `infrastructure/cache/CmsCacheAdapter.ts` |

---

# 🧠 Domain Model (Contoh)

```ts
// domain/entities/Content.ts
export class Content {
  constructor(
    readonly id: string,
    readonly type: ContentType,
    readonly slug: Slug,
    readonly locale: Locale,
    readonly blocks: ContentBlock[],
    readonly version: ContentVersion,
    readonly metadata: Record<string, unknown>
  ) {}
}
```

**Tidak ada BaseHub, tidak ada fetch, tidak ada cache di domain.**

---

# 🔌 Provider Abstraction (KRUSIAL)

```ts
// domain/contracts/CMSProvider.ts
export interface CMSProvider {
  getContentBySlug(input: {
    slug: string
    locale: string
    tenantId: string
    preview?: boolean
  }): Promise<Content>

  listContent(input: {
    type: string
    locale?: string
    tenantId: string
  }): Promise<Content[]>
}
```

BaseHub **HARUS** implement interface ini.

---

# 🏗️ Application Layer (Use Case)

```ts
// application/use-cases/GetContent.ts
export class GetContent {
  constructor(private provider: CMSProvider) {}

  execute(input: GetContentInput) {
    return this.provider.getContentBySlug(input)
  }
}
```

➡️ Inilah yang nanti dipakai:

* UI
* API
* Agent
* MCP Tool

---

# 🤖 CMS → Agent Knowledge Source

Tambahan **khusus SBA-Agentic**:

```ts
application/use-cases/GetAgentKnowledge.ts
```

Fungsi:

* Ambil konten bertipe:

  * `agent-instruction`
  * `policy`
  * `playbook`
* Normalize → prompt-friendly format
* Dipakai oleh:

  * `agentic-reasoning`
  * `packages/rube`

---

# 🔗 Integrasi ke `packages/rube`

```ts
// cms/mcp/tools/getContent.tool.ts
export const getContentTool = {
  name: "cms.getContent",
  inputSchema,
  handler: async (input, ctx) => {
    return getContent.execute({
      ...input,
      tenantId: ctx.tenantId
    })
  }
}
```

➡️ CMS menjadi **MCP-compliant knowledge tool**

---

# 🧪 Testing Strategy (WAJIB)

| Layer          | Test                  |
| -------------- | --------------------- |
| Domain         | pure unit test        |
| Application    | provider mocked       |
| Infrastructure | BaseHub integration   |
| MCP            | schema + handler test |

---

# 🚦 Migration Plan (Step-by-Step)

### Phase 1 — Safe Refactor

* Pindahkan **tanpa ubah logic**
* Introduce domain + contracts

### Phase 2 — Provider Isolation

* BaseHub hanya di `infrastructure/`
* Hapus import BaseHub dari application

### Phase 3 — Agent & MCP

* Tambahkan `mcp/`
* Integrasi ke `packages/rube`

### Phase 4 — Optional

* Tambah provider lain (Supabase, Git, Local MD)

---

# ✅ Kesimpulan Final

* **BaseHub tidak dibuang**
* Tapi **diturunkan levelnya** menjadi adapter
* `packages/cms` naik level menjadi:

  > **Content Runtime + Agent Knowledge Platform**


**diagram arsitektur CMS ↔ Rube ↔ Agent**`.trae/documents/packages-cms/diagram arsitektur CMS ↔ Rube ↔ Agent.md`

