# CI/CD Pipeline

## CI (PR)
- Install deps (pnpm)
- Lint, type-check
- Unit & contract tests
- Build packages/apps
- Publish preview artefak (Storybook, OpenAPI)

## CD
- main → staging auto-deploy
- Manual promote ke production
- Canary/Blue-Green untuk orchestrator
 - Ephemeral preview per PR: frontend (Vercel/edge) & backend (k8s namespace)

## Turbo Cache
- Enable remote caching untuk mempercepat build lintas runner.
