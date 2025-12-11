## OpenAPI Enrichment (workspace/05_API/heatmap_api_openapi.yaml)
- Add headers component: `XRateLimitReset` (epoch seconds), examples for `XRateLimitLimit`, `XRateLimitRemaining`, `Retry-After`, `XRateLimitReset`.
- Update `components.responses.TooManyRequests` to include `X-RateLimit-Reset` header and an example payload with realistic values.
- For all relevant endpoints (`POST /events`, `POST /bulk`, `GET /events`, `GET /stats`, `GET /export`, `DELETE /events/{id}`):
  - Ensure `429 TooManyRequests` response is present and references enriched example.
  - Ensure `503 ServiceUnavailable` response exists with example.
  - Keep `409 Conflict` example (idempotency) with `details.key`.
- Validate in a linter to confirm OpenAPI 3.0 compliance.

## Postman Load & Monitoring (workspace/05_API/heatmap_api_postman.json)
- Add a “Load Runner” folder:
  - Requests simulating multiple users with varied pacing (bursts, steady, ramp-up) using iteration data.
  - Collection-level scripts:
    - Capture headers `X-RateLimit-*` and response times into env vars.
    - Compute mean, p95, p99 and error rate per window.
  - Duration target: ≥ 15 minutes via Newman (iterations/time-based).
- Add a “Trend Report” request that prints:
  - Requests/sec (derived from samples), latency distribution, error rate breakdown.
- Provide monitoring options:
  - Postman Monitor (configured schedule); or Node runner `scripts/postman-runner.js` using Newman with scheduling.

## Sequence Diagrams (workspace/05_API/analytics-heatmap-api.md)
- Add mermaid sequence for `GET /events`:
  - Auth flow, parameter validation, optional caching layer, pagination (cursor/limit), response formatting.
- Add mermaid sequence for `GET /stats`:
  - Aggregation pipeline, filtering (page/from/to), formatting totals/topSelectors.
- Include a legend section explaining components (Client, Gateway, Service, Cache, DB) and key steps.

## Consistency & Validation
- Keep examples aligned with actual schemas/types.
- Re-run Swagger UI import and Newman run to verify no errors.
- Ensure documentation continues to render diagrams and examples correctly after changes.

On approval, I will update the YAML with enriched 429/409/503 examples and headers, expand the Postman collection for load, add monitoring script scaffolding, and insert the new sequence diagrams with legend into the Markdown spec, then validate end-to-end.