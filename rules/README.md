# 🧠 SBA Agentic Rules & Guidelines

Selamat datang di pusat kendali aturan (Rules Center) untuk **SBA-Agentic**. Direktori ini berisi spesifikasi, panduan, dan kebijakan yang memastikan agen AI kita beroperasi dengan aman, terukur, dan cerdas.

## 📂 Struktur Direktori & Artefak (35+ Set)

### 1. Agent Understanding Layer
| Komponen | Deskripsi |
| --- | --- |
| [README.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/README.md) | Indeks utama dan panduan navigasi aturan. |
| [agent-context.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/agent-context.md) | Pemahaman peran, taksonomi, dan cara kerja agen. |
| [agent-reasoning.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/agent-reasoning.md) | Kebijakan penalaran (Reasoning Policy) mendalam. |
| [search-strategy.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/search-strategy.md) | Strategi pencarian web dan literasi informasi. |
| [business-domains.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/business-domains.md) | Panduan domain bisnis (BPA, CX, DA, SI). |
| [architecture-decisions.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/architecture-decisions.md) | Catatan keputusan arsitektur (ADR). |
| [global-standards.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/global-standards.md) | Standar global dan fondasi operasional. |

### 2. Development Enablement
| Komponen | Deskripsi |
| --- | --- |
| [local-development.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/local-development.md) | Panduan setup dan pengembangan lokal. |
| [rube-yaml-standards.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/rube-yaml-standards.md) | Standar penulisan YAML untuk Rube Engine. |
| [rules-specification.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/rules-specification.md) | Spesifikasi teknis format YAML. |
| [naming-convention.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/naming-convention.md) | Konvensi penamaan file dan ID. |
| [domain-events-catalog.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/domain-events-catalog.md) | Katalog event sistem yang tersedia. |
| [action-handlers-catalog.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/action-handlers-catalog.md) | Katalog handler aksi (Capabilities). |
| **Templates** | |
| [base.rule.yml](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/rule-templates/base.rule.yml) | Template dasar rule YAML. |
| [event.rule.yml](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/rule-templates/event.rule.yml) | Template rule berbasis event. |
| [schedule.rule.yml](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/rule-templates/schedule.rule.yml) | Template rule berbasis jadwal. |

### 3. Agentic Workflow & Lifecycle
| Komponen | Deskripsi |
| --- | --- |
| [rule-lifecycle.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/rule-lifecycle.md) | Alur hidup rule dari dev hingga prod. |
| [ops-and-lifecycle.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/ops-and-lifecycle.md) | Manajemen operasional agen. |
| [state-transition.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/state-transition.md) | Definisi transisi status dalam alur kerja. |
| [runtime-integration.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/runtime-integration.md) | Panduan integrasi runtime sistem. |
| [versioning-policy.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/versioning-policy.md) | Kebijakan penomoran versi (SemVer). |
| [documentation-lifecycle.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/documentation-lifecycle.md) | Siklus hidup dan evolusi mandiri dokumentasi. |
| [deprecation-policy.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/deprecation-policy.md) | Kebijakan penghentian fitur lama. |
| [dependency-map.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/dependency-map.md) | Peta dependensi antar rule dan sistem. |

### 4. Testing & Validation
| Komponen | Deskripsi |
| --- | --- |
| [test-strategy.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/test-strategy.md) | Strategi pengujian otomatis untuk rule. |
| **Schemas** | |
| [rule.schema.json](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/schemas/rule.schema.json) | Skema utama validasi rule. |
| [trigger.schema.json](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/schemas/trigger.schema.json) | Skema validasi trigger. |
| [action.schema.json](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/schemas/action.schema.json) | Skema validasi aksi. |
| [error-handling.schema.json](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/schemas/error-handling.schema.json) | Skema penanganan error. |
| **Tests** | |
| [schema-validation.test.ts](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/tests/schema-validation.test.ts) | Test validasi skema otomatis. |
| [rule-trigger.test.ts](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/tests/rule-trigger.test.ts) | Test logika trigger rule. |
| [rule-action-binding.test.ts](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/tests/rule-action-binding.test.ts) | Test pengikatan aksi rule. |
| [backward-compatibility.test.ts](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/tests/backward-compatibility.test.ts) | Test kompatibilitas ke belakang. |

### 5. Security & Multi-Tenant Readiness
| Komponen | Deskripsi |
| --- | --- |
| [security-and-multitenancy.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/security-and-multitenancy.md) | Protokol keamanan dan isolasi tenant. |
| [tenant-context-contract.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/tenant-context-contract.md) | Kontrak data konteks tenant. |
| [permission-model.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/permission-model.md) | Model perizinan dan RBAC. |

### 6. Observability & Operability
| Komponen | Deskripsi |
| --- | --- |
| [observability-requirements.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/observability-requirements.md) | Standar monitoring dan performa. |
| [metrics-definition.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/metrics-definition.md) | Definisi metrik KPI sistem. |
| [tracing-policy.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/tracing-policy.md) | Kebijakan pelacakan (Distributed Tracing). |
| [logging-convention.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/logging-convention.md) | Standar logging terstruktur. |
| [audit-policy.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/audit-policy.md) | Kebijakan audit dan transparansi. |

### 7. CI/CD & Automation
| Komponen | Deskripsi |
| --- | --- |
| [ci-cd-validation.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/ci-cd-validation.md) | Alur validasi otomatis di CI/CD. |
| [quality-gates.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/quality-gates.md) | Standar kualitas (Coverage, Lint, Schema). |
| [release-checklist.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/release-checklist.md) | Daftar periksa sebelum rilis. |
| [rollback-policy.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/rollback-policy.md) | Prosedur pengembalian (Rollback). |

### 8. Go-Live & Production Readiness
| Komponen | Deskripsi |
| --- | --- |
| [go-live-readiness.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/go-live-readiness.md) | Daftar periksa kesiapan peluncuran. |
| [production-configuration.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/production-configuration.md) | Panduan konfigurasi lingkungan produksi. |
| [incident-response.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/incident-response.md) | Prosedur penanganan insiden. |

### 9. Governance & Continuous Improvement
| Komponen | Deskripsi |
| --- | --- |
| [CHANGELOG.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/CHANGELOG.md) | Catatan perubahan sistem aturan. |
| [contributing.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/contributing.md) | Panduan kontribusi pengembangan. |
| [feedback-loop.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/feedback-loop.md) | Mekanisme pembelajaran mandiri (Self-learning). |

## 🚀 Prinsip Utama
1. **Agentic > Rule-based**: Utamakan keputusan adaptif namun tetap dalam koridor aturan.
2. **Event-Driven**: Arsitektur berbasis event untuk respons real-time.
3. **Multi-tenant First**: Keamanan dan isolasi data adalah prioritas tertinggi.
4. **Observable by Default**: Setiap keputusan agen harus dapat ditelusuri.

---
*Terakhir diperbarui: 2025-12-28*
