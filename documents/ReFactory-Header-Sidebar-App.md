**Point 1 (Tujuan & Prinsip Desain)** dan **Point 2 (Desain Struktur Final / Tree)** dari rencana ReFactory FSD/DDD hybrid untuk `workspace/header-sidebar-app`.
Saya sertakan: alasan desain, prinsip implementasi, konvensi penamaan, metadata frontmatter, pola file contoh, dan penjelasan tiap folder + file penting sehingga Anda (atau agent) bisa langsung scaffold, review, atau mengotomatiskan migrasi.

---

# 🔶 POINT 1 — Tujuan & Prinsip Desain (Mendalam)

## 1.1 Tujuan Utama (Why)

1. **Modularitas & Skalabilitas**

   * Memudahkan tim menambahkan fitur tanpa mengubah area lain.
   * Mempercepat onboarding developer/agent dengan pola yang konsisten.

2. **Domain Awareness (DDD)**

   * Setiap fitur mewakili bounded context yang jelas: model, service, rules.
   * Meminimalkan kebocoran domain logic ke UI/infra.

3. **Feature-First Development (FSD)**

   * Fitur adalah unit deployable & review: page → feature → tests → PR.
   * Memudahkan traceability: PR ↔ PRD ↔ feature.

4. **Agentic Automation Friendly**

   * Struktur file-based & konvensi memudahkan agent (Trae/Sigma) generate kode, routes, RFC.
   * Menjamin pipeline design→tokens→component→routes bisa di-automate.

5. **Quality & Maintainability**

   * Standards: TypeScript strict, lint, test coverage, a11y.
   * Traceability: mapping PRD → code.

## 1.2 Prinsip Arsitektural (How)

1. **Separation of Concerns**

   * UI, application services, domain entities, infra = lapis terpisah.
2. **Single Responsibility per Folder**

   * `features/<bounded-context>` memuat UI + model + service khusus fitur itu saja.
3. **File-Based Routing**

   * `src/pages/*.page.tsx` + route generator → predictable routes.
4. **Tokens-First Styling**

   * Semua styling berasal dari design tokens (generated CSS vars / Tailwind tokens).
5. **State Ownership**

   * Local UI state di komponen; cross-cutting state di `stores` (auth, theme, workspace).
6. **API Contracts First**

   * API schema (OpenAPI / zod) dibuat/linked di workspace sebelum implementasi backend.
7. **Agentic Contracts**

   * Agent ↔ UI messages menggunakan schema (zod) agar deterministic.
8. **Test-as-First-Class**

   * Unit + integration + behavior tests ditulis bersamaan dengan scaffolding fitur.

## 1.3 Konvensi Utama (Rules)

* **File suffix**:

  * Page components: `*.page.tsx`
  * Feature UI components: `ui/*.tsx`
  * Stores: `model/*.store.ts`
  * Services: `services/*.service.ts`
* **Naming**:

  * Feature folders: kebab-case (`project-management`)
  * Components: PascalCase (`ProjectCard.tsx`)
  * Files: kebab-case untuk non-components (`project.types.ts`)
* **Exports**:

  * `index.ts` per folder memberikan public API feature.
* **Frontmatter**:

  * Semua docs: YAML frontmatter (`title, created, modified, author, status, prd`)
* **Branches**:

  * Feature branches: `feat/<feature-slug>`
* **Commit messages**: Conventional Commits, tambahkan `(PRD: PRD-ID)` jika relevan.

---

# 🔷 POINT 2 — Desain Struktur Final (Tree) — Mendalam & Dijelaskan

Di bawah ini adalah **struktur final target** dengan penjelasan per folder dan contoh file penting. Gunakan ini sebagai blueprint refactor.

