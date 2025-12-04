# DDD Models
- Entities, Value Objects, Aggregates per bounded context
- Repository interfaces in domain; implementations in infra

Bounded Contexts:
- Conversation — sessions, turns, tool calls (Aggregate: Conversation)
- Knowledge/CMS — content blocks, templates (BaseHub integration)
- Document — render pipelines, artifacts (Aggregate: DocumentJob)
- Workflow/Task — tasks, approvals, external sync
- Tenant/Billing — provisioning, quotas, usage, billing
