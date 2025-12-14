# SBA-Agentic — Finalisasi Pondasi packages & packages/rube Implementation Plan

Versi: 1.1.0
Tanggal: 2025-12-12

Dokumen ini merinci finalisasi pondasi packages SBA-Agentic dan `packages/rube` (MCP Tool Hub + Connectors) dengan fokus implementasi mendalam, prinsip arsitektural, dan alignment dengan monorepo multi-tenant.

---

## 1. Prinsip Arsitektural Utama

* **Separation of Concerns**: Rube = execution engine, Integrations = capability provider, Agent = reasoning & meta-event generator.
* **Type Safety**: Gunakan Zod/JSON Schema untuk semua input/output connector.
* **Tenant-aware**: Setiap pipeline & connector di-scope dengan `tenant_id`.
* **Observability**: OTel tracing, metrics, logs per tenant & per step.
* **Idempotency & Resilience**: `idempotencyKey`, circuit breaker, retry & fallback.
* **Extensibility**: Connector lifecycle hooks (init, auth, run, health, teardown).
* **Testing-first**: Unit test connector, integration test MCP protocol.
* **Clean Code & Monorepo Ready**: FSD + DDD hybrid, modular, reusable.

---

## 2. Struktur Folder packages/rube (Final)

```
packages/rube
├── package.json
├── tsconfig.json
├── src
│   ├── cli
│   │   └── publish-connector.ts
│   ├── server
│   │   ├── index.ts
│   │   ├── mcpServer.ts
│   │   ├── http.ts
│   │   ├── router.ts
│   │   └── health.ts
│   ├── connectors
│   │   ├── template
│   │   │   ├── index.ts
│   │   │   └── schema.ts
│   │   └── github
│   │       ├── index.ts
│   │       └── auth.ts
│   ├── registry
│   │   ├── index.ts
│   │   └── loader.ts
│   ├── config
│   │   ├── index.ts
│   │   └── tenantConfig.ts
│   ├── secrets
│   │   └── provider.ts
│   ├── policy
│   │   └── evaluator.ts
│   ├── telemetry
│   │   └── otel.ts
│   ├── sandbox
│   └── types
│       └── mcp.ts
├── docker
│   └── Dockerfile
├── k8s
│   ├── deployment.yaml
│   └── service.yaml
└── README.md
```

---

## 3. package.json & Scripts (Final)

```json
{
  "name": "@sba/rube",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc -b",
    "start": "node dist/server/index.js",
    "dev": "ts-node-dev --respawn --transpile-only src/server/index.ts",
    "test": "vitest"
  },
  "dependencies": {
    "fastify": "^4.0.0",
    "@opentelemetry/api": "^1.0.0",
    "ajv": "^8.0.0",
    "zod": "^3.0.0",
    "got": "^12.0.0",
    "ws": "^8.0.0"
  }
}
```

---

## 4. MCP Server Bootstrap

* **src/server/mcpServer.ts**
* **src/server/router.ts**
* **src/registry/index.ts**
* **src/secrets/provider.ts**
* **src/client/index.ts**
* **src/connectors/template/index.ts**

Prinsip: setiap step, setiap connector, setiap tenant di-observe & di-logged.

---

## 5. Tenant & Security

* TenantContext propagation
* Tenant-based secrets & RBAC policy evaluator
* Sandbox connector execution bila diperlukan
* Authentication: API Key / JWT dari SBA Auth Service

---

## 6. Observability & Metrics

* OpenTelemetry tracing per step
* Metrics: invocation count, latency, error, token cost
* Structured logging dengan tenant_id

---

## 7. Testing & CI/CD

* Unit tests connector (Vitest)
* Integration test MCP server (mock registry + secrets)
* CI: lint, typecheck, test, build Docker image, push registry
* K8s deployment + HPA + resource limits

---

## 8. Migration & Integration Plan

1. Scaffold `packages/rube` dan generate minimal MCP server + client wrapper
2. Implement contoh connector (`github`)
3. Update `packages/integrations` untuk menggunakan Rube client
4. Tambahkan tenant config & secrets per connector
5. Observability & tests
6. Migrasi connectors lain secara bertahap

---

## 9. Next Steps

* Generate file-by-file skeleton `packages/rube`
* Generate Rube plugin example lengkap dengan tests
* Integrasikan agentic-reasoning → Rube
* Integrasikan jobs → Rube adapter
* Harmonisasi api-types/codegen
* Visualisasi pipeline & tenant flow (opsional dashboard)

> Dokumen ini menjadi pedoman final untuk pondasi packages dan implementasi Rube dalam monorepo SBA-Agentic.