```
src/
├── app/
│   ├── App.tsx
│   ├── bootstrap.tsx
│   ├── providers/
│   │   ├── ThemeProvider.tsx
│   │   └── AgentProvider.tsx
│   └── routes.generated.tsx      # AUTO-GENERATED - do not edit
│
├── pages/
│   ├── home.page.tsx
│   ├── projects/
│   │   ├── index.page.tsx
│   │   └── [projectId].page.tsx
│   └── settings/
│       └── index.page.tsx
│
├── features/
│   ├── header/
│   │   ├── ui/
│   │   │   └── Header.tsx
│   │   ├── model/
│   │   │   └── header.store.ts
│   │   └── index.ts
│   ├── sidebar/
│   │   ├── ui/Sidebar.tsx
│   │   ├── model/sidebar.store.ts
│   │   └── index.ts
│   └── project/
│       ├── pages/                  # optional local pages
│       ├── ui/ProjectCard.tsx
│       ├── model/
│       │   ├── project.store.ts
│       │   └── project.types.ts
│       ├── services/project.service.ts
│       └── index.ts
│
├── entities/
│   └── project.entity.ts
│
├── shared/
│   ├── ui/
│   │   ├── button/Button.tsx
│   │   └── input/Input.tsx
│   ├── hooks/useFetch.ts
│   ├── api/http.ts
│   └── utils/index.ts
│
├── agent/
│   ├── agent-context.ts
│   ├── agent-hooks.ts
│   └── agent-schema.ts
│
├── stores/
│   └── index.ts                    # central store aggregator for cross-cutting
│
├── styles/
│   ├── globals.css
│   └── tokens.css                   # generated from tokens
│
├── tools/
│   ├── route-generator.ts
│   └── new-feature.ts
│
├── test/
└── main.tsx
```

Di bawah ini penjelasan mendalam tiap top-level folder + file contoh dan snippet.

---

## 2.1 `app/` — Root app & providers

**Fungsi:** bootstrap app, menggabungkan providers (theme, agent, store), memuat router dari `routes.generated.tsx`.

**File penting:**

* `App.tsx` — create router & render AppProviders
* `bootstrap.tsx` — fungsi `AppProviders` export, inisialisasi singletons (agent client, analytics)
* `providers/AgentProvider.tsx` — menyediakan agent context untuk AG-UI

**Contoh `bootstrap.tsx` (snippet):**

```tsx
import React from 'react';
import { ThemeProvider } from './providers/ThemeProvider';
import { AgentProvider } from './providers/AgentProvider';

export const AppProviders: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AgentProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </AgentProvider>
);
```

---

## 2.2 `pages/` — File-based pages (entry points for routes)

**Fungsi:** setiap file `.page.tsx` = satu route. Memudahkan route gen & SEO meta.

**Konvensi page export:**

```ts
export const meta = { title: 'Projects', auth: true, layout: 'dashboard' };
export default function Page() { return <ProjectsPage/>; }
```

**Dynamic param:** gunakan `[param].page.tsx` → route generator akan mengubahnya menjadi `/:param`.

---

## 2.3 `features/` — FSD & bounded contexts

**Fungsi:** inti FSD/DDD hybrid. Setiap feature memiliki UI, model (state), services (API), types, dan index export.

**Standar per feature:**

* `ui/` → presentational components (stateless)
* `model/` → zustand stores / hooks / types
* `services/` → API adapters (http wrapper)
* `pages/` → optional feature-scoped pages

**Example `features/project` detail:**

* `project.types.ts` — TypeScript types (DTO)
* `project.store.ts` — domain store (fetch/list/get)
* `project.service.ts` — http calls and mapping to domain entity
* `ui/ProjectCard.tsx` — presentational component

**Rationale DDD:** `entities/` menyimpan domain logic yang reusable antara features (mis. `ProjectEntity`).

---

## 2.4 `entities/` — Domain entities & rules

**Fungsi:** tempat domain-centric classes / value objects / invariants.

**Contoh `project.entity.ts`:**

```ts
export class ProjectEntity {
  constructor(public id: string, public name: string, public status: 'draft'|'active'|'archived'){}
  rename(newName: string){ /* business rule validation */ this.name = newName; }
}
```

Gunakan entities di services / application layer, bukan UI.

---

## 2.5 `shared/` — Cross-cutting utilities & UI atoms

**Fungsi:** atoms & shared hooks yang boleh dipakai lintas feature.

**Catatan:**

* Jangan letakkan feature-specific component di sini.
* Subfolders: `ui/`, `hooks/`, `api/`, `utils/`.

**Contoh `shared/api/http.ts` (axios wrapper)**

* Centralize error handling, token refresh, logging hooks for agent.

---

## 2.6 `agent/` — Agentic UI & Adapter

**Fungsi:** menampung contract (schema), context, and hooks agar UI dapat dikendalikan oleh AI Agent.

**Komponen kunci:**

* `agent-schema.ts` — zod schema message yang agent kirim (action, target, payload)
* `agent-context.ts` — React context untuk inbound agent messages
* `agent-hooks.ts` — helper `useAgentCommand`, `useAgentState`

