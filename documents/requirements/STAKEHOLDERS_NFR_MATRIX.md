# Matriks Stakeholder & Non-Functional Requirements (NFR)

## Stakeholder
- End Users: produktivitas, kemudahan pakai, aksesibilitas
- Admins: kontrol akses, audit, konfigurasi kebijakan
- Product Owner: kesesuaian fitur, roadmap
- UX Designer: usability, konsistensi UI, A11y
- Engineering: maintainability, testability, observability
- QA: cakupan test, stabilitas build, traceability
- Ops/SRE: reliability, performance, scalability
- Security/Compliance: RLS, RBAC, kebijakan header, PII protection

## NFR
- Security: RLS menyeluruh, RBAC, CSP, Trusted Types, Permissions-Policy
- Reliability: SLA operasional, backup, rollback
- Performance: target TPS, p95/p99 latency
- Scalability: horizontal scale, rate limits
- Observability: logging terstruktur, metrics, tracing
- Accessibility: WCAG AA, keyboard, screen reader
- Maintainability: modular FSD+DDD, versioning kontrak, dokumentasi
- Compliance: ISO-aligned dokumentasi, audit trail

## Pemetaan NFR → Stakeholder
- Security → Security/Compliance; Admins; Engineering
- Observability → Ops/SRE; Engineering; QA
- Accessibility → UX; End Users
- Performance → Ops/SRE; PO
- Maintainability → Engineering; QA

