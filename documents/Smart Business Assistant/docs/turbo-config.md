# TurboRepo Config (Optimal)

## pnpm-workspace.yaml
```
packages:
  - "apps/*"
  - "packages/*"
```

## turbo.json
```
{
  "globalDependencies": ["pnpm-lock.yaml"],
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**", "!.next/cache/**"] },
    "lint": { "cache": true },
    "type-check": { "cache": true, "outputs": ["tsc/**"] },
    "test": { "dependsOn": ["^build"], "outputs": ["coverage/**"] },
    "docs": { "outputs": ["docs/**"] },
    "storybook": { "outputs": ["storybook-static/**"] },
    "e2e": { "cache": false },
    "dev": { "cache": false, "persistent": true }
  }
}
```

## package.json (root)
```
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "type-check": "turbo run type-check",
    "docs": "turbo run docs",
    "storybook": "turbo run storybook",
    "e2e": "turbo run e2e",
    "clean": "turbo run clean"
  }
}
```

## Catatan
- Aktifkan remote cache untuk CI.
- Standarkan output ke `dist/**` untuk packages dan `.next/**` untuk apps.