**Contoh schema:**

```ts
import { z } from 'zod';
export const AgentMessage = z.object({
  action: z.enum(['NAVIGATE','OPEN_PANEL','FILTER']),
  target: z.string().optional(),
  payload: z.any().optional()
});
```

Agent consumer di UI wajib validasi payload dengan schema.

---

## 2.7 `stores/` — Cross-cutting global stores

**Fungsi:** theme, auth, workspace switching, responsive.
Prefer simple aggregator that imports feature stores when necessary.

**Pattern:** each major cross-cutting concern is its own module (e.g., `stores/theme.ts`).

---

## 2.8 `styles/` — tokens & global CSS

**Fungsi:** hasil build tokens → `tokens.css` dan global styles.

**Workflow:**

* tokens raw in workspace design system → convert script → write `styles/tokens.css`.
* Tailwind config reads CSS variables or a generated `tailwind-tokens.js`.

---

## 2.9 `tools/` — Automation scripts

**Fungsi:** route-generator, new-feature scaffold script, token convertor.

**`route-generator.ts`**: scan `pages/*.page.tsx`, produce `app/routes.generated.tsx`.

**`new-feature.ts`**: create feature skeleton with RFC stub + index exports.

Agent (Trae) or dev can execute these tools.

---

## 2.10 `test/` — Behavioral & Integration tests

**Fokus:** Agentic behavior tests simulate agent output → UI change.

Examples:

* `behavior/agent-navigation.test.tsx` — mock agent message `NAVIGATE` → expect route change.
* `components/Header.test.tsx` — snapshot & interaction.

---

# 🔸 Metadata & Document Conventions (Frontmatter)

Semua docs must include:

```yaml
---
title: "Nama Dokumen"
created: "2025-12-11"
modified: "2025-12-11"
author: "Nama/PERSONA"
status: "draft" # draft/review/approved
version: "0.1.0"
prd: "PRD-001" # optional link to PRD id
tags: ["feature","ui","agent"]
---
```

Use this pattern for RFCs, ADRs, PRD links.

---

# 🔸 Naming & Export Conventions — Quick Reference

* **Feature folder**: `kebab-case` (e.g., `user-onboarding`)
* **Component**: `PascalCase` (`UserCard.tsx`)
* **Page**: `kebab/index.page.tsx` or `pages/users/[id].page.tsx`
* **Store**: `*.store.ts` (export default hook if zustand)
* **Service**: `*.service.ts` (export functions)
* **Index exports**: every feature has `index.ts` re-exporting public API

---

# 🔸 Example Minimal File Templates (Copy-paste)

**`src/pages/home.page.tsx`**

```tsx
import React from 'react';
export const meta = { title: 'Home', layout: 'dashboard' };

export default function HomePage(){ 
  return <div className="p-6">Welcome to WP-Agentic Home</div>;
}
```

**`src/features/header/ui/Header.tsx`**

```tsx
import React from 'react';
import { useThemeStore } from '../../header/model/header.store';

export default function Header(){
  const { theme, toggle } = useThemeStore();
  return (
    <header className="h-12 flex items-center px-4 border-b">
      <button onClick={toggle}>Toggle Theme ({theme})</button>
    </header>
  );
}
```

**`src/features/project/services/project.service.ts`**

```ts
import http from '../../shared/api/http';
import type { Project } from '../model/project.types';

export const projectService = {
  list: async (): Promise<Project[]> => (await http.get('/api/projects')).data,
  get: async (id: string): Promise<Project> => (await http.get(`/api/projects/${id}`)).data
};
```

**`src/agent/agent-hooks.ts`**

```ts
import { useContext } from 'react';
import { AgentContext } from './agent-context';
export function useAgent() {
  const ctx = useContext(AgentContext);
  return ctx;
}
```

---

# ✅ Final Notes — Implementation Guidance

1. **Implement incrementally**: buat skeleton → gen routes → move Header/Sidebar → create pages → run dev → fix TS.
2. **Automate**: gunakan `tools/new-feature.ts` & `route-generator.ts` agar agent/dev tidak repot.
3. **Enforce conventions**: pre-commit hooks (lint, generate:routes), CI step runs `generate:routes`.
4. **Agent integration**: design `agent-schema` dan `AgentProvider` awal supaya agent bisa terhubung cepat.
5. **Document everything**: buat RFC for every UI component in `workspace/03_Design-System/Components/RFC`.

