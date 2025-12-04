# Core Package — Domain Logic

## Tujuan
- Mengemas logika domain lintas bounded contexts (Agent, Workflow, Integrations, Knowledge, Billing).

## Fitur
- Services (planner, approval, metering), validators, error taxonomy, event envelope.

## Arsitektur
- DDD; folder `services`, `repositories` (port), `adapters` (infra), `models` (entities/value objects/aggregates).

## Standar Koding
- TypeScript strict; invariants jelas; pure functions; testable services.

## Pengujian
- Unit untuk services & models; integration untuk adapters.

